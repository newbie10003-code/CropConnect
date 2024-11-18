import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogSection = () => {
  const [blogEntries, setBlogEntries] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(10);
  const [formData, setFormData] = useState({
    userName: '',
    productName: '',
    description: '',
    image: null,
  });
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
        try {
            const response = await fetch('http://localhost:5000/blog');
            const data = await response.json();
            setBlogEntries(data);  // `data` will be a flattened array of blog entries.
        } catch (error) {
            console.error('Error fetching blog entries:', error);
        }
    };

    fetchBlogs();
  }, []);

  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + 10);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { userName, productName, description, image } = formData;
    const data = new FormData();
    data.append('userName', userName);
    data.append('productName', productName);
    data.append('description', description);
    data.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/new-blog', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setMessage('Blog entry submitted successfully!');
        const updatedBlogs = await fetch('http://localhost:5000/blog');
        const updatedData = await updatedBlogs.json();
        setBlogEntries(updatedData);
        setFormData({
          userName: '',
          productName: '',
          description: '',
          image: null,
        });
        setFormVisible(false);
      } else {
        setMessage('Failed to submit blog entry.');
      }
    } catch (error) {
      console.error('Error submitting blog entry:', error);
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const urls = {};
      for (const entry of blogEntries) {
        try {
          const response = await fetch(`http://localhost:5000/blog-image/${entry._id}`);
          if (response.ok) {
            const { base64Image, contentType } = await response.json();
            urls[entry._id] = `data:${contentType};base64,${base64Image}`;
          }
        } catch (error) {
          console.error(`Error fetching image for blog ${entry._id}:`, error);
        }
      }
      setImageUrls(urls);
    };

    fetchImages();
  }, [blogEntries]);

  const navigate = useNavigate();

  const checkAuthAndRedirect = async () => {
    try {
      const response = await fetch('http://localhost:5000/check-auth', {
        method: 'GET',
        credentials: 'include', 
      });

      if (response.ok) {
        setFormVisible(true);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      navigate('/login');
    }
  };

  return (
    <>
      <section id="page-header">
                <img src="images/feedback-word-collage-style.jpg" alt="Feedback" />
            </section>
            <h2 style={{ textAlign: 'center' }}>#Reviews</h2>
            <p style={{ textAlign: 'center' }}>Read all case studies about our products!</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <section id="blog">
                    {blogEntries.slice(0, visibleReviews).map((review) => (
                        <div key={review._id} className="blog-box" >
                            <div className="blog-img" >
                                <div style={{ overflow: 'hidden' }}>
                                    <img
                                        src={imageUrls[review._id] || 'path/to/default/image.jpg'}
                                        alt={review.productName}
                                    ></img>
                                </div>
                                <div className="blog-details">
                                    <span>{review.userName}</span><i className="fa fa-check" aria-hidden="true"></i>
                                    <h4>{review.productName}</h4>
                                    <p>{review.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
                
                {visibleReviews < blogEntries.length && (
                    <button className="show-btn" onClick={handleLoadMore}>Load More</button>
                )}
            </div>
      

      {formVisible && (
        <div id="pop-up" style={{ display: 'flex', alignItems: 'center',backgroundColor:'lavenderblush' }}>
          <div className="login-form-container" style={{flexDirection:'column',alignItems:'center', justifyContent: 'center',background:'None',width:'0px',height:'0px',padding:'0'}}>
            <form 
              onSubmit={handleSubmit} 
              style={{  display: 'flex', flexDirection:'column', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent:'space-evenly' }}
            >
              <div style={{width:'95%'}}>
                <h2 style={{marginBlockStart: '0em', marginBlockEnd: '0em', lineHeight: '0' ,textAlign:'center'}}>
                  Write a Blog
                </h2>
                <a href="#" onClick={() => setFormVisible(false)}>
                  <i className="fa fa-times" style={{ float: 'right', color: 'lavenderblush' }}></i>
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <span style={{fontSize:'20px'}}>User Name</span>
                <input 
                  type="text" 
                  name="userName" 
                  className="box" 
                  placeholder="Enter Your Name" 
                  value={formData.userName} 
                  onChange={handleChange} 
                  required 
                  autoComplete="on"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <span style={{fontSize:'20px'}}>Product Name</span>
                <input 
                  type="text" 
                  name="productName" 
                  className="box" 
                  placeholder="Enter Product Name" 
                  value={formData.productName} 
                  onChange={handleChange} 
                  required 
                  autoComplete="on"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <span style={{fontSize:'20px'}}>Description</span>
                <textarea 
                  name="description" 
                  className="box" 
                  placeholder="Enter Your Review" 
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <span style={{fontSize:'20px'}}>Image</span>
                <input 
                  type="file" 
                  name="image" 
                  onChange={handleChange} 
                  accept="image/*" 
                  required 
                />
              </div>
              <input type="submit" value={loading ? 'Submitting...' : 'Submit'} className="btn" disabled={loading} />
              {loading && <div className="loading-indicator">Loading...</div>}
              {message && <p className="error-message" style={{color:'red'}}>{message}</p>}
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => {
          setFormVisible(true);
          checkAuthAndRedirect();
      }}

      className='blog-btn'
      >
        <i className="fa fa-plus"></i>
      </button>
    </>
  );
};

export default BlogSection;
