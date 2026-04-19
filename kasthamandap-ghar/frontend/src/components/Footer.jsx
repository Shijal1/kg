import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Facebook, Twitter, Linkedin, Instagram, GeoAlt, Phone, Envelope, Heart, Clock, CreditCard } from 'react-bootstrap-icons'

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h4 className="fw-bold mb-3 text-warning">Kasthamandap Ghar</h4>
            <p className="text-light mb-4">
              Serving authentic Nepali cuisine since 1950. 
              Experience the taste of tradition made with love and heritage.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon text-white">
                <Facebook size={20} />
              </a>
              <a href="https://Twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon text-white">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon text-white">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon text-white">
                <Instagram size={20} />
              </a>
            </div>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h5 className="mb-3">Useful Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-white text-decoration-none">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/menu" className="text-white text-decoration-none">
                  Order Food
                </a>
              </li>
              <li className="mb-2">
                <a href="/booking" className="text-white text-decoration-none">
                  Book a Table
                </a>
              </li>
              <li className="mb-2">
                <a href="/about" className="text-white text-decoration-none">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="/cart" className="text-white text-decoration-none">
                  My Cart
                </a>
              </li>
            </ul>
          </Col>
          
          <Col lg={5} md={6} className="mb-4">
            <h5 className="mb-3">Contact & Information</h5>
            <Row>
              <Col md={6}>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <GeoAlt className="me-2 text-warning" />
                    Thamel, Kathmandu, Nepal
                  </li>
                  <li className="mb-2">
                    <Phone className="me-2 text-warning" />
                    +977 97766386459
                  </li>
                  <li className="mb-2">
                    <Envelope className="me-2 text-warning" />
                    info@kasthamandapghar.com
                  </li>
                </ul>
              </Col>
              <Col md={6}>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Clock className="me-2 text-warning" />
                    <strong>Opening Hours:</strong><br />
                    Everyday: 9:00 AM - 10:00 PM
                  </li>
                  <li className="mb-2">
                    <CreditCard className="me-2 text-warning" />
                    <strong>Payment Methods:</strong><br />
                    Cash, QR, Cards Accepted
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
        
        <hr className="bg-light my-4" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Kasthamandap Ghar Restaurant. All rights reserved.
            </p>
            <p className="text-muted mt-2 small">
              Made with  in Nepal • Serving authentic Nepali cuisine since 1950
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
