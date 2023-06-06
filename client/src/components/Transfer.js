import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./Css/Transfer.css"

function Transfer() {
  const [money, setMoney] = useState("");
  const [acc_re, setAccreceiver] = useState("");
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [amount, setAmount] = useState("");
  const reload = () => window.location.reload();
  var accNum = localStorage.getItem('accNum');
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
                setAmount(json.money);
                console.log(json);
                console.log("OKss");
              });
              console.log("OK");
            }
            else {
              window.location.href = 'http://localhost:3000/'
            }
          });
      }
      else {
        window.location.href = 'http://localhost:3000/'
      }
    }
    reqToken();

  }

    , []);
  let handleTransfer = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("http://localhost:4001/transfer", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transferor: accNum,
          transfer_money: Number(money),
          receiver: acc_re
        }),
        mode: "cors",
      })

    } catch (err) {
      console.log(err);
    }
    handleShow();
  }

  const handleClose = () => {
    setShow(false)
    reload();
  };
  const logout = () => {
    localStorage.removeItem('Token');
    localStorage.removeItem('accNum');
    window.location.href = 'http://localhost:3000/'


  }

  return (
    <div><nav class="navbar navbar-expand-lg navbar-dark bg-danger">
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
          <li class="nav-item">
            <a class="nav-link" href="/transaction">Transaction</a>
          </li>
          <li class="nav-item logout">
            <a class="nav-link" onClickCapture={logout}>log out</a>
          </li>
        </ul>
      </div>
    </nav>
      <div class="d-flex justify-content-center"><h1 className="current">Your current balance is <span class="bl-num">{amount} </span>฿</h1></div>
      <div class="container d-flex justify-content-center">
        <div class="with-text">
          <h1>Transfer</h1>
          <form>
            <div class="mb-3">
              <label class="amout form-label">Receiver account number</label>
              <input type="text" class="form-control" value={acc_re}
                onChange={(e) => setAccreceiver(e.target.value)} />
            </div>
            <div class="mb-3">
              <label class="amout form-label">Amount</label>
              <input type="text" class="form-control" value={money}
                onChange={(e) => setMoney(e.target.value)} />
            </div>
            <button type="submit" class="tf-btn btn btn-danger " onClick={handleTransfer}>Transfer</button>
          </form>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Transfer success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your amount will update</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Transfer