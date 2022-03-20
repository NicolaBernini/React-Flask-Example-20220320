import React, { useState, useEffect } from 'react';
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

const [data, setData] = useState([]);

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
      Header: 'TBD',
      accessor: 'col3', // accessor is the "key" in the data
    },
  ],
  []
);

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
     </div>

      </header>
      
    </div>
  );
}

export default App;
