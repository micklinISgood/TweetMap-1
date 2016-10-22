
import java.net.URI;



import com.google.gson.*;


/**
 * Hello world!
 *
 */
public class Worker
{
	//private static NotifyClientEndpoint clientEndPoint;
	
    public static void main( String[] args ) throws Exception{  


      TweetFetch fetcher = new TweetFetch(2);
      try {
          System.out.println("Waiting for threads to finish.");
          fetcher.t.join();
   
        } catch (InterruptedException e) {
          System.out.println("Main thread Interrupted");
        }
    	
    }
    
    // private static String getMessage(String message) {
    //     return Json.createObjectBuilder()
    //                    .add("user", "bot")
    //                    .add("message", message)
    //                .build()
    //                .toString();
    // }
}
