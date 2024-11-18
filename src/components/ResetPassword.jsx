import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setMessage('Password has been reset successfully');
        navigate('/login');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center' }}>
      <div className="login-form-container" style={{flexDirection:'column',alignItems:' center',
    justifyContent: 'center'}}>
          <form 
            onSubmit={handleSubmit} 
            style={{ height: '80%', display: 'flex', flexDirection:'column', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent:'space-evenly' }}
          >
            <div style={{width:'95%'}}>
            <h2 style={{marginBlockStart: '0em', marginBlockEnd: '0em', lineHeight: '0' ,textAlign:'center'}}>
              Reset Password
            </h2>
            <a href="/" >
              <i className="fa fa-times" style={{ float: 'right', color: 'lavenderblush' }}></i>
            </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <span style={{fontSize:'20px'}}>New Password</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="box"
                placeholder="Enter New Password"
                required
              />
              <span style={{fontSize:'20px'}}>Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="box"
                placeholder="Confirm New Password"
                required
              />
            </div>
            <input 
              type="submit" 
              value={loading ? 'Resetting...' : 'Reset Password'} 
              className="btn" 
              disabled={loading} 
            />
            {message && <p className="error-message" style={{color:'red'}}>{message}</p>}
          </form>
        </div>
      </div>
  );
};

export default ResetPassword;
