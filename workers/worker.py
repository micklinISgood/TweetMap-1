import boto.sqs, json, inspect, threading, logging, time, requests
conn = boto.sqs.connect_to_region("us-west-2")
queue= conn.get_queue('tweet')
lock = threading.Lock()

from ws4py.client.threadedclient import WebSocketClient
KEY = "UpdateKeyWords" 

class DummyClient(WebSocketClient):
    def opened(self):
    	pass
    	# print "open"

    def closed(self, code, reason=None):
        pass

    def received_message(self, m):
    	pass
        # print m

from alchemyapi import AlchemyAPI
alchemyapi = AlchemyAPI()


logging.basicConfig(level=logging.DEBUG,
                    format='(%(threadName)-10s) %(message)s',)
def worker():
	ws = DummyClient('ws://localhost:8080/elapse/conn', protocols=['http-only', 'chat'])
	ws.connect()
	while True:

	    ret =[]

	    lock.acquire()
	    for message in queue.get_messages(1):

	        # print [name for name,thing in inspect.getmembers(message)]
	        # print message.get_body()
	        body = json.loads(message.get_body())
	        msg =json.loads(body["Message"])
	        ret = msg

	        # delete fetched msg in the critical section
	        # queue.delete_message(message)
	    lock.release()
	    if ret:
	    	for k in ret:
				# print k["status"]
				response = alchemyapi.sentiment("text", k["status"])
				# print response["language"]
				# print response["docSentiment"]
				if "docSentiment" not in response:
					k["sentiment"]=0
					continue
					
				if "score" not in response["docSentiment"]:
					k["sentiment"]=0
				else:
					k["sentiment"]=int(float(response["docSentiment"]["score"])*10)

				requests.post('http://awseb-e-m-awsebloa-1965qkrpsm12d-1830409115.us-east-1.elb.amazonaws.com:9200/sentiment/mick', data= json.dumps(k))
				# print "Sentiment: "+response["docSentiment"]["type"]
		
		res={}
		res["action"] = KEY
		res["data"] = ret
		ws.send(json.dumps(res))
		# time.sleep(0.2)


	    '''
	    do analysis with pending & ret[i]["sentiment"] = analyzed score
	    socket.send(json.dump(ret)) 
	    '''



threads = []
for i in range(2):
    t = threading.Thread(target=worker, name="worker"+str(i))
    t.setDaemon(True)
    threads.append(t)
    t.start()

#let worker threads have time to work, main thread just sleeps
while True:
	time.sleep(20)
# for t in threads:
# 	t.join()
