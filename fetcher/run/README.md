Change your twitter [app](https://apps.twitter.com/) keys first
    
    vim keys.txt
  
Build fetcher:

    javac -cp "./lib/*:." *.java
    java -cp "./lib/*:." Worker

I assume that you follow the host step to here. You should see the streaming markers on 
    
    http://localhost:8080/elapse/TweetElapse.html
