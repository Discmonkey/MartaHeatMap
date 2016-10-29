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
            'departure_time': 1477918524,
            'key': key
        }

        return requests.get(url, params=payload)

    def parse(self, response):
        res_json = json.loads(response.content.decode('UTF-8'))
        return res_json['routes'][0]['legs'][0]['duration']['value']

# d = DirectionsApi()
# res_p = d.make_request('33.749358', '-84.409504', '33.730663','-84.440208')
# res_j = d.parse(res_p)
# print(res_j)

def find_surrounding():
    """Generates coordinates in a square around the center"""
    d = DirectionsApi()
    coordinates = ['33.7490', '-84.3880'] # HARDCODED FOR NOW, read in data
    
    all_coords = [] # instead of having this to hold all data, can just post datum by datum to datbase
    top_left_x = round((((float) (coordinates[0])) + (145 * 2.5 * 0.0001)), 4) # x + 145 = 1 mile in ATL
    top_left_y = round((((float) (coordinates[1])) - (174 * 2.5 * 0.0001)), 4) # y - 174 = 1 mile in ATL
    top_left_coord = (top_left_x, top_left_y)
    
    for x in range(5):
        coord_x = top_left_x - x * 145 * 0.0001
        for y in range(5):
            coord_y = top_left_y + y * 174 * 0.0001
            try:
                print(d.parse(d.make_request(coordinates[0], coordinates[1], (str) (coord_x), (str) (coord_y))))
            except:
                print("No transit data")
            
            # all_coords.append((round(top_left_x, 4), round(top_left_y, 4), duration))
            all_coords.append((round(coord_x, 4), round(coord_y, 4)))
    print(all_coords)       
    
find_surrounding()    
    
    