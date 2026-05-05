import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { QrCode, CheckCircle, Clock, ArrowLeft } from 'react-bootstrap-icons'

const PaymentPage = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('qr')
  const [user, setUser] = useState(null)
  const [qrScanned, setQrScanned] = useState(false)
  const orderIdValue = order?.id || order?._id

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (!userInfo) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userInfo))
    fetchOrderDetails(orderId, JSON.parse(userInfo).token)
  }, [orderId, navigate])

  const fetchOrderDetails = async (orderId, token) => {
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await axios.get(`/api/orders/${orderId}`, config)
      setOrder(data)
    } catch (error) {
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!order || !user) return
    
    try {
      setPaymentLoading(true)
      setError('')
      
      // For QR payment, show QR and wait for user to scan
      if (paymentMethod === 'qr') {
        setSuccess('Please scan the QR code and complete payment. Then click "Complete Payment" below.')
        setQrScanned(true)
        setPaymentLoading(false)
        return
      }
      
      // For other payment methods, proceed immediately
      const paymentData = {
        orderId: orderIdValue,
        paymentMethod: paymentMethod,
        amount: order.totalPrice
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }

      const { data } = await axios.post('/api/payments/create', paymentData, config)
      
      setSuccess(`Payment initiated! Redirecting...`)
      
      setTimeout(() => {
        navigate(`/profile`)
      }, 2000)
      
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed')
      setPaymentLoading(false)
    }
  }

  const completeQRPayment = async () => {
    try {
      setPaymentLoading(true)
      
      const paymentData = {
        orderId: orderIdValue,
        paymentMethod: 'qr',
        amount: order.totalPrice
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }

      const { data } = await axios.post('/api/payments/create', paymentData, config)
      
      // Complete the payment
      await axios.post(`/api/payments/complete/${data.transactionId}`, {}, config)
      
      setSuccess('Payment completed successfully! Your order is confirmed.')
      
      setTimeout(() => {
        navigate(`/profile`)
      }, 3000)
      
    } catch (error) {
      setError('Failed to complete payment')
    } finally {
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading payment details...</p>
      </Container>
    )
  }

  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Order not found'}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/cart')}>
          Back to Cart
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate('/cart')}
        className="mb-4"
      >
        <ArrowLeft className="me-2" /> Back to Cart
      </Button>

      <h1 className="fw-bold mb-4">Complete Payment</h1>
      
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="shadow">
            <Card.Body>
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Order ID:</span>
                <span className="fw-bold">#{(orderIdValue || '').substring(0, 8).toUpperCase()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Items Price:</span>
                <span>Rs. {order.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (13%):</span>
                <span>Rs. {order.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Charge:</span>
                <span>Rs 0</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Total Amount:</span>
                <span className="fw-bold text-primary fs-5">Rs. {order.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted">Delivery Address:</small>
                <p className="mb-0">{order.shippingAddress?.address}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="fw-bold mb-3">Select Payment Method</h5>
              
              <div className="mb-4">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="qr"
                    value="qr"
                    checked={paymentMethod === 'qr'}
                    onChange={() => setPaymentMethod('qr')}
                    disabled={qrScanned}
                  />
                  <label className="form-check-label" htmlFor="qr">
                    <QrCode className="me-2" />
                    Scan QR Code (Recommended)
                  </label>
                </div>
                
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cash"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    disabled={qrScanned}
                  />
                  <label className="form-check-label" htmlFor="cash">
                    Cash on Delivery
                  </label>
                </div>
              </div>

              {paymentMethod === 'qr' && (
                <div className="text-center mb-4">
                  <div className="border rounded p-4 mb-3 d-inline-block bg-white shadow-sm">
                    <img 
                      src="/images/qr2.jpg" 
                      alt="Payment QR Code" 
                      style={{ width: '250px', height: '250px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=KasthamandapGhar-" + orderIdValue;
                        console.log("Using fallback QR image");
                      }}
                    />
                  </div>
                  <p className="text-muted mb-2">
                    <strong>Amount to Pay: Rs. {order.totalPrice?.toFixed(2)}</strong>
                  </p>
                  <p className="text-muted small">
                    Scan this QR code with your mobile banking app to pay
                  </p>
                  <Alert variant="info" className="mt-3">
                    <small>
                      1. Open your banking app<br />
                      2. Scan the QR code<br />
                      3. Enter amount: <strong>Rs. {order.totalPrice?.toFixed(2)}</strong><br />
                      4. Complete the payment<br />
                      5. Click "Complete Payment" below
                    </small>
                  </Alert>
                </div>
              )}

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success">
                  {success}
                </Alert>
              )}

              {paymentMethod === 'qr' && qrScanned ? (
                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-100"
                  onClick={completeQRPayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Completing Payment...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="me-2" />
                      Complete Payment (I have scanned QR)
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100"
                  onClick={handlePayment}
                  disabled={paymentLoading || qrScanned}
                >
                  {paymentLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : paymentMethod === 'qr' ? (
                    'Show QR Code'
                  ) : (
                    `Confirm ${paymentMethod === 'cash' ? 'Cash on Delivery' : 'Payment'}`
                  )}
                </Button>
              )}
              
              <p className="text-muted small text-center mt-3">
                Your order will be prepared once payment is confirmed
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PaymentPage