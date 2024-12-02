import React, { useState, useEffect } from 'react';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`https://cropconnect-48a7.onrender.com/user`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
            } else {
                console.error('Error fetching user details:', data.message);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchUserDetails();
}, []);

if (loading) return <p>Loading...</p>;
if (!user) return <p>User not found.</p>;

return (
  <div className={`down centered`} style={{paddingBottom:'5.5rem'}}>
    <div className="Letter" >
      <div className="side">
        <p><strong>User Name:</strong> {user.name}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address}</p>
      
        <p><strong>Phone No.:</strong> {user.phone}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>User Type:</strong> {user.type}</p>
        </div>
        
      <div className="side">
      <h1>User Details</h1>
      </div>

    </div>

  </div>
);
};

export default UserDetails;
