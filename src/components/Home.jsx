import React from 'react';
import '../style.css';


const Home = () => {
  return (
    <div className='down'>
      <section className='hero bg1' style={{ backgroundImage: 'url("/images/banner1.jpg")' }}>
     
    </section>

    <h1 className="heading"><span>About Us</span></h1>
    <div className='ao'>
      <section id="about">
        <h3 style={{padding:"0px 4%",  letterSpacing:"1px"}}>Our platform is dedicated to empowering farmers by providing an integrated digital solution for buying and selling produce, seeds, and farming tools. Through advanced machine learning and AI, we offer personalized crop recommendations and disease classification, helping farmers optimize productivity and make informed decisions. Our key features include:</h3>
          <div className="card">
            <div className="box">
              <div className="content">
                <h2>01</h2>
                <h3>Crop Disease Detection</h3>
                <p>A state-of-the-art image processing and computer vision-based deep learning model that classifies plant
                diseases using images and provides corrective recommendations to fix the problems.</p>
                <a href="/crop-disease">Explore More</a>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="box">
              <div className="content">
                <h2>02</h2>
                <h3>Crop Recommendation</h3>
                <p>An advanced machine learning model that considers physical and climatic factors like soil parameters,
temperature, rainfall, humidity and other physical factors to recommend crops to be grown in a
particular situation and season.</p>
                <a href="/crop-production">Explore More</a>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="box">
              <div className="content">
                <h2>03</h2>
                <h3>All-In-One Marketplace</h3>
                <p>A digital store that connects buyers directly with sellers, reducing the need for middlemen. The users
will be able to buy or sell produce, seeds, pesticides, insecticides, and other utilities for their farms and
can get a fair price.</p>
                <a href="/shop">Explore More</a>
              </div>
            </div>
          </div>
          </section>
      </div>
    </div>
  );
};

export default Home;
