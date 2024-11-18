import React from 'react'
import { Link } from 'react-router-dom';
const Predict = () => {
  return (
    <div> <section id="category">
    <div className="pro-container">
      <div className="c odd">
        <div className="top">
          <Link to="/crop-disease">
            <img src="images/cropD.jpg" alt="CD" />
          </Link>
          <div className="desc">
            <span>Crop Disease Detection </span>
          </div>
        </div>
      </div>
      <div className="c even">
      <div className="top">
        <Link to="/crop-production">
          <img
            src="images/cropP.jpg"
            alt="CP"
          />
        </Link>
        <div className="desc">
          <span>Crop Recommendation </span>
        </div>
      </div>
      </div>
    </div>
  </section></div>
  )
}

export default Predict