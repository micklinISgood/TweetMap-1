package com.fetcher;


public class Tweets {
	long tweetid;
	long userid;
	String username;
	String status;
	double latitude;
	double longitude;
	long epoch;
	String key;
	
	public Tweets(long tweetid,long id, String uname, String status, double latitude, double longitude, long epoch, String x){
		this.userid=id;
		this.username=uname;
		this.status=status;
		this.latitude=latitude;
		this.longitude=longitude;
		this.tweetid = tweetid;
		this.epoch = epoch;
		this.key = x;
	}
	
	
	
	public long getTweetId(){
		return tweetid;
	}
	
	public void setTweetId(long tweetid){
		this.tweetid = tweetid;
	}
	
	public long getEpoch(){
		return epoch;
	}
	
	public void setEpoch(long epoch){
		this.epoch = epoch;
	}
	
	public long getUserId(){
		return userid;
	}
	
	public void setUserId(long id){
		this.userid = id;
	}
	
    
	public String getUserName() {
		return username;
	}

	public void setUserName(String uname) {
		this.username = uname;
	}
	
    
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
    
	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	
    
	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
  


}
