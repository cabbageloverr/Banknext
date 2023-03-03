import React, { useEffect } from 'react'
import { useState } from 'react';
import './Css/Home.css'


function Home() {
  const [ amount, setAmount] = useState("");
  const [ fname, setFname] = useState("");
  const [ lname, setLname] = useState("");
  const accNum = localStorage.getItem( "accNum");
  useEffect(() => {
    const reqToken = async () => {
      if (localStorage.getItem('Token')) {
        let userToken = localStorage.getItem('Token');
        let res = await fetch("http://localhost:4001/home", {
          method: "POST",
          headers: {
            'x-access-token': userToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            acc_num: accNum
        }),
          mode: "cors",
        })
        .then((response) => {
          console.log(response);
          if (response.ok) {
              response.json().then(json => {
                  console.log(json);
                  setFname(json.first_name);
                  setLname(json.last_name);
                  setAmount(json.money);
                  console.log("OKss");
              });
              console.log("OK");
            }
            else {
              window.location.href = 'http://localhost:3000/'
            }
          });
      }
      else{
        window.location.href = 'http://localhost:3000/'
      }
    }
    reqToken();
  }
  ,[]);

  const logout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('accNum');
    window.location.href = 'http://localhost:3000/'
    

  }
  
  
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-danger">
        <a class="navbar-brand">Banknext</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item active">
              <a class="nav-link" href="/home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/deposit">Deposit</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/withdraw">Withdraw</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/transfer">Transfer</a>
            </li>
            <li class="nav-item logout">
              <a class="nav-link" onClickCapture={logout}>log out</a>
            </li>
          </ul>
        </div>
      </nav>
      <div class="container d-flex justify-content-center">
        <h1 className='welcome-text'>Welcome <span class="name">{fname} {lname} </span>to <span class="clicknext">Banknext </span>banking application</h1>
      </div>
      <h1 className="amount">Your amount <span class="amount-num">{ amount } ฿</span></h1>
    </div>
  )
}

export default Home