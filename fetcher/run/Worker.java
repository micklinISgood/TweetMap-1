
import java.net.URI;



import com.google.gson.*;

import sun.misc.Signal;
import sun.misc.SignalHandler;

/**
 * Hello world!
 *
 */
public class Worker
{
	  private static TweetFetch fetcher;
	
    public static void main( String[] args ) throws Exception{  


      fetcher = new TweetFetch(2);
      try {
          System.out.println("Waiting for threads to finish.");
          fetcher.t.join();
   
        } catch (InterruptedException e) {
          System.out.println("Main thread Interrupted");
        }
    	  Signal.handle(new Signal("TERM"), new SignalHandler() {
        @Override
          public void handle(Signal signal) {
              killAllThread();
          }
        });
    }
   
    protected static void  killAllThread() {
      if (fetcher != null) {
        fetcher.stop();
      }
    
    }
  
  
}
