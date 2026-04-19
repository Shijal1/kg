import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Card, Spinner, Form, Modal } from 'react-bootstrap'
import axios from 'axios'
import { Search, Clock, Star, X } from 'react-bootstrap-icons'
import './menu.css'

const MenuPage = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [category, searchTerm, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/products')
      setProducts(data)
      setFilteredProducts(data)
      setLoading(false)
    } catch (error) {
      setError('Failed to load menu')
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

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

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowDetails(true)
  }

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'veg', name: 'Vegetarian' },
    { id: 'non-veg', name: 'Non-Vegetarian' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'snacks', name: 'Snacks' },
    { id: 'bar', name: 'Bar'}
  ]

  const categoryNames = {
    'veg': 'Vegetarian',
    'non-veg': 'Non-Vegetarian',
    'drinks': 'Drinks',
    'desserts': 'Desserts',
    'snacks': 'Snacks',
    'bar': 'Bar'
  }

  return (
    <>
      <Container className="py-4">
        <h1 className="fw-bold mb-4 text-center">Our Menu</h1>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="search-container position-relative">
            <Form.Control
              type="text"
              placeholder="     Search dishes, drinks, or categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input ps-4"
            />
            <Search className="position-absolute search-icon" />
            {searchTerm && (
              <Button 
                variant="link" 
                className="position-absolute clear-search"
                onClick={() => setSearchTerm('')}
              >
                <X />
              </Button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? 'primary' : 'outline-primary'}
              onClick={() => setCategory(cat.id)}
              className="category-btn"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Products Count */}
        <div className="mb-3 text-muted">
          Showing {filteredProducts.length} of {products.length} items
          {searchTerm && ` for "${searchTerm}"`}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading menu...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted mb-3">No products found</h4>
            <p>Try a different search term or category</p>
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product._id} lg={3} md={4} sm={6} className="mb-4">
                <Card 
                  className="h-100 shadow-sm product-card" 
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Img 
                    variant="top" 
                    src={`public/images/${product.image}`} 
                    style={{ height: '200px', objectFit: 'cover' }}
                    alt={product.name}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <span className={`category-badge ${product.category}`}>
                        {categoryNames[product.category] || product.category}
                      </span>
                      {product.rating > 0 && (
                        <span className="rating-badge ms-2">
                          <Star size={12} /> {product.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <Card.Title className="product-name">{product.name}</Card.Title>
                    <Card.Text className="text-muted small mb-3" style={{ flex: 1 }}>
                      {product.description.substring(0, 80)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div className="fw-bold text-primary">Rs. {product.price}</div>
                      <div className="prep-time">
                        <Clock size={12} className="me-1" />
                        {product.preparationTime} min
                      </div>
                    </div>
                    <Button 
                      variant="primary"
                      size="sm"
                      className="mt-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      disabled={!product.isAvailable}
                    >
                      {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Product Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        {selectedProduct && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <img 
                    src={`public/images/${selectedProduct.image}`} 
                    alt={selectedProduct.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                  />
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <span className={`category-badge ${selectedProduct.category}`}>
                      {categoryNames[selectedProduct.category] || selectedProduct.category}
                    </span>
                    {selectedProduct.rating > 0 && (
                      <span className="ms-3">
                        <Star className="text-warning me-1" />
                        {selectedProduct.rating.toFixed(1)} ({selectedProduct.numReviews} reviews)
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-primary mb-3">Rs. {selectedProduct.price}</h4>
                  
                  <div className="mb-4">
                    <h6>Description</h6>
                    <p>{selectedProduct.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h6>Preparation Time</h6>
                    <p><Clock className="me-2" /> {selectedProduct.preparationTime} minutes</p>
                  </div>
                  
                  <div className="mb-4">
                    <h6>Availability</h6>
                    <p className={selectedProduct.isAvailable ? 'text-success' : 'text-danger'}>
                      {selectedProduct.isAvailable ? '✓ Available for order' : '✗ Currently unavailable'}
                    </p>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  addToCart(selectedProduct)
                  setShowDetails(false)
                }}
                disabled={!selectedProduct.isAvailable}
              >
                Add to Cart
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  )
}

export default MenuPage