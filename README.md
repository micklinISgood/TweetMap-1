# TweetMap-1


[demo](https://www.youtube.com/watch?v=3-tCE43Lw8Y)

1. Open elapse/ in eclipse and host it on tomcat java 8. 
   
   You should see a TweetMap on your browser hosted on this url if succeeded.
         
         http://localhost:8080/elapse/TweetElapse.html
   
   on EC2
   
         cp elapse.war /var/lib/tomcat8/webapps/
          
2. command: 

         cd fetcher
         python sentiment.py

3. This shuold give you 10 markers on the TweetMap. 
      
         http://localhost:8080/elapse/TweetElapse.html


4. Query from elastic search
  
  Click on a keyword or enter a location to request a query on  `http://localhost:8080/elapse/TweetElapse.html`


5. Real time fetching
         
         cd fetcher/run
         do README
         
Install following packages if `python sentiment.py` doesn't work:

Install textblob

    pip install -U textblob
    python -m textblob.download_corpora

[google-translate](https://github.com/MrS0m30n3/google-translate)

    sudo pip install doodle-translate
 
[twodict](https://github.com/MrS0m30n3/twodict)
    
    sudo pip install twodict

Install websocket

    pip install ws4py
