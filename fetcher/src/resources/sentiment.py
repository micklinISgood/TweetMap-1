import sys,json
import google_translate
from textblob import TextBlob
from ws4py.client.threadedclient import WebSocketClient
import requests

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
 

class sentiment:
	def __init__(self,argv):
		#f = open('data.txt', 'r+')
		#self.data = f.read()
		#f.close()
		self.data = argv[1]
		self.json_data = json.loads(self.data)
		# print(self.json_data)
		self.ret = {}
	

	def translate_data(self):
		translator = google_translate.GoogleTranslator()
		for k,v in self.json_data.items():
			# print (v)
			input_s = v["status"]
			lang = translator.detect(input_s)
			trans = False
			self.json_data[k]["location"]={} 
			self.json_data[k]["location"]["lat"] = self.json_data[k]["latitude"]
			self.json_data[k]["location"]["lon"] = self.json_data[k]["longitude"]
		
			if(lang != None):
			
				# remove hashtag for translation convenience
				status = input_s.replace("#", "")
				self.json_data[k]["lang"] = lang
				if(lang != "english"):
					trans = True
					status = translator.translate(input_s,"english")
					self.json_data[k]["status_en"] = status
			

				if(status != None):
					self.get_sentiment(k,status)

		
		res = {}
		res["action"] = KEY
		res["data"] = self.json_data
		return json.dumps(res)
					
				


	def get_sentiment(self, tid, status):
		testimonial = TextBlob(status)
		self.json_data[tid]["sentiment"] = int(testimonial.sentiment.polarity*5 +5)

		# header = {} 
		# for np in testimonial.noun_phrases:
		# 		header[tid]=self.json_data[tid]
		# 		if np in self.ret.keys():
		# 			self.ret[np].append(header) 
		# 		else:
		# 			self.ret[np]=[header]
	
	def set_geo(self):
		prop = {}
		prop["location"] ={}
		prop["location"]["type"] = "geo_point"
		prop["location"]["lat_lon"] = True
		_prop = {}
		_prop["properties"] = prop

		r = requests.post('http://awseb-e-m-awsebloa-1965qkrpsm12d-1830409115.us-east-1.elb.amazonaws.com:9200/sentiment/_mapping/mick', data= json.dumps(_prop))


	def insert_es(self):
		for k,v in self.json_data.items():
			push_d = v
			push_d["tid"]=k

			r = requests.post('http://awseb-e-m-awsebloa-1965qkrpsm12d-1830409115.us-east-1.elb.amazonaws.com:9200/sentiment/mick', data= json.dumps(push_d))
			# print(r.json())





ws = DummyClient('ws://localhost:8080/elapse/conn', protocols=['http-only', 'chat'])
ws.connect()

worker = sentiment(sys.argv)
ret = worker.translate_data()
ws.send(ret)
ws.close()






