import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { Calendar, Clock, People, CreditCard, GeoAlt, CheckCircle } from 'react-bootstrap-icons';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './booking.css';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [tableType, setTableType] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const { user } = useUser();
  const navigate = useNavigate();

  const tableTypes = [
    { id: '2-sitter', name: '2-Sitter Table', icon: '👥', description: 'Perfect for couples', price: 0 },
    { id: '4-sitter', name: '4-Sitter Table', icon: '👨‍👩‍👧‍👦', description: 'Family or small group', price: 0 },
    { id: 'family-pack', name: 'Family Pack', icon: '🏠', description: 'Special family package with decorations', price: 500 },
    { id: 'birthday-party', name: 'Birthday Party', icon: '🎂', description: 'Birthday celebration package', price: 1000 },
    { id: 'group-5-6', name: 'Group (5-6 persons)', icon: '👨‍👩‍👧‍👦👫', description: 'Large group seating', price: 800 },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setContactPhone(user.phone || '');
      setContactEmail(user.email || '');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const fetchTimeSlots = async () => {
    try {
      const { data } = await axios.get(`/api/bookings/availability?date=${selectedDate}`);
      setTimeSlots(data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleDateSelect = (e) => {
    const date = e.target.value;
    const today = new Date();
    const selected = new Date(date);
    
    if (selected < today.setHours(0, 0, 0, 0)) {
      setError('Please select a future date');
      return;
    }
    
    setSelectedDate(date);
    setSelectedTime('');
    setError('');
  };

  const calculateTotal = () => {
    const selectedTable = tableTypes.find(t => t.id === tableType);
    return selectedTable ? selectedTable.price : 0;
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      setError('Please login to make a booking');
      return;
    }

    if (!selectedDate || !selectedTime || !tableType) {
      setError('Please complete all booking details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        bookingType: 'dining',
        tableType,
        bookingDate: selectedDate,
        timeSlot: selectedTime,
        numberOfGuests: guests,
        specialRequests,
        contactPhone,
        contactEmail,
        paymentMethod
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      };

      const { data } = await axios.post('/api/bookings', bookingData, config);
      
      setBookingDetails(data);
      setSuccess('Booking successful! Redirecting...');
      setShowConfirmation(true);
      
      // Clear cart for booking
      localStorage.removeItem('cartItems');
      
      setTimeout(() => {
        navigate('/profile');
      }, 3000);

    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="booking-page py-5">
      <h1 className="text-center fw-bold mb-5 text-primary">Table Booking & Reservations</h1>
      
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Booking Progress Steps */}
          <div className="booking-steps mb-5">
            <div className="step-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <div className="step-label">Select Date & Time</div>
              </div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <div className="step-label">Choose Table</div>
              </div>
              <div className={`step ${step >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-label">Confirm Details</div>
              </div>
            </div>
          </div>

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

          {/* Step 1: Date & Time Selection */}
          {step === 1 && (
            <Card className="shadow border-0">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">
                  <Calendar className="me-2" />
                  Select Date & Time
                </h4>
                
                <Form>
                  <Form.Group className="mb-4">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedDate}
                      onChange={handleDateSelect}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>

                  {selectedDate && (
                    <>
                      <Form.Group className="mb-4">
                        <Form.Label>Available Time Slots</Form.Label>
                        <div className="time-slots-grid">
                          {timeSlots.map((slot, index) => (
                            <Button
                              key={index}
                              variant={selectedTime === slot.time ? 'primary' : 'outline-primary'}
                              className={`time-slot-btn ${!slot.available ? 'disabled' : ''}`}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                            >
                              <Clock className="me-2" />
                              {slot.time}
                              {!slot.available && <small className="d-block text-muted">Fully booked</small>}
                            </Button>
                          ))}
                        </div>
                      </Form.Group>

                      <div className="text-end">
                        <Button 
                          variant="primary" 
                          onClick={() => setStep(2)}
                          disabled={!selectedTime}
                        >
                          Next: Choose Table
                        </Button>
                      </div>
                    </>
                  )}
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Step 2: Table Selection */}
          {step === 2 && (
            <Card className="shadow border-0">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">
                  <People className="me-2" />
                  Choose Your Table
                </h4>
                
                <Form.Group className="mb-4">
                  <Form.Label>Number of Guests</Form.Label>
                  <Form.Select 
                    value={guests} 
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <div className="table-types-grid mb-4">
                  {tableTypes.map((table) => (
                    <Card 
                      key={table.id}
                      className={`table-type-card ${tableType === table.id ? 'selected' : ''}`}
                      onClick={() => setTableType(table.id)}
                    >
                      <Card.Body className="text-center">
                        <div className="table-icon mb-3">{table.icon}</div>
                        <h5 className="fw-bold">{table.name}</h5>
                        <p className="text-muted small mb-2">{table.description}</p>
                        <div className="price-tag">
                          {table.price > 0 ? `Rs. ${table.price}` : 'Free'}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                <div className="d-flex justify-content-between">
                  <Button variant="outline-secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => setStep(3)}
                    disabled={!tableType}
                  >
                    Next: Confirm Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card className="shadow border-0">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">
                  <CheckCircle className="me-2" />
                  Confirm Booking Details
                </h4>
                
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="booking-summary">
                      <h6 className="fw-bold mb-3">Booking Summary</h6>
                      <div className="summary-item">
                        <span className="text-muted">Date:</span>
                        <span className="fw-bold">{new Date(selectedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="summary-item">
                        <span className="text-muted">Time:</span>
                        <span className="fw-bold">{selectedTime}</span>
                      </div>
                      <div className="summary-item">
                        <span className="text-muted">Table Type:</span>
                        <span className="fw-bold">
                          {tableTypes.find(t => t.id === tableType)?.name}
                        </span>
                      </div>
                      <div className="summary-item">
                        <span className="text-muted">Guests:</span>
                        <span className="fw-bold">{guests} people</span>
                      </div>
                      <hr />
                      <div className="summary-item">
                        <span className="text-muted">Total:</span>
                        <span className="fw-bold fs-5 text-primary">
                          Rs. {calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Special Requests</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requirements?"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Contact Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="cash">Cash at Restaurant</option>
                        <option value="qr">QR Payment</option>
                        <option value="card">Credit/Debit Card</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between">
                  <Button variant="outline-secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    variant="success" 
                    size="lg"
                    onClick={handleBookingSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎉 Booking Confirmed!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingDetails && (
            <div>
              <p>Your table has been reserved successfully!</p>
              <div className="confirmation-details">
                <p><strong>Booking Reference:</strong> {bookingDetails._id.substring(18, 24).toUpperCase()}</p>
                <p><strong>Date:</strong> {new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {bookingDetails.timeSlot}</p>
                <p><strong>Table:</strong> {bookingDetails.tableType}</p>
                <Alert variant="info" className="mt-3">
                  <small>
                    Please arrive 10 minutes before your booking time. 
                    Show this confirmation at the reception.
                  </small>
                </Alert>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate('/profile')}>
            View My Bookings
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookingPage;