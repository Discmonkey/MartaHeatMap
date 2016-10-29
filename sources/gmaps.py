import requests
import json

# api_key = 'AIzaSyB6V_cnPLawq06s1_O_1fFYNXB6bqAeunE'
# replaced with Jonathan's API key
api_key = 'AIzaSyB6V_cnPLawq06s1_O_1fFYNXB6bqAeunE'


class DirectionsApi:
    # api_key = 'AIzaSyB6V_cnPLawq06s1_O_1fFYNXB6bqAeunE'
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

    def read(self, lat1, long1, lat2, long2, key=None):
        return self.parse(self.make_request(lat1, long1, lat2, long2, key))

    def getGrid(self, offset):
        left = -84.6808815
        right = -84.0808815
        top = 34.0946135
        bottom = 33.4946135
        coords = []
        while left <= right:
            bot = bottom
            while bot <= top:
                coord = [bot, left]
                coords.append(coord)
                bot += offset
            left += offset
        return coords
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
        length = float(length)
        d = DirectionsApi()
        center = [lat, long]

        top_left_x = round(((float(center[1])) - (174 * (length/2) * 0.0001)), 4)  # y - 174 = 1 mile in ATL
        top_left_y = round(((float(center[0])) + (145 * (length/2) * 0.0001)), 4)  # x + 145 = 1 mile in ATL

        data = []
        i = 0
        for x in range(int(length / mile_increment)):
            coord_x = top_left_x + ((x-1) * 174 * 0.0001)
            for y in range(int(length / mile_increment)):
                coord_y = top_left_y - ((y-1) * 145 * 0.0001)
                if i == 0:
                    top_left_point = (coord_y, coord_x)
                    i += 1
                try:
                    time = d.read(lat, long, (str)(coord_y), (str)(coord_x))
                    data.append({'lat': coord_y, 'lng': coord_x, 'count': time})
                except:
                    print("No transit data")
        top_right_point = (coord_y, coord_x)
        return data, list(top_left_point), list(top_right_point)



