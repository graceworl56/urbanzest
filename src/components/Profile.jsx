// components/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

function Profile() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const userId = localStorage.getItem('userId');

    if (userData) {
      // Use localStorage data immediately
      const parsedData = JSON.parse(userData);
      setUser(parsedData);
      setFormData(parsedData);
      setProfileImage(parsedData.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80');
    }

    // Then fetch fresh data from server
    if (userId) {
      fetchUserData(userId);
    } else {
      // Redirect to login if no user data
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE}/users/${userId}`);
      const userData = response.data;
      setUser(userData);
      setFormData(userData);
      setProfileImage(userData.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    }
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;
        setProfileImage(newImage);
        setFormData({ ...formData, profileImage: newImage });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const updatedData = { 
        ...formData, 
        profileImage,
        name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || user.name
      };

      await axios.put(`${API_BASE}/users/${user.id}`, updatedData);
      
      // Update localStorage
      localStorage.setItem('userData', JSON.stringify(updatedData));
      
      setUser(updatedData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const containerStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    position: 'relative',
    padding: '20px'
  };

  const contentStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)'
  };

  if (!user.id) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle} className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* Success and Error Messages */}
        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <i className="fas fa-check-circle me-2"></i>
            {success}
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* Profile Header with Image */}
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="rounded-circle shadow-lg"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover',
                border: '4px solid #2E8B57'
              }}
            />
            {isEditing && (
              <label 
                htmlFor="profileImageUpload"
                className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow"
                style={{ cursor: 'pointer', width: '40px', height: '40px' }}
              >
                <i className="fas fa-camera"></i>
                <input 
                  type="file" 
                  id="profileImageUpload" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
          <h2 className="mt-3 mb-1 fw-bold" style={{ color: '#2c5530' }}>
            {user.name || 'Your Name'}
          </h2>
          <p className="text-muted">{user.email || 'your.email@example.com'}</p>
          <div className="d-flex justify-content-center gap-3 mt-2">
            <span className="badge bg-success">
              <i className="fas fa-star me-1"></i> Premium Member
            </span>
            <span className="badge bg-primary">
              <i className="fas fa-award me-1"></i> Food Lover
            </span>
          </div>
        </div>

        {isEditing ? (
          <div>
            <h4 className="mb-4 border-bottom pb-2" style={{ color: '#2E8B57' }}>
              <i className="fas fa-edit me-2"></i>Edit Profile
            </h4>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">First Name</label>
                  <input 
                    name="firstName" 
                    value={formData.firstName || ''} 
                    onChange={handleChange} 
                    placeholder="First Name" 
                    className="form-control" 
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Last Name</label>
                  <input 
                    name="lastName" 
                    value={formData.lastName || ''} 
                    onChange={handleChange} 
                    placeholder="Last Name" 
                    className="form-control" 
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input 
                name="email" 
                type="email"
                value={formData.email || ''} 
                onChange={handleChange} 
                placeholder="Email" 
                className="form-control" 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number</label>
              <input 
                name="phone" 
                value={formData.phone || ''} 
                onChange={handleChange} 
                placeholder="Phone" 
                className="form-control" 
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Address</label>
              <textarea 
                name="address" 
                value={formData.address || ''} 
                onChange={handleChange} 
                placeholder="Full Address" 
                className="form-control" 
                rows="3"
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">City</label>
                  <input 
                    name="city" 
                    value={formData.city || ''} 
                    onChange={handleChange} 
                    placeholder="City" 
                    className="form-control" 
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Zip Code</label>
                  <input 
                    name="zipCode" 
                    value={formData.zipCode || ''} 
                    onChange={handleChange} 
                    placeholder="Zip Code" 
                    className="form-control" 
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Dietary Preferences</label>
              <select 
                name="dietaryPreference" 
                value={formData.dietaryPreference || ''} 
                onChange={handleChange} 
                className="form-select"
              >
                <option value="">Select Preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten Free</option>
                <option value="none">No Restrictions</option>
              </select>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button 
                className="btn btn-secondary px-4" 
                onClick={() => setIsEditing(false)}
                style={{ borderRadius: '25px' }}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>Cancel
              </button>
              <button 
                className="btn btn-primary px-4" 
                onClick={saveProfile}
                disabled={loading}
                style={{ 
                  backgroundColor: loading ? '#6c757d' : '#2E8B57', 
                  borderColor: loading ? '#6c757d' : '#2E8B57',
                  borderRadius: '25px'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="mb-4 border-bottom pb-2" style={{ color: '#2E8B57' }}>
              <i className="fas fa-user me-2"></i>Profile Information
            </h4>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <strong className="text-muted">Full Name:</strong>
                  <p className="fs-5">{user.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <strong className="text-muted">Member Since:</strong>
                  <p className="fs-5">{user.joinDate || '2024'}</p>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <strong className="text-muted">Email:</strong>
              <p className="fs-5">{user.email || 'Not provided'}</p>
            </div>

            <div className="mb-3">
              <strong className="text-muted">Phone:</strong>
              <p className="fs-5">{user.phone || 'Not provided'}</p>
            </div>

            <div className="mb-3">
              <strong className="text-muted">Address:</strong>
              <p className="fs-5">{user.address || 'Not provided'}</p>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <strong className="text-muted">City:</strong>
                  <p className="fs-5">{user.city || 'Not provided'}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <strong className="text-muted">Zip Code:</strong>
                  <p className="fs-5">{user.zipCode || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <strong className="text-muted">Dietary Preference:</strong>
              <p className="fs-5">
                {user.dietaryPreference ? (
                  <span className="badge bg-info text-dark">{user.dietaryPreference}</span>
                ) : (
                  'Not specified'
                )}
              </p>
            </div>

            {/* Statistics */}
            <div className="row text-center mt-4 pt-4 border-top">
              <div className="col-4">
                <div className="border-end">
                  <h4 className="fw-bold text-primary">{user.orders || 0}</h4>
                  <small className="text-muted">Orders</small>
                </div>
              </div>
              <div className="col-4">
                <div className="border-end">
                  <h4 className="fw-bold text-success">{user.favorites || 0}</h4>
                  <small className="text-muted">Favorites</small>
                </div>
              </div>
              <div className="col-4">
                <h4 className="fw-bold text-warning">{user.rating || '4.8'}</h4>
                <small className="text-muted">Rating</small>
              </div>
            </div>

            <div className="text-center mt-4">
              <button 
                className="btn btn-primary px-4 py-2 me-2" 
                onClick={() => setIsEditing(true)}
                style={{ 
                  backgroundColor: '#2E8B57', 
                  borderColor: '#2E8B57',
                  borderRadius: '25px',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-edit me-2"></i>Edit Profile
              </button>
            
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;