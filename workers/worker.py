import boto.sqs, json, inspect, threading, logging, time
conn = boto.sqs.connect_to_region("us-west-2")
queue= conn.get_queue('tweet')
lock = threading.Lock()
# rs = q.get_messages()
logging.basicConfig(level=logging.DEBUG,
                    format='(%(threadName)-10s) %(message)s',)
def worker():
	while True:
	    pending =[]
	    ret =[]
	    lock.acquire()
	    for message in queue.get_messages(1):
	        # process message body
	        # print [name for name,thing in inspect.getmembers(message)]
	        # print message.get_body()
	        body = json.loads(message.get_body())
	        msg =json.loads(body["Message"])
	        ret = msg
	        for k in  msg:
	        	# print k
	        	pending.append(k["status"])

	        # delete fetched msg in the critical section
	        queue.delete_message(message)
	    lock.release()
	    time.sleep(0.2)

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
