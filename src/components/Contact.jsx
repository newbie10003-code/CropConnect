import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          query: '',
        });
      } else {
        alert('Failed to send the query.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    setIsSent(true);
  };

  return (
    <>
    <div className={`down centered ${isSent ? "sent" : ""}`}>
    
      <form className="letter" onSubmit={handleSubmit} >
        <div className="side">
          <h1>Contact us</h1>
          <p>
            <textarea name="query" value={formData.query} placeholder="Your message" required onChange={handleChange} ></textarea>
          </p>
        </div>
        <div className="side">
          <p>
            <input name="name" value={formData.name} type="text" placeholder="Your name" required onChange={handleChange} />
          </p>
          <p>
            <input name="email" value={formData.email} type="email" placeholder="Your email" required onChange={handleChange} />
          </p>
          <p>
            <input name="phone" value={formData.phone} type="text" placeholder="Your Number" required onChange={handleChange} />
          </p>
          <p>
            <button type='submit'>
              Send
            </button>
          </p>
        </div>
      </form>
      <div className="envelope front"></div>
      <div className="envelope back"></div>
      <p className="result-message centered">Thank you for your message</p>
    </div>
      <div style={{ textAlign: 'center', zIndex: 'inherit' }}>
        <h3 style={{ fontWeight: '400' }}> For Customer Support & Queries:</h3>
        <p>Call us at Customer Care no. : 1800-000-1111</p>
        <p>Email us at cropconnect@gmail.com</p>
        <p>(Operational Timings: 08:00AM to 10:00PM)</p>
      </div>
    </>
  );
};

export default Contact;
