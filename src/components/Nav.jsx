import React, { useState, useEffect , useRef} from 'react';
import { useLocation } from 'react-router-dom';
import '../style.css';

const Nav = ({ isLoggedIn, onLogout }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const shouldShowSearch = ['/shop'].includes(location.pathname);
  const show = location.pathname === '/';

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
    <nav className='tp'>
      <div className="logo">
        <img src='images/A (2).png'></img>
      </div>
      <div>
        <ul id="navbar">
          <li><a href="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</a></li>
          {show && <li><a href="/#about" className={({ isActive }) => (isActive ? 'active' : '')}>About</a></li>}
          <li><a href="/predict" className={({ isActive }) => (isActive ? 'active' : '')}>Predict</a></li>
          <li><a href="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>Shop</a></li>
          {location.pathname === '/shop' && (
            <li>
              <a href="#">Product Type</a>
              <div className="sub-menu">
                <ul>
                  <li>
                    <a href="#">
                      UPCOMING OCCASIONS<i className="fa fa-angle-right" style={{ float: 'right'}}></i>
                      <div className="sub-menu1" >
                        <ul>
                          <li><a href="#">Christmas - 25th Dec</a></li>
                        </ul>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      EVERYDAY WEEDING<i className="fa fa-angle-right" style={{ float: 'right' }}></i>
                      <div className="sub-menu1">
                        <ul>
                          <li><a href="#">House Warming</a></li>
                          <li><a href="#">New Born Baby</a></li>
                          <li><a href="#">Wedding</a></li>
                        </ul>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      EMOTIONS/SENTIMENTS<i className="fa fa-angle-right" style={{ float: 'right' }}></i>
                      <div className="sub-menu1">
                        <ul>
                          <li><a href="#">Congratulations</a></li>
                          <li><a href="#">Get Well Soon</a></li>
                          <li><a href="#">Sympathy N Funeral</a></li>
                        </ul>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          )}
          <li><a href="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</a></li>
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
                    src="images/logedin.png" style={{display:'block'}}
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
              <li id="cart">
              <a href="/cart" className={({ isActive }) => (isActive ? 'active' : '')} style={{borderRight:'none'}}>
                <img width="42" height="42"
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
        <i id="bar" className="fas fa-outdent" style={{color:'wheat',}}></i>
        
      </div>
    </nav>
  );
};

export default Nav;
