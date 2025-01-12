import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonText, setButtonText] = useState('Sign Up');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    gender: '',
    age: '',
    country: '',
    address: '',
    password: '',
    confirmpassword: '',
    type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setButtonText('Signing Up...');
  
    console.log(formData);
  
    if (formData.password !== formData.confirmpassword) {
      setErrorMessage('Passwords do not match');
      setLoading(false);
      setButtonText('Sign Up');
      return;
    }
  
    if (formData.type !== 'farmer' && formData.type !== 'customer') {
      setErrorMessage('Please select a valid user type');
      setLoading(false);
      setButtonText('Sign Up');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(data.message || 'Signup failed');
          setButtonText('Try Again');
        } else {
          navigate('/login');
        }
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        setErrorMessage('An unexpected error occurred');
        setButtonText('Try Again');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setErrorMessage('An unexpected error occurred');
      setButtonText('Try Again');
    } finally {
      setLoading(false);
      setTimeout(() => setButtonText('Sign Up'), 2000);
    }
  };
  //StrongP@ss1, K


  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center' }}>
      <div className="login-form-container">
        <div style={{ zIndex: 1, display: 'flex', flexWrap: 'wrap' ,alignItems:'center'}}>
          <form
            className='mrg'
            onSubmit={handleSubmit}
            style={{width:'90%'}}
          >
            <h2>
              Enter Your Details
            </h2>
            <a href="/">
              <i className="fa fa-times" style={{ float: 'right', color: 'lavenderblush' }}></i>
            </a>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
              <div className='lable'>
                <span>NAME</span>
                <input 
                  type="text"
                  name="name"
                  className="box"
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className='lable'>
                <span>EMAIL</span>
                <input 
                  type="text"
                  name="email"
                  className="box"
                  placeholder="Enter Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className='lable'>
                <span>PHONE NUMBER</span>
                <input 
                  type="text"
                  name="number"
                  className="box"
                  placeholder="Enter Your Number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>

              

              <div className='lable'>
                <span>AGE</span>
                <input 
                  type="text"
                  name="age"
                  className="box"
                  placeholder="Enter Your Age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className='lable'>
                <span>COUNTRY</span>
                <input 
                  type="text"
                  name="country"
                  className="box"
                  placeholder="Enter Your Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className='lable'>
                <span>ADDRESS</span>
                <input 
                  type="text"
                  name="address"
                  className="box"
                  placeholder="Enter Your Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className='lable'>
              <span>USER TYPE</span>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="box"
                required
              >
                <option value="">Select User Type</option>
                <option value="farmer">Farmer</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <div className='lable'>
                <span>GENDER</span>
                <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="box"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                </select>
              </div>
              <div className='lable'>
                <span>PASSWORD</span>
                <input 
                  type="password"
                  name="password"
                  className="box"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className='lable'>
                <span>CONFIRM PASSWORD</span>
                <input 
                  type="password"
                  name="confirmpassword"
                  className="box"
                  placeholder="Enter Your Confirm Password"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            <input type="submit" value={buttonText} className="btn" disabled={loading} />
            {loading && <div className="loading-indicator">Loading...</div>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
