// utils
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Store } from '../store';

// comp
import Error from '../components/Error';

// bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  // destructuring cartItems from state from the state.cart
  const {
    cart: { cartItems }
  } = state;
  console.log("cart", cartItems);

  // cart functionality
  const updateCartHandler = async (item, quantity) => {
    console.log("item cart selected : ",item);
    console.log("item qty selected: ",quantity);
    const { data } = await axios.get(`/api/products/${item._id}`);
    const existChoice = data?.variant.find(x => x.name === item.choose);
    if (existChoice) {
      if (data.variant.stock < quantity) {
        window.alert('Sorry. Product is out of stock');
      }
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...item, quantity },
      });
    }
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems?.length === 0
            ? (
              <Error>
                Cart Is Empty.
                <Link to='/'>
                  Go Shopping
                </Link>
              </Error>
            )
            : (
              <ListGroup>
                {cartItems?.map((item, idx) => (
                  <ListGroup.Item key={idx}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          style={{ "height": "80px" }}
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>
                        <Button
                          onClick={() => updateCartHandler(item, item.quantity - 1)}
                          variant="light"
                          disabled={item.quantity === 1}
                        >
                          <i className="fas fa-minus-circle"></i>
                        </Button>{' '}
                        <span>{item.quantity}</span>{' '}
                        <Button
                          variant="light"
                          onClick={() => updateCartHandler(item, item.quantity + 1)}
                          disabled={item.quantity === item.countInStock}
                        >
                          <i className="fas fa-plus-circle"></i>
                        </Button>
                      </Col>
                      <Col md={2}>{item.choose}</Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={2}>
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant="light"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default CartScreen