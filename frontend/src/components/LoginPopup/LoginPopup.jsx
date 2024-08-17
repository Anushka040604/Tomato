import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    let endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
    const newUrl = `${url}${endpoint}`;

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false); // Hide the login popup
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchState = () => {
    setErrorMessage("");
    setCurrState(currState === "Login" ? "Sign Up" : "Login");
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input 
              name='name' 
              onChange={onChangeHandler} 
              value={data.name} 
              type='text' 
              placeholder='Your Name' 
              required 
            />
          )}
          <input 
            name='email' 
            onChange={onChangeHandler} 
            value={data.email} 
            type='email' 
            placeholder='Your Email' 
            required 
          />
          <input 
            name='password' 
            onChange={onChangeHandler} 
            value={data.password} 
            type='password' 
            placeholder='Password' 
            required 
          />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Processing...' : (currState === "Sign Up" ? "Create Account" : "Login")}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        {currState === "Login" ? (
          <p>Create a new account? <span onClick={switchState}>Click Here</span></p>
        ) : (
          <p>Already have an account? <span onClick={switchState}>Login Here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
