# TweetMap-1


Before cd run,

1. place elapse/ to eclipse and host it on tomcat java 8.

2. command: 

          python fetcher/sentiment.py

3. This shuold give you 10 markers url on your browser. 
      
          localhost:8080/elapse/TweetElapse.html

  
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
