import React, { useState, useEffect , useRef} from 'react';
import { useLocation } from 'react-router-dom';
import '../style.css';

const Nav = ({ isLoggedIn, onLogout }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const shouldShowSearch = ['/shop'].includes(location.pathname);
  const show = location.pathname === '/';
  const isProductPage = location.pathname.startsWith('/products/' || '/cart');
  const navClass = isProductPage ? '' : 'fixed-nav';

  useEffect(() => {
    const bar = document.getElementById('bar');
    const close = document.getElementById('close');
    const nav = document.getElementById('navbar');

    const handleBarClick = () => {
      nav.classList.add('active');
    };

    const handleCloseClick = () => {
      nav.classList.remove('active');
    };

    if (bar) {
      bar.addEventListener('click', handleBarClick);
    }

    if (close) {
      close.addEventListener('click', handleCloseClick);
    }

    return () => {
      if (bar) {
        bar.removeEventListener('click', handleBarClick);
      }

      if (close) {
        close.removeEventListener('click', handleCloseClick);
      }
    };
  }, []);

  const handleDropdownToggle = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`tp ${navClass}`}>
      <div className="logo">
        <img src='images/A (2).png' alt=""></img>
      </div>
      <div>
        <ul id="navbar">
          <li><a href="/" >Home</a></li>
          {show && <li><a href="/#about">About</a></li>}
          <li><a href="/predict" >Predict</a></li>
          <li><a href="/shop" >Shop</a></li>
          {location.pathname === '/shop' && (
            <li>
            <a href="#">Product Type</a>
            <div className="sub-menu">
              <ul>
                <li>
                  <a href="#">
                    Fertilizers <i className="fa fa-angle-right" style={{ float: 'right' }}></i>
                    <div className="sub-menu1">
                      <ul>
                        <li><a href="#">NPK Fertilizers</a></li>
                        <li><a href="#">Organic Fertilizers</a></li>
                        <li><a href="#">Potassium Fertilizers</a></li>
                        <li><a href="#">Micronutrient Fertilizers</a></li>
                      </ul>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Pesticides <i className="fa fa-angle-right" style={{ float: 'right' }}></i>
                    <div className="sub-menu1">
                      <ul>
                        <li><a href="#">Insecticides</a></li>
                        <li><a href="#">Fungicides</a></li>
                        <li><a href="#">Herbicides</a></li>
                        <li><a href="#">Miticides</a></li>
                      </ul>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Seeds <i className="fa fa-angle-right" style={{ float: 'right' }}></i>
                    <div className="sub-menu1">
                      <ul>
                        <li><a href="#">Vegetable Seeds</a></li>
                        <li><a href="#">Fruit Seeds</a></li>
                        <li><a href="#">Flower Seeds</a></li>
                        <li><a href="#">Herb Seeds</a></li>
                      </ul>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Garden Tools <i className="fa fa-angle-right" style={{ float: 'right' }}></i>
                    <div className="sub-menu1">
                      <ul>
                        <li><a href="#">Shovels</a></li>
                        <li><a href="#">Rakes</a></li>
                        <li><a href="#">Pruners</a></li>
                        <li><a href="#">Wheelbarrows</a></li>
                      </ul>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </li>
          
          )}
          <li><a href="/contact" >Contact</a></li>
          {shouldShowSearch && (
            <li>
              <section id="search">
                <input className="searchtext" type="text" placeholder="Search" />
                <a className="searchbutton" href="#" style={{borderRight:'none'}}>
                  <i className="fas fa-search"></i>
                </a>
              </section>
            </li>
          )}
          
          <li id="user">
            {isLoggedIn ? (
              <>
                  <img 
                    src="images/logedin.png" height="45"
                    alt="User" title="User" onClick={handleDropdownToggle} 
                  />
                {isDropdownOpen && (
                  <div className="sub-menu" style={{ zIndex:100}}>
                    <ul>
                    <li><a href="/user">User Details</a></li>
                    <li>
                    <a href="#" onClick={onLogout}>Logout</a>
                    </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <a href="/login" style={{borderRight:'none'}}>
                <img
                  
                  title="Login"
                  src="images/login.png"
                  alt="Login"
                />
              </a>
            )}
          </li>
          {isLoggedIn && 
              <li id="report">
              <a href="/report-history" style={{borderRight:'none', paddingRight:'0'}}>
                <img  height="50"
                  src="images/report.png"
                  title="Cart"
                  alt="Cart"
                />
              </a>
            </li>
          }
          {isLoggedIn && 
              <li id="cart">
              <a href="/cart" style={{borderRight:'none'}}>
                <img  height="45"
                  src="images/cart.png"
                  title="Cart"
                  alt="Cart"
                />
              </a>
            </li>
          }
          <li id="close">
            <a href="/">
              X
            </a>
          </li>
        </ul>
      </div>
      <div id="mobile">
      {isLoggedIn && <a href="/cart" style={{padding:'5px'}}>
          <img
            src="images/cart.png" width="25" height="25"
            title="Cart"
            alt="Cart"
          />
        </a>}
        {isLoggedIn ? (
              <>
                  <img 
                    src="images/logedin.png" style={{display:'block'}}
                    alt="User" title="User" onClick={handleDropdownToggle} 
                    width="25" height="25" 
                  />
                {isDropdownOpen && (
                  <div className="sub-menu" style={{ zIndex:100}}>
                    <ul>
                    <li><a href="/user">User Details</a></li>
                    <li>
                    <a href="#" onClick={onLogout}>Logout</a>
                    </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <a href="/login" style={{borderRight:'none'}}>
                <img
                  title="Login"
                  src="images/login.png"
                  alt="Login"
                  width="25" height="25"
                />
              </a>
            )}
            {isLoggedIn && 
              <a href="/report-history" style={{borderRight:'none'}}>
                <img  height="33" width="28" 
                  src="images/report.png"
                  title="Cart"
                  alt="Cart"
                />
              </a>
          }
        <i id="bar" className="fas fa-outdent" style={{color:'wheat',}}></i>
        
      </div>
    </nav>
  );
};

export default Nav;
