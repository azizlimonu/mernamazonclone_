// dep
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

// bootstrap
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

// pages&component
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import SigninScreen from "./screens/SigninScreen";
import ShippingAddressScreen from "./screens/ShippingAddressScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import SearchBox from './components/SearchBox';

// utils
import { Store } from './store';
import ProfileScreen from "./screens/ProfileScreen";
import { getError } from "./utils/getError";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
        console.log('categories',data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  const toggleSideBar = () => {
    setSidebarIsOpen(prev => !prev);
  };

  return (
    <div className={
      sidebarIsOpen
        ? 'd-flex flex-column site-container active-cont'
        : 'd-flex flex-column site-container'
    }>
      <ToastContainer position="bottom-center" limit={1} />
      {/* header */}
      <header>
        <Navbar bg="dark" variant="dark" expand='lg'>
          <Container>
            {/* sidebar */}
            <Button
              variant="dark"
              onClick={toggleSideBar}
            >
              <i className="fas fa-bars"></i>
            </Button>

            {/* brand */}
            <LinkContainer to="/">
              <Navbar.Brand>amazona</Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {/* search box */}
              <SearchBox />
              <Nav className="me-auto  w-100  justify-content-end">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* Categories nav */}
      <div
        className={
          sidebarIsOpen
            ? 'active-nav side-navbar f-flex justify-content-between flex-wrap flex-column'
            : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
        }
      >
        <Nav className="flex-column text-white w-100 p-2">
          <Nav.Item>
            <strong>Categories</strong>
          </Nav.Item>
          {categories?.map((category) => (
            <Nav.Item key={category}>
              <LinkContainer
                to={`/searchcategory=${category}`}
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>{category}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* main section */}
      <main>
        <Container className='mt-3'>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/signin' element={<SigninScreen />} />
            <Route path='/shipping' element={<ShippingAddressScreen />} />
            <Route path='/signup' element={<SignupScreen />} />
            <Route path='/payment' element={<PaymentMethodScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path='/order/:id' element={<OrderScreen />} />
            <Route path='/orderhistory' element={<OrderHistoryScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
          </Routes>
        </Container>
      </main >

      {/* footer */}
      <footer>
        <div className="text-center">All rights reserved</div>
      </footer>
    </div >
  );
}

export default App;
