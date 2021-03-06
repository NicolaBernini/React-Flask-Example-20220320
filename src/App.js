import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import TextField from '@mui/material/TextField';
import logo from './logo.svg';
import './App.css';

import { useTable } from 'react-table';

function App() {

/*
  const data = React.useMemo(
    () => [
      {
        col1: 'WETH',
        col2: '152',
        col3: '1',
      },
      {
        col1: 'WBTC',
        col2: '122',
        col3: '2',
      },
      {
        col1: 'DAI',
        col2: '356',
        col3: '3',
      },
    ],
    []
);
*/

const [swapToken, setSwapToken] = React.useState('DAI');

const handleChangeSwapToken = (event, newValue) => {
  setSwapToken(newValue);
  console.log(`[handleChangeSwapToken()] NewVal = ${newValue}`);
  poolPrice(newValue, tradeAmount);
};


const [data, setData] = useState([]);

const [tradeAmount, setTradeAmount] = useState('');

const handleChangeTradeAmount = (event) => {
  setTradeAmount(event.target.value);
  console.log(`[handleChangeTradeAmount()] NewVal = ${event.target.value}`);
  poolPrice(swapToken, event.target.value);
};


const [finalPrice, setFinalPrice] = useState('');


const columns = React.useMemo(
  () => [
    {
      Header: 'Token',
      accessor: 'col1', // accessor is the "key" in the data
    },
    {
      Header: 'Amount',
      accessor: 'col2',
    },
    {
      Header: 'Price',
      accessor: 'col3', // accessor is the "key" in the data
    },
  ],
  []
);

function poolBuy() {
  //console.log(tradeAmount.target.value);
  fetch(`/buy?token=${swapToken}&amount=${tradeAmount}`).then(res => res.json()).then(data => {
    //console.log(`Data is ${data.res}`);
    setData(data);
  });
}

function poolPrice(token, amount) {

  fetch(`/price?token=${token}&amount=${amount}`).then(res => res.json()).then(data => {
    console.log(`Data is ${data.res}`);
    setFinalPrice(data.res);
  });

  // fetch(`/price?token=${swapToken}&amount=${tradeAmount}`).then(res => res.json()).then(data => {
  //   console.log(`Data is ${data.res}`);
  //   setFinalPrice(data.res);
  // });
}

const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
} = useTable({ columns, data });

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  useEffect(() => {
    fetch('/data').then(res => res.json()).then(data => {
      setData(
        //[
        data,
        //[]
      //]
      ); 
    });
  }, []);

  /*
  this.state = {
    amount : 0
  }
  */

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>The current time is {currentTime}.</p>



        <div>
          <h1>Pool</h1>
       <table {...getTableProps()} style={{ border: 'solid 1px black' }}>
         <thead>
         {headerGroups.map(headerGroup => (
             <tr {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map(column => (
                   <th
                       {...column.getHeaderProps()}
                       style={{
                         borderBottom: 'solid 3px red',
                         color: 'black',
                       }}
                   >
                     {column.render('Header')}
                   </th>
               ))}
             </tr>
         ))}
         </thead>
         <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
               <tr {...row.getRowProps()}>
                 {row.cells.map(cell => {
                   return (
                       <td
                           {...cell.getCellProps()}
                           style={{
                             padding: '10px',
                             border: 'solid 1px gray',
                           }}
                       >
                         {cell.render('Cell')}
                       </td>
                   )
                 })}
               </tr>
           )
         })}
         </tbody>
       </table>
       <Button variant="contained" onClick={poolBuy}>Buy</Button>
       <ToggleButtonGroup color="primary" value={swapToken} exclusive onChange={handleChangeSwapToken}>
        <ToggleButton value="DAI">DAI</ToggleButton>
        <ToggleButton value="WETH">WETH</ToggleButton>
      </ToggleButtonGroup>
       <TextField id="amountBuy" label="Amount to buy" variant="filled" onChange={handleChangeTradeAmount}/> 
       <TextField id="estimatedOutput" label="Estimated Output" value={finalPrice} InputProps={{
            readOnly: true,
          }} /> 

     </div>

      </header>
      
    </div>
  );
}

export default App;
