import os
from flask import Flask, request, render_template, g, redirect, Response, url_for, flash
import requests
import json

# tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
# app = Flask(__name__, template_folder=tmpl_dir)
app = Flask(__name__)


def msg_process(msg):
    #js = json.loads(msg)
    #print js
    #msg = 'Message: {0}'.format(
    #    js['Message']
    #)
    # do stuff here, like calling your favorite SMS gateway API
    print msg
@app.route('/', methods = ['GET', 'POST', 'PUT'])
def sns():
    # AWS sends JSON with text/plain mimetype
    try:
        js = json.loads(request.data)
    except Exception as e:
        print e

    hdr = request.headers.get('X-Amz-Sns-Message-Type')    
    # subscribe to the SNS topic
    if hdr == 'SubscriptionConfirmation' and 'SubscribeURL' in js:
        r = requests.get(js['SubscribeURL'])

    if hdr == 'Notification':
        print js['Message']
        msg_process(js['Message'])

    return 'OK\n'

if __name__ == '__main__':
    app.run(
        host = "0.0.0.0",
        port = 5000,
        debug = True
    )

