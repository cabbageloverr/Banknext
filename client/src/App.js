import React from 'react'
import Login from './components/Login'
import Home from './components/Home';
import Deposit from './components/Deposit';
import { Routes, Route } from 'react-router-dom';
import Withdraw from './components/Withdraw';
import Transfer from './components/Transfer';
import Transaction from './components/Transaction';
import './App.css';


function App() {
  return (
    <>
    <div className="">
      <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/deposit" element={<Deposit/>}/>
      <Route path="/withdraw" element={<Withdraw/>}/>
      <Route path="/transfer" element={<Transfer/>}/>
      <Route path="/transaction" element={<Transaction/>}/>
    </Routes>
    </div>
    </>
  )
}

export default App
