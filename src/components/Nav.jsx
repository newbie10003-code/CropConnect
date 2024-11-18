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
            <a href="/" style={{borderRight:'none'}}>
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAx0lEQVRIie2U0QqCQBBFj31gW6H4UN9eUGSF/YGBPbSCyK7MjEpEe8AnZ+7ZXWeFROKfKIAncAU2ir4tcANqINdKM9/Y+qcBSkFf6Wu7vlorBnj0AiTyobQF7hbxLhAUk4ekjc8wkQcCX8ChV1NEavZWqUS+mLQjdpTSTzGJ0M4X26lUrpaulOLM+G4SoUEam/ZZ+MpwjV0ZyT2fXdoxu9wFArW/TGcRX4TSMfnZIq4U0pi8sogdnxUf0R2ZA06+d20RJxK/yRsz0J/5iLMyRAAAAABJRU5ErkJggg=="
                alt="Close"
              />
            </a>
          </li>
        </ul>
      </div>
      <div id="mobile">
        <a href="/cart">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA9ElEQVRIid3UPy5EURzF8Q8FCgURNY0FSMQaDInKVqxBZgMqyRTCCqaU0NuBckaFkjwKf4r7S7yMZNz7vCfhJLf7/s45N/eXy3/RG97jDLoIeK0FPGO1ixAY1oKansu64exEwHELJafefgY30WS3wHQJ9zG3/x18GOCwIKAfM1c58DKepM3ayODXUQW/ldtoEI36Gex5sKe55rAZQw9YmMJtS80rrJUEwLX81TwqNV/BXYZxhTPMlwachMGFtLqtalH6Ll7kbVGx5vCo2TeRrQN5b9A4oHPt4RZj9Frgvmjs89qjn3CT3/WvqSe1G2GnBe4P6wMWynZC39nrkQAAAABJRU5ErkJggg=="
            title="Cart"
            alt="Cart"
          />
        </a>
        <i id="bar" className="fas fa-outdent"></i>
      </div>
    </nav>
  );
};

export default Nav;
