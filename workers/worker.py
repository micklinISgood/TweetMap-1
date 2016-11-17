import boto.sqs, json, inspect, threading, logging, time
conn = boto.sqs.connect_to_region("us-west-2")
queue= conn.get_queue('tweet')
# rs = q.get_messages()
logging.basicConfig(level=logging.DEBUG,
                    format='(%(threadName)-10s) %(message)s',)
def worker():
	while True:
	    messages_to_delete = []

	    for message in queue.get_messages(1):
	        # process message body
	        # print [name for name,thing in inspect.getmembers(message)]
	        # print message.get_body()
	        body = json.loads(message.get_body())
	        msg =json.loads(body["Message"])
	        pending =[]
	        # print msg
	        logging.debug('Enter')
	        for k in  msg:
	        	print k
	        	pending.append(k["status"])
	        # print pending

	        # print body, message.id, message.receipt_handle
	        # add message to delete
	    #     messages_to_delete.append({
	    #         'Id': message.message_id,
	    #         'ReceiptHandle': message.receipt_handle
	    #     })

	    # # if you don't receive any notifications the
	    # # messages_to_delete list will be empty
	    # if len(messages_to_delete) == 0:
	    #     break
	    # # delete messages to remove them from SQS queue
	    # # handle any errors
	    # else:
	    #     delete_response = queue.delete_messages(
	    #             Entries=messages_to_delete)
threads = []
for i in range(2):
    t = threading.Thread(target=worker, name="worker"+str(i))
    t.setDaemon(True)
    threads.append(t)
    t.start()
    time.sleep(1)