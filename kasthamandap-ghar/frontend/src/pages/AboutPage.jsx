import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Clock, GeoAlt, People, Award, Star, Building } from 'react-bootstrap-icons';
import './about.css';

const AboutPage = () => {
  const culturalHighlights = [
    {
      title: "Kasthamandap: The Living Legend",
      content: "Our namesake, Kasthamandap (काष्ठमण्डप), was an ancient wooden pavilion built in the 7th century from a single Sal tree. It stood as Kathmandu's spiritual and social heart for centuries, giving the city its name. Like this architectural marvel, we build our culinary traditions on single-minded dedication to authenticity.",
      image: "katm.jpg"
    },
    {
      title: "Newari Culinary Heritage",
      content: "We specialize in authentic Newari cuisine - one of Nepal's most sophisticated culinary traditions. Our chefs are trained in ancient techniques passed down through generations, from the precise spicing of Bara to the ceremonial preparation of Yomari during festivals.",
      image: "newari-cuisine.jpg"
    },
    {
      title: "Himalayan Spice Routes",
      content: "Our spices follow ancient trade routes from the Terai lowlands to Himalayan highlands. Timut pepper, Jimbu herbs, and Timur berries connect your palate to Nepal's diverse ecosystems, each spice telling a story of mountain passes and river valleys.",
      image: "spice-route.jpg"
    },
    {
      title: "Wood-Fire Tradition",
      content: "Every Sekuwa and Choila is prepared over traditional wood fire, echoing the communal cooking methods of Mithila and Gurung communities. The smoky aroma carries centuries of mountain hospitality and village gatherings.",
      image: "wood-fire.jpg"
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section with ktm.jpg background */}
      <div className="cultural-hero" style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/public/images/katm.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="hero-overlay">
          <Container>
            <Row className="align-items-center min-vh-80">
              <Col lg={8} className="mx-auto text-center text-white">
                <h1 className="display-3 fw-bold mb-4">
                  काष्ठमण्डप घर
                </h1>
                <p className="lead mb-4">
                  Where every meal is a journey through Nepal's living history
                </p>
                <p className="cultural-subtitle">
                  Not just a restaurant, but a custodian of Himalayan culinary heritage since 1950
                </p>
                <div className="mt-4">
                  <Button variant="warning" size="lg" href="/booking" className="me-3">
                    Book Your Experience
                  </Button>
                  <Button variant="outline-light" size="lg" href="/menu">
                    Explore Menu
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Cultural Story Section */}
      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <div className="text-center mb-5">
              <h2 className="section-title">
                <Building className="me-3" />
                Our Cultural Tapestry
              </h2>
              <p className="text-muted lead">
                We don't just serve food - we preserve stories, traditions, and the soul of Nepal
              </p>
            </div>

            <Row className="g-4">
              {culturalHighlights.map((item, index) => (
                <Col lg={6} key={index}>
                  <Card className="cultural-card h-100">
                    <div className="cultural-image" 
                         style={{backgroundImage: `url(public/images/${item.image})`}}>
                      <div className="image-overlay"></div>
                    </div>
                    <Card.Body>
                      <h4 className="cultural-title">{item.title}</h4>
                      <p className="cultural-text">{item.content}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* Our Values */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <h2 className="text-center mb-5 section-title">
              <Award className="me-3" />
              Why Choose Kasthamandap Ghar
            </h2>
            
            <Row className="g-4">
              <Col md={4}>
                <Card className="value-card text-center h-100">
                  <Card.Body>
                    <div className="value-icon mb-3">👨‍🍳</div>
                    <h5>Master Chefs</h5>
                    <p className="text-muted">Trained for years in traditional Nepali cooking techniques passed down through generations.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="value-card text-center h-100">
                  <Card.Body>
                    <div className="value-icon mb-3">🌿</div>
                    <h5>Fresh Ingredients</h5>
                    <p className="text-muted">Locally sourced, organic produce and authentic Himalayan spices for genuine flavors.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="value-card text-center h-100">
                  <Card.Body>
                    <div className="value-icon mb-3">❤️</div>
                    <h5>Made with Love</h5>
                    <p className="text-muted">Every dish prepared with the same care and love as in a traditional Nepali home.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Row className="g-4 mt-3">
              <Col md={4}>
                <Card className="value-card text-center h-100">
                  <Card.Body>
                    <div className="value-icon mb-3">🏔️</div>
                    <h5>Authentic Atmosphere</h5>
                    <p className="text-muted">Traditional decor and ambiance that transports you to the heart of Nepal.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="value-card text-center h-100">
                  <Card.Body>
                    <div className="value-icon mb-3">⭐</div>
                    <h5>Excellence Awarded</h5>
                    <p className="text-muted">Recipient of multiple awards for best Nepali cuisine and hospitality.</p>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="value-card text-center h-100">
                  <Card.Body>
                    <div className="value-icon mb-3">🤝</div>
                    <h5>Community Focused</h5>
                    <p className="text-muted">Supporting local farmers and preserving Nepal's culinary heritage.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Timeline Section */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <h2 className="text-center mb-5 section-title">
              <Star className="me-3" />
              Our Journey
            </h2>
            
            <div className="heritage-timeline">
              <div className="timeline-item">
                <div className="timeline-year">1950</div>
                <div className="timeline-content">
                  <h5>Foundation in Thamel</h5>
                  <p>Founded as a small eatery serving authentic Nepali food to locals and visitors alike.</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-year">1985</div>
                <div className="timeline-content">
                  <h5>Expansion and Recognition</h5>
                  <p>Expanded to become one of Kathmandu's most popular restaurants, known for authentic flavors.</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-year">2005</div>
                <div className="timeline-content">
                  <h5>Modernization with Tradition</h5>
                  <p>Renovated while preserving traditional elements, introducing modern amenities while keeping heritage alive.</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-year">Present</div>
                <div className="timeline-content">
                  <h5>Continuing Legacy</h5>
                  <p>Now serving generations of families, maintaining our commitment to quality, tradition, and hospitality.</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Visit Us Section */}
        <Row>
          <Col lg={10} className="mx-auto">
            <Card className="cultural-invitation">
              <Card.Body className="p-5 text-center">
                <h3 className="mb-4">Experience the Taste of Nepal</h3>
                <p className="lead mb-4">
                  Join us for an authentic Nepali dining experience that will transport you to the heart of the Himalayas.
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <Button variant="light" size="lg" href="/booking" className="fw-bold">
                    Reserve Your Table
                  </Button>
                  <Button variant="outline-light" size="lg" href="/menu">
                    View Full Menu
                  </Button>
                </div>
                <div className="mt-4 pt-3 border-top">
                  <p className="mb-2">
                    <GeoAlt className="me-2" />
                    Thamel, Kathmandu, Nepal
                  </p>
                  <p className="mb-2">
                    <Clock className="me-2" />
                    Open Daily: 9:00 AM - 10:00 PM
                  </p>
                  <p className="mb-0">
                    <People className="me-2" />
                    For reservations: +977 9766386459
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
