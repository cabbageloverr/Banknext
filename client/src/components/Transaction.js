import React, { useEffect, useState } from 'react'
import "./Css/Transaction.css"
import Table from 'react-bootstrap/Table';


function Transaction() {
  const [transhistory, setTransferhistory] = useState([]);
  const [receivehistory, setReceivehistory] = useState([]);
  const acct_Num = localStorage.getItem("accNum");
  const accr_Num = localStorage.getItem("acc_Num");

  const [showTransfer, setShowTransfer] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const handleShowTransfer = () => {
    setShowTransfer(true);
    setShowReceive(false);
  }

  const handleShowReceive = () => {
    setShowReceive(true);
    setShowTransfer(false);
  }

  useEffect(() => {
    const handleTransfer = async () => {
      try {
        let res = await fetch("http://localhost:4001/transaction", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            acc_num: acct_Num,
          }),
          mode: "cors",
        })
          .then((response) => {
            if (response.ok) {
              console.log(response)
              response.json().then((data) => {
                console.log(data);
                Array(data.transhistory).map((d, i) => {
                  setTransferhistory([...d]);
                });
                Array(data.receivehistory).map((d, i) => {
                  setReceivehistory([...d]);
                });
                
              })
            }
          });

      } catch (err) {
        console.log(err);
      }


    }
    handleTransfer();
  }, []);


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
            <li class="nav-item">
              <a class="nav-link" href="/transaction">Transaction</a>
            </li>
            <li class="nav-item logout">
              <a class="nav-link" onClickCapture={logout}>log out</a>
            </li>
          </ul>
        </div>
      </nav>
      <div class="container d-flex justify-content-center">
        <button type="submit" class="t-his btn btn-success" onClick={handleShowTransfer}>Transfer History</button>

        <button class="r-his btn btn-warning" onClick={handleShowReceive}>Receive History</button>

      </div>
      <div class="container d-grid justify-content-center">
        {showTransfer &&
        <div>
        <h2 className='history'>Transfer History</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Transferor name</th>
                <th>Amount</th>
                <th>Current Balance</th>
                <th>Receiver name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transhistory.map((transhistory, i) => {
                return (<tr key={i}>
                  <td>{transhistory.transferor}</td>
                  <td>{transhistory.money}</td>
                  <td>{transhistory.current}</td>
                  <td>{transhistory.receiver}</td>
                  <td>{transhistory.date}</td>

                </tr>)
              })
              }
            </tbody>
          </Table>
          </div>
        }

        {showReceive &&
          <div>
            <h2 className='history'>Receive History</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Transferor name</th>
                  <th>Amount</th>
                  <th>Current Balance</th>
                  <th>Receiver name</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {receivehistory.map((receivehistory, i) => {
                  return (<tr key={i}>
                    <td>{receivehistory.transferor}</td>
                    <td>{receivehistory.money}</td>
                    <td>{receivehistory.current}</td>
                    <td>{receivehistory.receiver}</td>
                    <td>{receivehistory.date}</td>
                  </tr>)
                })
                }

              </tbody>
            </Table>
          </div>
        }
      </div>


    </div>
  )
}

export default Transaction
