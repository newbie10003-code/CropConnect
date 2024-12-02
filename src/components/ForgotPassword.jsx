import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://cropconnect-48a7.onrender.com/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('A password reset link has been sent to your email.');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Error during forgot password:', error);
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
              Forgot Password
            </h2>
            <a href="/" >
              <i className="fa fa-times" style={{ float: 'right', color: 'lavenderblush' }}></i>
            </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <span style={{fontSize:'20px'}}>Email Address</span>
              <input 
                type="email" 
                name="email" 
                className="box" 
                placeholder="Enter Your Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                autoComplete="on"
              />
            </div>
            <input type="submit" value={loading ? 'Sending...' : 'Send Reset Link'} className="btn" disabled={loading} />
            {loading && <div className="loading-indicator">Loading...</div>}
            {message && <p className="error-message" style={{color:'red'}}>{message}</p>}

            <p>Remembered your password? <a href="/login">Login here</a></p>
          </form>
        </div>
      </div>
    
  );

};

export default ForgotPassword;
