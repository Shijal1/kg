import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Badge, ProgressBar, Modal } from 'react-bootstrap';
import { Trash, Plus, Dash, Truck, GeoAlt, Clock, CheckCircle, Box } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import './cart.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const items = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    setCartItems(items);
    
    if (user) {
      setShippingAddress(user.address || '');
      setPhone(user.phone || '');
    }
    
    const handleStorageChange = () => {
      const updatedItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
      setCartItems(updatedItems);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.13;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const checkoutHandler = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!shippingAddress || !phone) {
      setError('Please provide shipping address and phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          address: shippingAddress,
          phone: phone
        },
        paymentMethod: 'Cash on Delivery'
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post('/api/orders', orderData, config);
      
      // For cash on delivery, redirect to order confirmation
      navigate(`/order/${data._id}`);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const simulateShippingTracking = () => {
    // In real app, this would fetch from API
    const mockTracking = {
      orderId: `ORDER${Date.now().toString().substr(-6)}`,
      status: 'on_the_way',
      estimatedDelivery: new Date(Date.now() + 45*60*1000).toLocaleTimeString(),
      deliveryPerson: 'Rajesh Thapa',
      deliveryPersonPhone: '+977 9801234567',
      currentLocation: {
        lat: 27.7172,
        lng: 85.3240,
        address: 'Near Thamel, Kathmandu'
      },
      progress: 75,
      steps: [
        { status: 'completed', label: 'Order Confirmed', time: '10:30 AM' },
        { status: 'completed', label: 'Preparing Food', time: '10:45 AM' },
        { status: 'completed', label: 'Dispatched', time: '11:15 AM' },
        { status: 'current', label: 'On the Way', time: '11:30 AM' },
        { status: 'pending', label: 'Delivered', time: '12:15 PM' }
      ]
    };
    setTrackingInfo(mockTracking);
    setShowShippingModal(true);
  };

  return (
    <Container className="cart-page py-5">
      <div className="cart-header text-center mb-5">
        <h1 className="fw-bold display-5">Your Culinary Journey</h1>
        <p className="text-muted">Review your selections before proceeding</p>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="animate__animated animate__shakeX">
          {error}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart text-center py-5">
          <div className="empty-cart-icon mb-4">🛒</div>
          <h4 className="text-muted mb-3">Your cart feels lonely</h4>
          <p className="mb-4">Add some delicious Nepali flavors to get started!</p>
          <Button as={Link} to="/menu" variant="primary" size="lg" className="px-4">
            Explore Our Menu
          </Button>
        </div>
      ) : (
        <Row>
          <Col lg={8}>
            <Card className="cart-items-card shadow border-0">
              <Card.Body>
                <h4 className="fw-bold mb-4 d-flex align-items-center">
                  <Box className="me-3" />
                  Order Items ({cartItems.length})
                </h4>
                
                <div className="table-responsive">
                  <Table hover className="cart-table">
                    <thead>
                      <tr>
                        <th className="product-col">Product</th>
                        <th className="price-col">Price</th>
                        <th className="quantity-col">Quantity</th>
                        <th className="total-col">Total</th>
                        <th className="action-col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item._id} className="cart-item-row">
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="cart-item-image">
                                <img 
                                  src={`public/images/${item.image}`} 
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "public/images/default-food.jpg";
                                  }}
                                />
                              </div>
                              <div className="cart-item-details">
                                <div className="fw-bold item-name">{item.name}</div>
                                <small className={`category-badge ${item.category}`}>
                                  {item.category === 'veg' ? 'Vegetarian' : 
                                   item.category === 'non-veg' ? 'Non-Vegetarian' : 
                                   item.category}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="fw-semibold price-cell">Rs. {item.price}</td>
                          <td>
                            <div className="quantity-control">
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="quantity-btn"
                              >
                                <Dash />
                              </Button>
                              <span className="quantity-display">{item.quantity}</span>
                              <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="quantity-btn"
                              >
                                <Plus />
                              </Button>
                            </div>
                          </td>
                          <td className="fw-bold total-cell">Rs. {item.price * item.quantity}</td>
                          <td>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => removeItem(item._id)}
                              className="remove-btn"
                              title="Remove item"
                            >
                              <Trash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            {/* Shipping Information */}
            <Card className="shipping-card shadow border-0 mt-4">
              <Card.Body>
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                  <GeoAlt className="me-2" />
                  Delivery Information
                </h5>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Delivery Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Enter your complete delivery address"
                      className="address-input"
                    />
                    <Form.Text className="text-muted">
                      Include landmarks for easier delivery
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Contact Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="phone-input"
                    />
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            {/* Order Summary */}
            <Card className="order-summary-card shadow border-0 sticky-top">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4 border-bottom pb-3">Order Summary</h5>
                
                <div className="summary-details mb-4">
                  <div className="summary-item">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">Rs. {calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-muted">Tax (13%)</span>
                    <span>Rs. {calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="text-muted">Delivery</span>
                    <span className="text-success">FREE</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-total">
                    <h5>Total Amount</h5>
                    <h3 className="text-primary fw-bold">Rs. {calculateGrandTotal().toFixed(2)}</h3>
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 py-3 fw-bold checkout-btn"
                  onClick={checkoutHandler}
                  disabled={loading || !user}
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </span>
                  ) : user ? (
                    `Proceed to Checkout`
                  ) : (
                    'Login to Checkout'
                  )}
                </Button>
                
                {!user && (
                  <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none text-primary fw-semibold">
                      Login to continue checkout
                    </Link>
                  </div>
                )}
                
                {/* Shipping Tracking Preview */}
                <div className="shipping-preview mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">
                      <Truck className="me-2" />
                      Live Tracking Available
                    </h6>
                    <Badge bg="success">Real-time</Badge>
                  </div>
                  <p className="text-muted small mb-3">
                    Track your order in real-time after confirmation
                  </p>
                  <Button 
                    variant="outline-info" 
                    size="sm" 
                    className="w-100"
                    onClick={simulateShippingTracking}
                  >
                    <GeoAlt className="me-2" />
                    View Shipping Details
                  </Button>
                </div>
                
                <div className="text-center mt-4">
                  <Button as={Link} to="/menu" variant="outline-primary" className="w-100">
                    Continue Shopping
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Shipping Tracking Modal */}
      <Modal show={showShippingModal} onHide={() => setShowShippingModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Truck className="me-2" />
            Live Order Tracking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trackingInfo && (
            <div className="shipping-tracking">
              <div className="tracking-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold">Order #{trackingInfo.orderId}</h6>
                    <p className="text-muted mb-0">Estimated delivery: {trackingInfo.estimatedDelivery}</p>
                  </div>
                  <Badge bg={
                    trackingInfo.status === 'delivered' ? 'success' :
                    trackingInfo.status === 'on_the_way' ? 'primary' :
                    trackingInfo.status === 'preparing' ? 'warning' : 'secondary'
                  }>
                    {trackingInfo.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Progress</span>
                  <span className="fw-bold">{trackingInfo.progress}%</span>
                </div>
                <ProgressBar now={trackingInfo.progress} variant="success" animated />
              </div>
              
              {/* Tracking Steps */}
              <div className="tracking-steps">
                {trackingInfo.steps.map((step, index) => (
                  <div key={index} className={`tracking-step ${step.status}`}>
                    <div className="step-indicator">
                      <div className="step-icon">
                        {step.status === 'completed' ? <CheckCircle /> :
                         step.status === 'current' ? <Clock /> :
                         <div className="step-dot"></div>}
                      </div>
                      {index < trackingInfo.steps.length - 1 && <div className="step-connector"></div>}
                    </div>
                    <div className="step-content">
                      <h6 className="fw-bold mb-1">{step.label}</h6>
                      <p className="text-muted mb-0">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Delivery Person Info */}
              <Card className="mt-4">
                <Card.Body>
                  <h6 className="fw-bold mb-3">Delivery Information</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Delivery Person:</strong> {trackingInfo.deliveryPerson}
                      </p>
                      <p className="mb-2">
                        <strong>Contact:</strong> {trackingInfo.deliveryPersonPhone}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Current Location:</strong> {trackingInfo.currentLocation.address}
                      </p>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => window.open(`https://maps.google.com/?q=${trackingInfo.currentLocation.lat},${trackingInfo.currentLocation.lng}`, '_blank')}
                      >
                        <GeoAlt className="me-2" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShippingModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowShippingModal(false);
            navigate('/profile');
          }}>
            View Order Details
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CartPage;