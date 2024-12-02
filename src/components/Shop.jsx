import React, { useEffect, useState } from 'react';
import '../style.css';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://cropconnect-48a7.onrender.com/products');
                const data = await response.json();

                const shuffledProducts = data.sort(() => 0.5 - Math.random());
                setProducts(shuffledProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    const banners = [
        {
            imgSrc: 'images/d1.jpg'
        },
        {
            imgSrc: 'images/d2.jpg'
        },
        {
            imgSrc: 'images/d3.jpg'
        },
    ];

  return (
    <div style={{display:'flex',flexDirection:'column'}}>
      <section className='hero bg2 down'>
      </section>

      <section id="type">
        <div className="pro-container">
          <div className="pro">
            <a href="">
              <img src="https://img.icons8.com/?size=100&id=2AOL9UrqPQsf&format=png&color=000000" alt="Tools" />
            </a>
            <div className="des">
              <span>TOOLS</span>
            </div>
          </div>
          <div className="pro">
            <a href="">
              <img src="https://img.icons8.com/?size=100&id=tTP3IPxmtiGt&format=png&color=000000" alt="Crops" />
            </a>
            <div className="des">
              <span>CROPS</span>
            </div>
          </div>
          <div className="pro">
            <a href="">
              <img src="https://img.icons8.com/?size=100&id=idz-17CfzRp2&format=png&color=000000" alt="Seed" />
            </a>
            <div className="des">
              <span>SEEDS</span>
            </div>
          </div>
          <div className="pro">
            <a href="">
              <img src="https://img.icons8.com/?size=100&id=DY4fmvlFT2KR&format=png&color=000000" alt="Pecticide" />
            </a>
            <div className="des">
              <span>PECTICIDES</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="p1" className="section-p1">
                <h2>Featured Products</h2>
                <p>Winter Collection New Modern Styles</p>
                <div className="pro-container">
                    {products.map(product => (
                        <div className="pro" key={product._id} onClick={() => handleClick(product._id)}>
                            <img src={product.image[0]} alt={product.name} />
                            <div className="des">
                                <span>{product.brand}</span>
                                <h5>{product.name}</h5>
                                <div className="star">
                                    {[...Array(product.rating)].map((_, i) => (
                                        <i key={i} className="fas fa-star"></i>
                                    ))}
                                </div>
                                <p>Selling Price Rs. {product.price}</p>
                                <h4>MRP ₹{product.mrp} ({product.discount})</h4>
                                <h5>(Incl. of all taxes)</h5>
                            </div>
                            <div className="cart">♡</div>
                        </div>
                    ))}
                </div>
            </section>

      <div
        id="deals"
        style={{
          flexWrap: 'nowrap',
          alignItems: 'center',
          margin: '1rem 1rem',
          justifyContent: 'center',
          backgroundImage: 'none',
        }}
      >
        <div className="ds">
          <img
            src="https://img.freepik.com/free-vector/watercolor-harvest-festival-celebration-illustration_23-2149614386.jpg?ga=GA1.1.1937549596.1710587811&semt=ais_hybrid"
            style={{ width: '100%', height: '60vh' }}
            alt="Deals Image"
          />
        </div>
        <section id="banner" className="section-m1">
          <div className="top">
            
          </div>
        </section>
      </div>

      {/* New Arrivals Section */}
      <section id="p1" className="section-p1">
                <h2>New Arrivals</h2>
                <p>Winter Collection New Modern Styles</p>
                <div className="pro-container">
                    {products.map(product => (
                        <div className="pro" key={product._id} onClick={() => handleClick(product._id)}>
                            <img src={product.image[0]} alt={product.name} />
                            <div className="des">
                                <span>{product.brand}</span>
                                <h5>{product.name}</h5>
                                <div className="star">
                                    {[...Array(product.rating)].map((_, i) => (
                                        <i key={i} className="fas fa-star"></i>
                                    ))}
                                </div>
                                <p>Selling Price Rs. {product.price}</p>
                                <h4>MRP ₹{product.mrp} ({product.discount})</h4>
                                <h5>(Incl. of all taxes)</h5>
                            </div>
                            <div className="cart">♡</div>
                        </div>
                    ))}
                </div>
            </section>

      {/* Additional Deals Section */}
      <section id="deals">
        <div className="banner-box2">
          
        </div>
        <div className="banner-box2">
        </div>
      </section>

      {/* Additional Deals Section 2 */}
      <section id="deals2">
      {banners.map((banner, index) => (
        <div
          key={index}
          className='banner-box1'
          style={{
            backgroundImage: `url(${banner.imgSrc})`
            
          }}
        >
        </div>
      ))}
    </section>
    </div>
  );
};

export default Shop;
