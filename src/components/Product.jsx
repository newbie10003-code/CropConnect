import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style.css';

const Product = () => {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [mainImg, setMainImg] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

  useEffect(() => {
    const fetchProductDetails = async () => {
  try {
    const response = await fetch(`http://localhost:5000/products/${productId}`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const data = await response.json();
    console.log('Product data:', data);
    setProductDetails(data);
    if (data.image && data.image.length > 0) {
      setMainImg(data.image[0]);
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};


    fetchProductDetails();
  }, [productId]);

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  const { name, brand, price, mrp, image = [], description,details , rating, discount } = productDetails;

  const handleImageClick = (src) => {
    setMainImg(src);
  };

  const handleMainImageClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
        alert('Please select a size');
        return;
    }

    const product = {
        productId: productDetails._id,
        quantity: 1,
        name: productDetails.name,
        image: mainImg,
        price: productDetails.price,
        mrp: productDetails.mrp,
        size: selectedSize
    };

    try {
        const response = await fetch('http://localhost:5000/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          alert('Product added to cart');
            console.log('Product added to cart:', data);
            const updatedCart = [...cart, product];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCart(updatedCart);
        } else {
            console.error('Failed to add product to cart on server:', data.message);
        }
    } catch (error) {
        console.error('Error adding product to cart on server:', error);
    }
};


  return (
    <>
      <section id="prodetails" className="section-p1">
        <div className="pro-img">
          <img
            src={mainImg}
            width="100%"
            height="500px"
            alt={name}
            id="zoom"
            onClick={handleMainImageClick}
          />
          <div className="small-img-group">
            {image.map((imgSrc, index) => (
              <div className="small-img-col" key={index}>
                <img
                  src={imgSrc}
                  width="100%"
                  className="small-img"
                  alt={`Product Thumbnail ${index + 1}`}
                  onClick={() => handleImageClick(imgSrc)}
                />
              </div>
            ))}
          </div>
          {showPopup && (
            <div className="pop-up">
              <span onClick={closePopup}>&times;</span>
              <img src={mainImg} alt={name} />
            </div>
          )}
        </div>
        <div className="pro-details">
          <h6>{brand}</h6>
          <h5>{name}</h5>
          <div className="star">
            {[...Array(rating)].map((_, i) => (
              <i key={i} className="fas fa-star"></i>
            ))}
          </div>
          <h4>Selling Price Rs. {price}</h4>
          <p>MRP ₹{mrp} ({discount})</p>
          <h5>(Incl. of all taxes)</h5>
          <select onChange={(e) => setSelectedSize(e.target.value)} value={selectedSize}>
            <option value="">Select Size</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
          <button onClick={handleAddToCart}>Add to Cart</button>
          <h4>Product Details</h4>
          <p>{description}</p>
          <div>
            {details.map((d, index) => (
                <h3>{d}</h3>
            ))}
          </div>
        </div>
      </section>
      {/* Similar Products and Blog sections */}
    </>
  );
};

export default Product;
