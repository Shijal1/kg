import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Clock, Truck, House } from 'react-bootstrap-icons';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userInfo));
    fetchOrderDetails(id, JSON.parse(userInfo).token);
  }, [id, navigate]);

  const fetchOrderDetails = async (orderId, token) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get(`/api/orders/${orderId}`, config);
      setOrder(data);
    } catch (error) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="text-warning me-2" />
      case 'confirmed': return <CheckCircle className="text-info me-2" />
      case 'preparing': return <Clock className="text-primary me-2" />
      case 'out for delivery': return <Truck className="text-secondary me-2" />
      case 'delivered': return <House className="text-success me-2" />
      case 'cancelled': return <CheckCircle className="text-danger me-2" />
      default: return <Clock className="me-2" />
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Order received. Restaurant will confirm shortly.';
      case 'confirmed': return 'Order confirmed. Kitchen is preparing your food.';
      case 'preparing': return 'Your food is being prepared with love!';
      case 'out for delivery': return 'Your order is on the way!';
      case 'delivered': return 'Order delivered. Enjoy your meal!';
      case 'cancelled': return 'Order has been cancelled.';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading order details...</p>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Order not found'}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/profile')}>
          Back to Profile
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate('/profile')}
        className="mb-4"
      >
        <ArrowLeft className="me-2" /> Back to Profile
      </Button>

      <h1 className="fw-bold mb-4">Order Details</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="shadow mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="fw-bold">Order #{order._id.substring(18)}</h5>
                  <p className="text-muted mb-0">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge bg={
                  order.status === 'delivered' ? 'success' :
                  order.status === 'cancelled' ? 'danger' :
                  order.status === 'pending' ? 'warning' : 'primary'
                }>
                  {order.status.toUpperCase()}
                </Badge>
              </div>

              {/* Status Timeline */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">
                  {getStatusIcon(order.status)}
                  Order Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </h6>
                <p className="text-muted">{getStatusText(order.status)}</p>
              </div>

              {/* Order Items */}
              <h6 className="fw-bold mb-3">Order Items</h6>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <div className="bg-light rounded" style={{ width: '50px', height: '50px' }}></div>
                            </div>
                            <div>
                              <div className="fw-bold">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>Rs. {item.price}</td>
                        <td>{item.quantity}</td>
                        <td className="fw-bold">Rs. {item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Order Summary */}
          <Card className="shadow mb-4">
            <Card.Body>
              <h6 className="fw-bold mb-3">Order Summary</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>Rs. {order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (13%)</span>
                <span>Rs. {order.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery</span>
                <span>Rs. 50.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h6 className="fw-bold">Total</h6>
                <h6 className="fw-bold text-primary">
                  Rs. {order.totalPrice?.toFixed(2)}
                </h6>
              </div>
            </Card.Body>
          </Card>

          {/* Delivery Info */}
          <Card className="shadow">
            <Card.Body>
              <h6 className="fw-bold mb-3">Delivery Information</h6>
              <div className="mb-2">
                <small className="text-muted">Address</small>
                <p className="mb-0">{order.shippingAddress?.address}</p>
              </div>
              <div className="mb-2">
                <small className="text-muted">Phone</small>
                <p className="mb-0">{order.shippingAddress?.phone}</p>
              </div>
              <div>
                <small className="text-muted">Payment Method</small>
                <p className="mb-0">{order.paymentMethod}</p>
              </div>
            </Card.Body>
          </Card>

          {order.status === 'pending' && (
            <Button 
              variant="danger" 
              className="w-100 mt-3"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  // Implement cancel order logic
                  alert('Cancellation request sent!');
                }
              }}
            >
              Cancel Order
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailsPage;