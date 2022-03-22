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
        self.fees = 0.3

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


    def get_amount_in_given_amount_out(self, tokenOut, amountOut):
        if isinstance(amountOut, str) and not amountOut.isdigit():
            return 0
        gamma = 1 - self.fees
        R_in = self.balance.state[0]['col2']
        R_out = self.balance.state[1]['col2']

        if tokenOut == self.balance.state[0]['col1']:
            R_in = self.balance.state[1]['col2']
            R_out = self.balance.state[0]['col2']

        k = R_in * R_out

        res = ( 1 / gamma ) * ( k / ( R_out - int(amountOut) ) - R_in )

        return res
    
    def swap(self, tokenOut, amountOut):
        amountOut = int(amountOut)
        amountIn = self.get_amount_in_given_amount_out(tokenOut, amountOut)
        indexOut = 0 if tokenOut == self.balance.state[0]['col1'] else 1
        indexIn = 1 if indexOut == 0 else 0
        R_in = int(self.balance.state[indexIn]['col2'])
        R_out = int(self.balance.state[indexOut]['col2'])
        self.balance.state[indexIn]['col2'] = R_in + amountIn
        self.balance.state[indexOut]['col2'] = R_out - amountOut
    
    
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
    pool.swap(token, amount)
    return get_current_data()



@app.route('/price')
def pool_price():
    token = request.args.get('token')
    amount = request.args.get('amount')
    print(f"Estimate Price for Pool Buy Token = {token} Amount = {amount}")
    return json.dumps({'res': pool.get_amount_in_given_amount_out(token, amount)})

