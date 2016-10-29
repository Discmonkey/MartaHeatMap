from flask import Flask, render_template, Request
from sources.gmaps import DirectionsApi
import json

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/getMap', methods=['GET','POST'])
def get_map():
    request_params = json.loads(Request.data)
    lat = request_params['lat']
    long = request_params['long']
    length = request_params['length']
    d = DirectionsApi()
    heatmap = DirectionsApi.find_surrounding(lat, long, length, .5)

    return json.dumps(heatmap), 200, {'Content-Type': 'application/json;charset=UTF-8'}

if __name__ == '__main__':
    app.run()
