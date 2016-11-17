package com.fetcher;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.io.*;
import java.lang.*;
import java.net.URI;
import java.text.SimpleDateFormat;
import com.google.gson.*;

import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.ConfigurationBuilder;
import twitter4j.FilterQuery;

public class TweetFetch implements Runnable{
  private String PYTHON_PATH = "";
	private TwitterStream twitterStream = null;
	private StatusListener listener = null;
	private Thread thread;
	private int batchSize;
	private List<Tweets> tweetsList;
	private sqs q;
	private snsPublisher snsP;

	public Thread t;

	private static String[] key = {
			"careerarc",
			"want",
			"good",
			"tokyo",
			"job",
			"london",
			"wind",
			"rain",
			"love",
			"turkey"
};

	public TweetFetch(int batchSize) throws Exception {
		
		    
		this.batchSize = batchSize;
		this.tweetsList = new ArrayList<Tweets>(batchSize);
		this.q = new sqs();
		this.snsP = new snsPublisher();
		t = new Thread(this, "fetcher");
		System.out.println("New thread: " + t);
		t.start();
		
	}
	
	@Override
	public void run() {
		fetchTweets();
	}


	
	public void stop() {
		stopfetch();
		executePython();
	}
	  
	public void stopfetch(){
		if (listener!=null) twitterStream.removeListener(listener);
 		twitterStream.shutdown();
		twitterStream=null;
	}
	
    public void fetchTweets() {
        ConfigurationBuilder cb = new ConfigurationBuilder();
        String[] questions = {" Consumer Key :"," Consumer Secret :"," Access Token :", " Access Token Secret :"};
        String[] accessKeys = new String[5];
    	//Get file from resources folder
    	ClassLoader classLoader = getClass().getClassLoader();
    	File file = new File(classLoader.getResource("keys.txt").getFile());


        try {
        Scanner scanner = new Scanner(file);
      

        for(int x=0; x< 5 ; x++ ){

            //System.out.print(questions[x]);
            String[] tmp = scanner.nextLine().split(":");
            // System.out.print(Arrays.toString(tmp));
            accessKeys[x] = tmp[1]; 
            //System.out.print(accessKeys[x]);

        }
             scanner.close();
        } 
          catch (FileNotFoundException e) {
            e.printStackTrace();
        }
   
        PYTHON_PATH = accessKeys[4];
        cb.setDebugEnabled(true)
        	.setOAuthConsumerKey(accessKeys[0])
            .setOAuthConsumerSecret(accessKeys[1])
            .setOAuthAccessToken(accessKeys[2])
            .setOAuthAccessTokenSecret(accessKeys[3]);
        
        
        twitterStream = new TwitterStreamFactory(cb.build()).getInstance();
        StatusListener listener = new StatusListener() {
          @Override
          public void onStatus(Status status) {
            
            if (status.getGeoLocation() == null)
            	return;
            //System.out.println("tweetID: time"+status.getId() + status.getCreatedAt().toString()+status.getCreatedAt().getTime()/1000L+status.getUser().getId() + status.getUser().getScreenName() + status.getText() );
            Tweets t = new Tweets(status.getId(),status.getUser().getId(),status.getUser().getScreenName(),status.getText(),status.getGeoLocation().getLatitude(),status.getGeoLocation().getLongitude(),status.getCreatedAt().getTime()/1000L,"none");
                
            for(String x:key){
            	if(status.getText().toLowerCase().contains(x)){
            		t.key = x;
                break;
            	}
            }

            tweetsList.add(t);

            if (tweetsList.size() == batchSize) {
                  executePython();
                  tweetsList.clear();
            }
        
          }

          @Override
          public void onDeletionNotice(StatusDeletionNotice statusDeletionNotice) {
            //System.out.println("Got a status deletion notice id:" + statusDeletionNotice.getStatusId());
          }

          @Override
          public void onTrackLimitationNotice(int numberOfLimitedStatuses) {
            //System.out.println("Got track limitation notice:" + numberOfLimitedStatuses);
          }

          @Override
          public void onScrubGeo(long userId, long upToStatusId) {
            System.out.println("Got scrub_geo event userId:" + userId + " upToStatusId:" + upToStatusId);
          }

          @Override
          public void onStallWarning(StallWarning warning) {
            System.out.println("Got stall warning:" + warning);
          }

          @Override
          public void onException(Exception ex) {
            ex.printStackTrace();
          }
        };
        
 
        
        twitterStream.addListener(listener); 
        FilterQuery fq = new FilterQuery();
        fq.track(key);
        twitterStream.sample();

    }
    
    private void executePython(){

    	
    	  JsonArray done = new JsonArray();
    	  for(Tweets t : tweetsList){
    		  
    		  JsonObject line = new JsonObject();
    		  line.addProperty("tid", t.getTweetId());
    		  line.addProperty("latitude", t.getLatitude());
    		  line.addProperty("longitude", t.getLongitude());
    		  line.addProperty("name", t.getUserName());
    		  line.addProperty("epoch", t.getEpoch());
    		  line.addProperty("userid", t.getUserId());
    		  line.addProperty("status", t.getStatus());
    		  line.addProperty("key", t.key);
    		  done.add(line);
    	  }
    	  //System.out.println(done.toString());
  
  //   	  BufferedWriter out;
		// try {
		// 	out = new BufferedWriter(new FileWriter("data.txt"));	
		// 	out.write(done.toString());
		// 	out.close();
		// } catch (IOException e1) {
		// 	e1.printStackTrace();
		// }
    	  //System.out.println(q.get().toString());
    	  snsP.publish(done.toString());
    	  q.count();
//    	  ClassLoader classLoader = getClass().getClassLoader();
//      	  File file = new File(classLoader.getResource("sentiment.py").getFile());
// 
//    	  ProcessBuilder pb = new ProcessBuilder(PYTHON_PATH,file.getPath(),done.toString());
//    	  Process p;
//		try {
//			p = pb.start();
//			BufferedReader in = new BufferedReader(new InputStreamReader(p.getErrorStream()));
//	    	String o = in.readLine();
//	    	while(o !=null){
//   		  System.out.println(o);
//   		  o = in.readLine();
//	    	}
//		} catch (IOException e) {
//		// TODO Auto-generated catch block
//		e.printStackTrace();
//		}
    	  
    }
    
   
}

