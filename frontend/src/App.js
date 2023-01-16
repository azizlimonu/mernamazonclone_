// dep
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import {  ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// bootstrap
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
// import Button from 'react-bootstrap/Button';

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
import SearchScreen from "./screens/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardScreen from "./screens/DashboardScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import UserEditScreen from "./screens/UserEditScreen";

// utils
import { Store } from './store';
import ProfileScreen from "./screens/ProfileScreen";
import Footer from "./components/Footer";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  return (
    <div className='d-flex flex-column site-container'>
      <ToastContainer position="bottom-center" limit={1} />
      {/* header */}
      <header>
        <Navbar bg="dark" variant="dark" expand='lg' >
          <Container className="d-flex">
            {/* brand */}
            <LinkContainer to="/">
              <Navbar.Brand>Amazino</Navbar.Brand>
            </LinkContainer>

            <Navbar.Collapse id="basic-navbar-nav">
              {/* search box */}
              <SearchBox className='mx-auto justify-content-center' />
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

                {/* Admin Tab */}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      {/* main section */}
      <main style={{ "minHeight": "100vh" }}>
        <Container className='mt-3'>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path='/signin' element={<SigninScreen />} />
            <Route path='/shipping' element={<ShippingAddressScreen />} />
            <Route path='/signup' element={<SignupScreen />} />
            <Route path='/search' element={<SearchScreen />} />
            {/* need an Auth User */}
            <Route path='/payment' element={
              <ProtectedRoute><PaymentMethodScreen /></ProtectedRoute>
            } />
            <Route path='/cart' element={
              <ProtectedRoute><CartScreen /></ProtectedRoute>
            } />
            <Route path='/profile' element={
              <ProtectedRoute><ProfileScreen /></ProtectedRoute>
            } />
            <Route path='/placeorder' element={
              <ProtectedRoute><PlaceOrderScreen /></ProtectedRoute>
            } />
            <Route path='/order/:id' element={
              <ProtectedRoute><OrderScreen /></ProtectedRoute>
            } />
            <Route path='/orderhistory' element={
              <ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>
            } />
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute><DashboardScreen /></AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute><OrderListScreen /></AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute><UserListScreen /></AdminRoute>
            } />
            <Route path="/admin/users/:id" element={
              <AdminRoute><UserEditScreen /></AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute><ProductListScreen /></AdminRoute>
            } />
            <Route path="/admin/product/:id" element={
              <AdminRoute><ProductEditScreen /></AdminRoute>
            } />
          </Routes>
        </Container>
      </main >

      {/* footer */}
      <Footer />
    </div >
  );
}

export default App;
