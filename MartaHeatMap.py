from flask import Flask, render_template, request
from sources.gmaps import DirectionsApi
import json
import os
import os
file_path = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)

def get_cache(lat, lng, length):
    file_name = str(lat) + str(lng) + str(length)
    if os.path.isfile(file_path + '/cache/' + file_name):
        f = open(file_path + '/cache/' + file_name)
        return json.loads(f.read())
    else:
        return False

def write_cache(lat, lng, length, object):
    file_name = str(lat) + str(lng) + str(length)
    f = open(file_path + '/cache/' + file_name, 'w')
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
        heatmap, top_left, bottom_right = d.find_surrounding(lat, lng, length, .5)
        return_obj = {
            'heatmap': heatmap,
            'top_left': top_left,
            'bottom_right': bottom_right
        }
        write_cache(lat, lng, length, return_obj)

        return json.dumps(return_obj), 200, {'Content-Type': 'application/json;charset=UTF-8'}

if __name__ == '__main__':
    app.run()
