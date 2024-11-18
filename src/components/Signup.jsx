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
  
    // Debug: Log the form data to check userType
    console.log(formData);
  
    if (formData.password !== formData.confirmpassword) {
      setErrorMessage('Passwords do not match');
      setLoading(false);
      setButtonText('Sign Up');
      return;
    }
  
    // Check if userType is either "Farmer" or "Regular Customer"
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
  //StrongP@ss1, Kajal Rawat


  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center' }}>
      <div className="login-form-container" style={{ width: '80%' }}>
        <div style={{ zIndex: 1, display: 'flex', flexWrap: 'wrap' }}>
          <form
            className='mrg'
            onSubmit={handleSubmit}
            style={{ width: '94%', height: '84%', display: 'flex', justifyContent: 'space-around', paddingTop: '20px', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <h2 style={{ margin: '0px 30%', marginBlockStart: '0em', marginBlockEnd: '0em', lineHeight: '0' }}>
              Enter Your Details
            </h2>
            <a href="/">
              <i className="fa fa-times" style={{ float: 'right', color: 'lavenderblush' }}></i>
            </a>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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

              

              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }} className="radio">
                <span>GENDER</span>
                <div style={{ display: 'flex',justifyContent:'space-evenly',alignItems:'center' ,marginTop:'20px'}}>
                  <label style={{ display: 'flex' }}>
                    <input 
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                      required
                    />
                    Male
                  </label >
                  <label style={{ display: 'flex' }}>
                    <input 
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                      required
                    />
                    Female
                  </label>
                  <label style={{ display: 'flex' }}>
                    <input 
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleChange}
                      required
                    />
                    Other
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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

              <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
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
