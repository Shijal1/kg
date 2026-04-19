import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowRight, InfoCircle } from 'react-bootstrap-icons'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get('/api/products')
        setProducts(data)
        setLoading(false)
      } catch (error) {
        setError('Failed to load products')
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (product) => {
    const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
    const existItem = cartItems.find(x => x._id === product._id)
    
    if (existItem) {
      const updatedCart = cartItems.map(x => 
        x._id === product._id ? { ...x, quantity: x.quantity + 1 } : x
      )
      localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    } else {
      cartItems.push({ ...product, quantity: 1 })
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }
    window.dispatchEvent(new Event('storage'))
  }

  const featuredProducts = products.filter(p => p.rating >= 4.5).slice(0, 4)

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <Container className="text-center py-5">
          <h1 className="display-4 fw-bold mb-4">Taste the Authentic Flavors of Nepal</h1>
          <p className="lead mb-4">
            Experience traditional Nepali cuisine made with love and authentic spices passed down through generations
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button 
              variant="warning" 
              size="lg" 
              as={Link} 
              to="/menu"
              className="px-4 fw-bold"
            >
              Explore Menu
            </Button>
            <Button 
              variant="outline-light" 
              size="lg" 
              as={Link} 
              to="/about"
              className="px-4"
            >
              <InfoCircle className="me-2" />
              About Us
            </Button>
          </div>
        </Container>
      </div>

      {/* Quick About Section */}
      <Container className="py-4">
        <div className="text-center mb-4">
          <h3 className="fw-bold">Welcome to Kasthamandap Ghar</h3>
          <p className="text-muted">
            Named after the historic wooden pavilion in Kathmandu, we serve authentic Nepalese cuisine 
            using traditional cooking methods and locally sourced ingredients.
          </p>
          <Button 
            variant="outline-primary" 
            as={Link} 
            to="/about"
            className="mt-2"
          >
            Learn More About Our Heritage
          </Button>
        </div>
      </Container>
     
      {/* Featured Dishes */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Featured Dishes</h2>
          <Button 
            variant="outline-primary" 
            as={Link} 
            to="/menu"
            className="d-flex align-items-center"
          >
            View All Menu <ArrowRight className="ms-2" />
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading featured dishes...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <Row>
            {featuredProducts.map((product) => (
              <Col key={product._id} lg={3} md={6} className="mb-4">
                <Card className="h-100 shadow-sm product-card">
                  <Card.Img 
                    variant="top" 
                    src={`public/images/${product.image}`} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    alt={product.name}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <span className={`category-badge ${product.category}`}>
                        {product.category === 'veg' ? 'Vegetarian' : 
                         product.category === 'non-veg' ? 'Non-Vegetarian' : 
                         product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="text-muted small mb-3" style={{ flex: 1 }}>
                      {product.description.substring(0, 80)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div className="fw-bold text-primary">Rs. {product.price}</div>
                      <Button 
                        size="sm" 
                        variant="primary"
                        onClick={() => addToCart(product)}
                        disabled={!product.isAvailable}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  )
}

export default HomePage