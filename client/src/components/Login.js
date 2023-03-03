import React from 'react'
import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import './Css/Login.css'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    let handleSignIn = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch("http://localhost:4001/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                mode: "cors",
            })

                .then((response) => {
                    console.log(response);
                    if (response.ok) {
                        response.json().then(json => {
                            console.log(json);
                            localStorage.setItem('Token', json.token);
                            localStorage.setItem('accNum', json.acc_num);
                        });
                    window.location.href='http://localhost:3000/home'
                    }
                });

        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div className="Auth-form-container">
        <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              className="form-control mt-1"
              placeholder="Enter password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button onClick={handleSignIn} type="submit" className="signin-btn btn btn-danger">
              Sign in
            </button>
          </div>
        </div>
      </form>
 </div>
    )
}

export default Login