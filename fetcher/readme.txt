
Before cd run,
1. place ../server to eclipse and host it on tomcat java 8.
2. command: 
   
    python sentiment.py 
    
   This shuold give you 10 markers @url: 
      
      localhost:8080/server/TweetElapse.html
    
    on your browser.
  
Install following packages if python sentiment.py doesn't work:

pip install -U textblob
python -m textblob.download_corpora
sudo pip install doodle-translate
sudo pip install twodict
pip install ws4py
