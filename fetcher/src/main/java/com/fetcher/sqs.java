package com.fetcher;

import java.util.*;


import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sqs.*;
import com.amazonaws.services.sqs.model.*;


public class sqs {
	AmazonSQS q;
	String q_url;
	String q_name ="tweet";
	
	public	sqs(){
		   AWSCredentials credentials = null;
	        try {
	            credentials = new ProfileCredentialsProvider("default").getCredentials();
	        } catch (Exception e) {
	            throw new AmazonClientException(
	                    "Cannot load the credentials from the credential profiles file. " +
	                    "Please make sure that your credentials file is at the correct " +
	                    "location, and is in valid format.", e);
	        }
	        q = new AmazonSQSClient(credentials);
	        Region usWest2 = Region.getRegion(Regions.US_WEST_2);
	        q.setRegion(usWest2);
	        q_url = getQueueUrl();
//	        System.out.println(q_url);
	        if(q_url==null){
		        CreateQueueRequest createQueueRequest = new CreateQueueRequest(q_name);
		        q_url = q.createQueue(createQueueRequest).getQueueUrl();
	        }
		
	}
	private String getQueueUrl(){
		try{
			return q.getQueueUrl(q_name).getQueueUrl();
		}catch(Exception e){
//			System.out.println(e);
			return null;
		}
	}
	
	public void put(String data){
		q.sendMessage(new SendMessageRequest(q_url, data));
	}
	
	public Message get(){
		ReceiveMessageRequest receiveMessageRequest = new ReceiveMessageRequest(q_url);
		List<Message> messages = q.receiveMessage(receiveMessageRequest).getMessages();
		for (Message message : messages) {
			return message;
		}
		return null;
	}
	public void delete(String target){
		q.deleteMessage(new DeleteMessageRequest(q_url, target));
	}
	public void delete_q(){
		q.deleteQueue(new DeleteQueueRequest(q_url));
	}
	public void count(){
		GetQueueAttributesRequest request = new GetQueueAttributesRequest(q_url);
		request.withAttributeNames("All");
		Map<String, String> content =  q.getQueueAttributes(request).getAttributes();            
		
		for(Map.Entry<String,String> e : content.entrySet()){
			System.out.println(e.getKey()+","+e.getValue());
		}
		
		System.out.println("number of messages:" +content.get("ApproximateNumberOfMessages"));
	}
}
