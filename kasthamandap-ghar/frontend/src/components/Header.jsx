import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Cart, PersonCircle, InfoCircle, Calendar } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Header = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart items
    const cart = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    setCartItems(cart);

    // Listen for storage changes
    const handleStorageChange = () => {
      const cart = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
      setCartItems(cart);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold d-flex align-items-center">
            <span className="text-warning">Kasthamandap</span> Ghar
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/menu">
              <Nav.Link>Menu</Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/booking">
              <Nav.Link><Calendar className="me-1" /> Book Table</Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/about">
              <Nav.Link><InfoCircle className="me-1" /> About</Nav.Link>
            </LinkContainer>
            
            <LinkContainer to="/cart">
              <Nav.Link className="position-relative mx-3">
                <Cart size={20} />
                {cartItems.length > 0 && (
                  <Badge 
                    pill 
                    bg="warning" 
                    text="dark"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {user ? (
              <>
                <LinkContainer to="/profile">
                  <Nav.Link>
                    <PersonCircle className="me-2" />
                    {user.name}
                  </Nav.Link>
                </LinkContainer>
                <Nav.Link 
                  onClick={handleLogout}
                  className="text-danger"
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link className="me-3">
                    <PersonCircle className="me-2" />
                    Login
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;