import requests
import json

api_key = 'AIzaSyB6V_cnPLawq06s1_O_1fFYNXB6bqAeunE'

class DirectionsApi:
    api_key = 'AIzaSyB6V_cnPLawq06s1_O_1fFYNXB6bqAeunE'

    def make_request(self, lat1, long1, lat2, long2, key=None):

        if key is None:
            key = DirectionsApi.api_key

        url = 'https://maps.googleapis.com/maps/api/directions/json'

        payload = {
            'origin': lat1 + ',' + long1,
            'destination': lat2 + ',' + long2,
            'mode': 'transit',
            'key': key
        }

        return requests.get(url, params=payload)

    def parse(self, response):
        res_json = json.loads(response.content.decode('UTF-8'))
        return res_json['routes'][0]['legs'][0]['duration']['value']

d = DirectionsApi()
res_p = d.make_request('33.749358', '-84.409504', '33.730663','-84.440208')
res_j = d.parse(res_p)
print(res_j)