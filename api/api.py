import time
import json
import copy
from flask import Flask, request

app = Flask(__name__)

class Balance:
    def __init__(self):
        self.state = [
        {
            'col1': 'WETH',
            'col2': 332,
        },
        {
            'col1': 'DAI',
            'col2': 356,
        },
        ]

class Pool:
    def __init__(self, _state):
        self.balance = Balance()
        self.balance.state = _state

    def get_price(self, token):
        if self.balance.state[0]['col1'] == token:
            price = self.balance.state[1]['col2'] / self.balance.state[0]['col2']
        else:
            price = self.balance.state[0]['col2'] / self.balance.state[1]['col2']
        print(f"Price {price}")
        return price

    def get_state(self):
        res = copy.deepcopy(self.balance.state)
        res[0]['col3'] = self.get_price(self.balance.state[0]['col1'])
        res[1]['col3'] = self.get_price(self.balance.state[1]['col1'])
        return res
    
    def swap(self, token, amount):
        pass
    
    
pool = Pool([
        {
            'col1': 'WETH',
            'col2': 332,
        },
        {
            'col1': 'DAI',
            'col2': 356,
        },
        ])

@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/data')
def get_current_data():
    return json.dumps(pool.get_state())
    #return json.dumps(pool.state)

@app.route('/buy')
def pool_buy():
    token = request.args.get('token')
    amount = request.args.get('amount')
    print(f"Pool Buy Token = {token} Amount = {amount}")
    return json.dumps({'res': 1})

