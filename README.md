# TweetMap-1


Before cd fetcher/run,

1. Open elapse/ in eclipse and host it on tomcat java 8. 
   
   You should see a TweetMap on your browser hosted on this url if succeeded.
         
         http://localhost:8080/elapse/TweetElapse.html
          
2. command: 

          cd fetcher
          python sentiment.py

3. This shuold give you 10 markers on the TweetMap. 
      
          http://localhost:8080/elapse/TweetElapse.html



4. Real time fetching
         
         cd fetcher/run
         do README
         
Install following packages if `python fetcher/sentiment.py` doesn't work:

Install textblob

    pip install -U textblob
    python -m textblob.download_corpora

[google-translate](https://github.com/MrS0m30n3/google-translate)

    sudo pip install doodle-translate
 
[twodict](https://github.com/MrS0m30n3/twodict)
    
    sudo pip install twodict

Install websocket

    pip install ws4py
