import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert, Table, Badge, Modal, Tabs, Tab } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PersonCircle, Eye, Trash, Calendar, Clock, People } from 'react-bootstrap-icons'

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [activeTab, setActiveTab] = useState('orders')
  
  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (!userInfo) {
      navigate('/login')
      return
    }
    
    const parsedUser = JSON.parse(userInfo)
    setUser(parsedUser)
    fetchUserOrders(parsedUser.token)
    fetchUserBookings(parsedUser.token)
  }, [navigate])

  const fetchUserOrders = async (token) => {
    try {
      setOrdersLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await axios.get('/api/orders/myorders', config)
      setOrders(data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const fetchUserBookings = async (token) => {
    try {
      setBookingsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await axios.get('/api/bookings/mybookings', config)
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setBookingsLoading(false)
    }
  }

  const handleCancelOrder = (order) => {
    setOrderToCancel(order)
    setShowCancelModal(true)
  }

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      
      await axios.put(`/api/orders/${orderToCancel._id}/status`, {
        status: 'cancelled'
      }, config)
      
      fetchUserOrders(user.token)
      setSuccess('Order cancelled successfully!')
      setShowCancelModal(false)
      setOrderToCancel(null)
      
    } catch (error) {
      setError('Failed to cancel order')
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'confirmed': 'info',
      'preparing': 'primary',
      'out for delivery': 'secondary',
      'delivered': 'success',
      'cancelled': 'danger'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getBookingStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'confirmed': 'success',
      'cancelled': 'danger',
      'completed': 'info'
    }
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-NP', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const viewOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`)
  }

  const formatBookingDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NP', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Container className="py-5">
      <h1 className="fw-bold mb-4">My Account</h1>
      
      <Row>
        {/* User Info Sidebar */}
        <Col md={4} className="mb-4">
          <Card className="shadow h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div className="bg-primary rounded-circle d-inline-flex p-3">
                  <PersonCircle size={40} className="text-white" />
                </div>
              </div>
              
              <h4 className="fw-bold">{user?.name}</h4>
              <p className="text-muted">{user?.email}</p>
              
              <div className="text-start mt-4">
                <div className="mb-2">
                  <strong>Role:</strong> {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {user?.phone}
                </div>
                <div>
                  <strong>Address:</strong> {user?.address}
                </div>
              </div>
              
              <Button 
                variant="primary" 
                className="mt-4 w-100"
                onClick={() => navigate('/booking')}
              >
                <Calendar className="me-2" />
                Book a Table
              </Button>
              
              <Button 
                variant="outline-primary" 
                className="mt-2 w-100"
                onClick={() => navigate('/menu')}
              >
                Order Food
              </Button>
              
              <Button 
                variant="outline-danger" 
                className="mt-2 w-100"
                onClick={() => {
                  localStorage.removeItem('userInfo')
                  localStorage.removeItem('cartItems')
                  navigate('/login')
                }}
              >
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Orders & Bookings Section */}
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
              >
                <Tab eventKey="orders" title="My Orders">
                  <h4 className="fw-bold mb-4">Order History</h4>
                  
                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                      {error}
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                      {success}
                    </Alert>
                  )}
                  
                  {ordersLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading your orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-4">
                      <h5 className="text-muted">No orders yet</h5>
                      <p>Start shopping to see your order history here</p>
                      <Button variant="primary" onClick={() => navigate('/menu')}>
                        Browse Menu
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <td>
                                <small className="text-muted">#{order._id.substring(18)}</small>
                              </td>
                              <td>
                                <small>{formatDate(order.createdAt)}</small>
                              </td>
                              <td>{order.items.length} item(s)</td>
                              <td className="fw-bold">Rs. {order.totalPrice?.toFixed(2)}</td>
                              <td>{getStatusBadge(order.status)}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button 
                                    variant="outline-info" 
                                    size="sm"
                                    onClick={() => viewOrderDetails(order._id)}
                                    title="View Details"
                                  >
                                    <Eye />
                                  </Button>
                                  
                                  {['pending', 'confirmed'].includes(order.status) && (
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => handleCancelOrder(order)}
                                      title="Cancel Order"
                                    >
                                      <Trash />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab>
                
                <Tab eventKey="bookings" title="My Bookings">
                  <h4 className="fw-bold mb-4">Booking History</h4>
                  
                  {bookingsLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading your bookings...</p>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-4">
                      <h5 className="text-muted">No bookings yet</h5>
                      <p>Book a table to see your reservations here</p>
                      <Button variant="primary" onClick={() => navigate('/booking')}>
                        <Calendar className="me-2" />
                        Book a Table
                      </Button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table hover>
                        <thead>
                          <tr>
                            <th>Booking Date</th>
                            <th>Time</th>
                            <th>Table Type</th>
                            <th>Guests</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td>
                                <div className="fw-semibold">
                                  {formatBookingDate(booking.bookingDate)}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Clock className="me-2 text-primary" />
                                  {booking.timeSlot}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <People className="me-2 text-primary" />
                                  {booking.tableType.replace('-', ' ')}
                                </div>
                              </td>
                              <td>{booking.numberOfGuests} people</td>
                              <td>{getBookingStatusBadge(booking.status)}</td>
                              <td className="fw-bold">Rs. {booking.totalPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cancel Order Confirmation Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this order?
          {orderToCancel && (
            <div className="mt-3">
              <p><strong>Order ID:</strong> #{orderToCancel._id.substring(18)}</p>
              <p><strong>Total:</strong> Rs. {orderToCancel.totalPrice?.toFixed(2)}</p>
              <p><strong>Items:</strong> {orderToCancel.items.length} item(s)</p>
            </div>
          )}
          <Alert variant="warning" className="mt-3">
            <small>Cancellation request will be sent to the restaurant. Refund will be processed within 3-5 business days.</small>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Keep Order
          </Button>
          <Button variant="danger" onClick={confirmCancelOrder}>
            Confirm Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ProfilePage
