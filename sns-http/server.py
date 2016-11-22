import os
from flask import Flask, request, render_template, g, redirect, Response, url_for, flash
import requests
import json

# tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
# app = Flask(__name__, template_folder=tmpl_dir)
app = Flask(__name__)

from ws4py.client.threadedclient import WebSocketClient
KEY = "UpdateKeyWords" 

class DummyClient(WebSocketClient):
    def opened(self):
        #pass
        print "open sock"

    def closed(self, code, reason=None):
        pass

    def received_message(self, m):
        pass
        # print m


def msg_process(msg):
    js = json.loads(msg)

    #print js["latitude"]
    # do stuff here, like calling your favorite SMS gateway API
    #print msg
    for row in js["data"]:
        if row["sentiment"]!=20:
            requests.post('http://awseb-e-m-awsebloa-1965qkrpsm12d-1830409115.us-east-1.elb.amazonaws.com:9200/sentiment/mick', data=json.dumps(row))
    print msg
    ws.send(msg)
    
@app.route('/', methods = ['GET', 'POST', 'PUT'])
def sns():

    # AWS sends JSON with text/plain mimetype
    try:
        js = json.loads(request.data)
    except Exception as e:
        print e

    hdr = request.headers.get('X-Amz-Sns-Message-Type')  
    #print js 
    # subscribe to the SNS topic
    if hdr == 'SubscriptionConfirmation' and 'SubscribeURL' in js:
        r = requests.get(js['SubscribeURL'])
        print r

    if hdr == 'Notification':
        #print js['Message']
        msg_process(js['Message'])

    return 'OK\n'

if __name__ == '__main__':
    ws = DummyClient('ws://54.190.17.120:8080/elapse/conn', protocols=['http-only', 'chat'])
    ws.connect()
    app.run(
        host = "0.0.0.0",
        port = 5000,
        debug = True
    )

