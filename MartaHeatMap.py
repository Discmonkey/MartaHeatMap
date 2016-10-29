from flask import Flask, render_template, request
from sources.gmaps import DirectionsApi
import json
import os

app = Flask(__name__)

def get_cache(lat, lng, length):
    file_name = str(lat) + str(lng) + str(length)
    if os.path.isfile('/Users/maxg/PycharmProjects/MartaHeatMap/cache/' + file_name):
        f = open('/Users/maxg/PycharmProjects/MartaHeatMap/cache/' + file_name)
        return json.loads(f.read())
    else:
        return False

def write_cache(lat, lng, length, object):
    file_name = str(lat) + str(lng) + str(length)
    f = open('/Users/maxg/PycharmProjects/MartaHeatMap/cache/' + file_name, 'w')
    f.write(json.dumps(object))

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/getMap', methods=['GET','POST'])
def get_map():
    if request.method == 'POST':
        data = request.form
        lat = data['lat']
        lng = data['lng']
        length = data['length']

        cache = get_cache(lat, lng, length)

        if cache:
            return json.dumps(cache), 200, {'Content-Type': 'application/json;charset=UTF-8'}

        d = DirectionsApi()
        heatmap = d.find_surrounding(lat, lng, length, .5)
        write_cache(lat, lng, length, heatmap)

        return json.dumps(heatmap), 200, {'Content-Type': 'application/json;charset=UTF-8'}

if __name__ == '__main__':
    app.run()
