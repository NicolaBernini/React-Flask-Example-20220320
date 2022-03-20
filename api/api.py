import time
import json
from flask import Flask

app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/data')
def get_current_data():
    return json.dumps(
        [
        {
            'col1': 'WETH',
            'col2': '152',
            'col3': '31',
        },
        {
            'col1': 'WBTC',
            'col2': '122',
            'col3': '32',
        },
        {
            'col1': 'DAI',
            'col2': '356',
            'col3': '33',
        },
        ]
    )
