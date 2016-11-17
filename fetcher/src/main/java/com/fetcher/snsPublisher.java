package com.fetcher;

import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sns.AmazonSNSClient;
import com.amazonaws.services.sns.model.PublishRequest;


public class snsPublisher {
	AmazonSNSClient  amazonSNSClient;
	public snsPublisher(){
		 AWSCredentials credentials = null;
	        try {
	            credentials = new ProfileCredentialsProvider("default").getCredentials();
	        } catch (Exception e) {
	            throw new AmazonClientException(
	                    "Cannot load the credentials from the credential profiles file. " +
	                    "Please make sure that your credentials file is at the correct " +
	                    "location, and is in valid format.", e);
	        }
	        amazonSNSClient = new AmazonSNSClient(credentials);
	        Region usWest2 = Region.getRegion(Regions.US_WEST_2);
	        amazonSNSClient.setRegion(usWest2);
	}
	public void publish(String message){
		 PublishRequest publishRequest = new PublishRequest("arn:aws:sns:us-west-2:631081141903:tweet", message);
		 amazonSNSClient.publish(publishRequest);
	}
}
