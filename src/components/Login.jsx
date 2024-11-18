import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';
import Cookies from 'js-cookie';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('regular'); // New state for user type
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonText, setButtonText] = useState('Sign In');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setButtonText('Signing In...');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: username,
          email,
          password,
          userType, // Include the user type in the request payload
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed');
        setButtonText('Try Again');
      } else {
        const data = await response.json();
        setIsLoggedIn(true);
        Cookies.set('jwt', data.token, { expires: 7 });
        console.log('Login successful');
        localStorage.setItem('jwt', data.token);

        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An unexpected error occurred');
      setButtonText('Try Again');
    } finally {
      setLoading(false);
      setTimeout(() => setButtonText('Sign In'), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center' }}>
      <div className="login-form-container">
        
        <div style={{ zIndex: 1 }}>
          <form onSubmit={handleSubmit} style={{ width: '45rem', float: 'right' }} className='mrg'>
            <a href="/">
              <i className="fa fa-times" style={{ float: 'right', color: 'lavenderblush' }}></i>
            </a>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="box"
              placeholder="Enter Your Name"
              required
            />
            <span>Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="box"
              placeholder="Enter Your Email"
              required
            />
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="box"
              placeholder="Enter Your Password"
              required
              autoComplete="off"
            />
           
                <span>USER TYPE</span>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="box"
                  required
                >
                  <option value="">Select User Type</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Regular Customer">Regular Customer</option>
                </select>

            <div style={{ position: 'relative' }}>
              <input
                type="submit"
                value={buttonText}
                className="btn"
                disabled={loading}
              />
              {loading && <div className="loading-indicator">Loading...</div>}
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>Forget Password? <a href="/forgot-password">click here</a></p>
            <p>Don't have an Account? <a href="/signup">create an account</a></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
