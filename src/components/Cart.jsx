import React, { useState, useEffect } from 'react';
import '../style.css';
import Cookies from 'js-cookie';

const Cart = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [estimatedTaxes, setEstimatedTaxes] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [total, setTotal] = useState(0);
  const [coupon, setCoupon] = useState(0);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/cart', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${Cookies.get('jwtToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
        } else {
          console.error('Failed to fetch cart:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const newSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newMRPTotal = cartItems.reduce((acc, item) => acc + (item.mrp * item.quantity), 0);
    setSubtotal(newSubtotal);
    setEstimatedTaxes(newSubtotal > 50 ? 20: 0);

    const newTotal = newSubtotal + estimatedTaxes - coupon;
    setTotal(newTotal);

    const newTotalSavings = newMRPTotal - newSubtotal;
    setTotalSavings(newTotalSavings);
  }, [cartItems, estimatedTaxes, coupon]);

  const handleRemove = async (productId, size) => {
    try {
      const response = await fetch('http://localhost:5000/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('jwtToken')}`
        },
        body: JSON.stringify({ productId, size }),
        credentials: 'include'
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Product removed from cart:', data);
        const updatedCart = cartItems.filter(item => !(item.productId === productId && item.size === size));
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } else {
        console.error('Failed to remove product from cart on server:', data.message);
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const handleQuantityChange = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return; // Prevent setting quantity below 1
    
    try {
      const response = await fetch('http://localhost:5000/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('jwtToken')}`
        },
        body: JSON.stringify({ productId, size, quantity: newQuantity }),
        credentials: 'include'
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Quantity updated:', result);
        // Update cart state to reflect new quantity
        setCartItems(cartItems.map(item => 
          item.productId === productId && item.size === size 
            ? { ...item, quantity: newQuantity } 
            : item
        ));
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } else {
        console.error('Failed to update product quantity on server:', result.message);
      }
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      setCoupon(10);
    } else {
      setCoupon(0);
    }
  };

  return (
    <div className='cart'>
      <header id="site-header">
        <div>
          <h1>Shopping Cart</h1>
        </div>
      </header>

      <div className="container">
        <div id="cart" style={{ width: '50%' }}>
          {cartItems.length === 0 ? (
            <h1>Your cart is empty</h1>
          ) : (
            cartItems.map(item => (
              <div className="product" key={`${item.productId}-${item.size}`}>
                <header>
                  <a className="remove" onClick={() => handleRemove(item.productId, item.size)}>
                    <img src={item.image} alt={item.name} />
                    <h3>Remove</h3>
                  </a>
                </header>

                <div className="content">
                  <h1>{item.name}</h1>
                  <div title={`You have selected this product to be shipped in the color yellow.`} className="color yellow"></div>
                  <div style={{ top: '43px' }} className="type small">{item.quantity || ' '}</div>
                </div>

                <footer className="content">
                  <span className="qt-minus" onClick={() => handleQuantityChange(item.productId, item.size, item.quantity - 1)}>-</span>
                  <span className="qt">{item.quantity}</span>
                  <span className="qt-plus" onClick={() => handleQuantityChange(item.productId, item.size, item.quantity + 1)}>+</span>
                  <h2 className="full-price">Rs. {item.price * item.quantity}</h2>
                  <h2 className="price">MRP ₹{item.mrp}</h2>
                </footer>
              </div>
            ))
          )}
        </div>

        <div className="site-footer" style={{ backgroundColor: 'white', height: 'fit-content', width: 'fit-content' }}>
          <table style={{ padding: '10px', margin: '10px' }}>
            <tbody>
              <tr><td style={{ float: 'left' }}>Subtotal</td><td>₹ {subtotal}</td></tr>
              <tr><td style={{ float: 'left' }}>Estimated Taxes & Fees</td><td>₹ {estimatedTaxes}</td></tr>
              <tr>
                <td style={{ float: 'left' }}>Add Coupon</td>
                <td>
                  <input 
                    style={{ height: '2rem', width: '100%', fontSize: '1rem' }} 
                    placeholder="Enter Coupon Code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button onClick={handleApplyCoupon} style={{float:'right',
          backgroundColor: '#026502',
          width: '100%',
          color: 'white'
        }}>Apply Coupon</button>
                </td>
              </tr>
              <tr><td style={{ float: 'left' }}>Total Savings</td><td>₹ {totalSavings}</td></tr>
              <tr style={{ backgroundColor: '#026502', color: 'lavenderblush' }}><td style={{ float: 'left' }}>Total</td><td>₹ {total}</td></tr>
            </tbody>
          </table>

          <div>
      <div style={{ padding: '10px 10px' }}>
        <h3>Secure Payment With</h3>
        <ul className="securly-ul-section" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="images/Visa.png" alt="Payment Method 1" style={{ height: '30px', width: '70px', marginRight: '15px' }} />
          <img src="images/masterCard.png" alt="Payment Method 2" style={{ height: '30px', width: '70px', marginRight: '15px' }} />
          <img src="images/GPay.png" alt="Payment Method 3" style={{ height: '30px', width: '70px', marginRight: '15px' }} />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHloHiTb_W5m5sPBrio2WmQwDoT_tR0RQKuQ&usqp=CAU"
            alt="Payment Method 4"
            style={{ height: '30px', width: '70px', marginRight: '15px' }}
          />
          <div className="offers" style={{ height: '30px', width: 'fit-content', marginRight: '15px', gap: 0, borderRadius: 0 }}>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAEx0lEQVRoge3YWaiVVRQH8J9dp3JKK7PJcGqiFCQrmq3MMMwsQ6Uy7EGpCIko66V6CCuCJoiMElMqSg2kIppR0dLqVlqWRVekATNzSHO4Xoce1j6cz+s595zDubceOn/YfNPa317zWntTQw011FBDDTVo18r/64F7cT66YQ9W4jGsa+W1DkJrCtIOSwTzc7ETHTASl+FM/NWK67UZBmA3Di/wrR43tuXi7cugGYtZRb7tRe90fyR2YFcBupU4o2LuKkA5gizCiCLfDjR77o4vCtCdkNYaKYS9pFwGy0U1MfIwzk33E9FFBPRY/N2M9jm8gqXCiouqWLcgyrFIMSzFz+l+FzalsQsfZuh6Cou8hjVVrPev4US8h9UiXqAOL+Gj/4qpSjFB+P63aMDveF1YYB1OamsGKnGtfuiVeW4UjJ8jstoYeZe6EmcLoe5Ex6o5LYFKgv0FXJ95XiuYXSQEeBTHYYMoijnMxRZMa/a/jiJBVIKtDs2UrYKe2IezhFAHsBHjMzR34IMCc29O9JWMzsUYOaw6ORyV/jEcX6FTYnwO+iaajun76QXmfyrcNTfW4ro0/8nM+9NKMVKtIEek67XCMnswDx+L2kI0kodhBgbjdrwsXHGvcLvc2IdBOFqk8dz7kj1apYJMTIzOw9AkSCMuEtbJ4W2MyggyXySATzBOaH5B+p51l18wVVhvS4W8VYSLMT2NAaKrbRBuNSlD1w9Nop7MxkPpXTZL3ib8fru8GxZDHyVipNo2/mqx15iPIcK/c/hOZLNLRSarF51xZ7FXGSWSwDg8hVfxeZF1+mB9mr+7EEE1LQrhWjuxUGyocs8wUzSJa4S/9xTa7yJc9HGhgO/RX8TVZLyf5uWwSSilTXGLfAO4VhTFUpiGZQ6NzweFG/YXHXRuzFaGa7VkkXbyPdNeoc3myFpgIabgLexv4b+/ipjoJ+KrTsTeBJHN1oltwzYhbHuRMFpES4J0wuZ0vwLnFREkt5F6BIvxGd5JDNYJl2ov4qJzmnM8fkhM90wMPyNS8iDhjjPwNe5ycOxVLEijfG+1twhN1iIbMUy42zBRU/YJKz2NH0VjuQcv4gKxwRovYiCnkJ/SurvT/HeV0cqUk7VGCG1nsUJU8BmifkwtMrercMneQtAsJuFZYZlS6CCKaVVZa41IsVlsSNesRQoh59uFKvNi3FrG+lk0VUhfNkaIOlEMPXB3Wy3+v8VyEYwPpOcJIm02iAAm6sKwzJwbxGFDX1Hw6nCFSM1dM/MbcBXuz/xvpnD5KeLQYoioJy32heXEyMmihbhHNH3dxQZnuvwmp6+Di1U3sclaL+rFQNFkNiWG+ouUuh2rcDm+wfNJkNGipXkiCb5ay7Wp7BZlidD40CTEsULr+7V8sNAkLDI4jVWZb2NEis/VqoHpn73E6Uy9SDQ34cJSDFbSa9XJa6VJtNktailhlRBiCN7IvN8qUmluW9yY1tghL/Ac4QHLSi1S7n5ktGjZl6fnbUJjX2ZohguNNj8aXZnmn5rus+/rhUCE204WxTeXCf9MoyTKscgqsXG6TxzKHSMsMl1U3gXCv69JYyb+kE8Es3CKON9aK6p0vSioRNf8m9gS78eb8pV8s/IKZg011FBDDTXUAP8A2SEpwhp3gcUAAAAASUVORK5CYII="
              alt="Cash On Delivery"
              style={{ height: '30px', width: '40px', marginRight: '0' }}
            />
            <div style={{ marginRight: '5px' }}>
             
            </div>
          </div>
        </ul>
      </div>

      <div style={{ padding: '10px 10px' }}>
      <h3 className="headline-primary">Terms & Conditions</h3>
      <h3 style={{ fontSize: '1rem', fontWeight: '100' }}>
        Clicking on "I Agree" means you agree to our{' '}
        <a href="terms/show">Terms & Conditions</a>.
      </h3>
     
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="checkbox"
          id="agree-checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          style={{ marginRight: '10px' }}
        />
        <label htmlFor="agree-checkbox" style={{ fontSize: '.9rem' }}>
          I Agree
        </label>
      </div>
      <button
        type="button"
        disabled={!isChecked}
        style={{
          backgroundColor: '#026502',
          width: '100%',
          color: 'white',
          cursor: isChecked ? 'pointer' : 'not-allowed',
        }}
      >
        Complete Purchase
      </button>
    </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
