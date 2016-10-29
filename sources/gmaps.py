import requests
import json

# api_key = 'AIzaSyB6V_cnPLawq06s1_O_1fFYNXB6bqAeunE'
# replaced with Jonathan's API key
api_key = 'AIzaSyA99KgXUFhvyxIbiX_sDprmN9PGYwKbazQ'


class DirectionsApi:
    # api_key = 'AIzaSyB6V_cnPLawq06s1_O_1fFYNXB6bqAeunE'
    api_key = 'AIzaSyA99KgXUFhvyxIbiX_sDprmN9PGYwKbazQ'

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

    def read(self, lat1, long1, lat2, long2, key=None):
        return self.parse(self.make_request(lat1, long1, lat2, long2, key))

    @staticmethod
    def find_surrounding(lat, long, length, mile_increment):
        """Generates coordinates in a square around the center.

        Keyword arguments:
        input_coord -- the coordinate representing the area to be compared with
            all other points in the area
        length -- the length in miles of the side to be used for the area, e.g. 5
            would mean the area would be 25 sq. miles
        mile_increment -- how much space there is between points, e.g. 0.5 would
            mean points are 0.5 miles away from each other in the area

        """

        d = DirectionsApi()
        center = [lat, long]

        all_coords = []  # instead of having this to hold all data, can just post datum by datum to database within the for loop
        top_left_x = round(((float(center[0])) + (145 * length / 2 * 0.0001)), 4)  # x + 145 = 1 mile in ATL
        top_left_y = round(((float(center[1])) - (174 * length / 2 * 0.0001)), 4)  # y - 174 = 1 mile in ATL

        data = []

        for x in range(int(length / mile_increment)):
            coord_x = top_left_x - x * 145 * 0.0001
            for y in range(int(length / mile_increment)):
                coord_y = top_left_y + y * 174 * 0.0001

                """If you want to get duration as well, uncomment below. Above is for testing"""
                try:
                    time = d.read(lat, long, (str)(coord_x), (str)(coord_y))
                    data.append({'lat': coord_x, 'long': coord_y, 'count': time})
                except:
                    print("No transit data")

        return all_coords



