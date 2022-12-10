import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom'
import logger from 'use-reducer-logger';

import Loading from '../components/Loading';
import Error from '../components/Error';
import Rating from '../components/Rating';

import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Store } from '../store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      break;
  }
};

const ProductScreen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const initialState = {
    product: [],
    loading: false,
    error: '',
  }
  const [{ product, loading, error }, dispatch] = useReducer(logger(reducer), initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        console.log(error);
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    }
    fetchData();
  }, [slug]);

  // console.log(product);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const cart = state.cart;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const res = await axios.get(`/api/products/${product._id}`);
    if (res.data.countInStock < quantity) {
      window.alert('Sorry, Product out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity }
    });
    navigate('/cart');
  }

  return (
    <>
      {loading
        ? (<Loading />)
        : error
          ? (<Error variant='danger'>{error}</Error>)
          : (
            <div>
              <Row>
                <Col md={6}>
                  <img
                    className="img-large"
                    src={product.image}
                    alt={product.name}
                  ></img>
                </Col>

                <Col md={3}>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <Helmet>
                        <title>{product.name}</title>
                      </Helmet>
                      <h1>{product.name}</h1>
                    </ListGroup.Item>
                  </ListGroup>

                  <ListGroup.Item>
                    <Rating
                      rating={product.rating}
                      numReviews={product.numReviews}
                    ></Rating>
                  </ListGroup.Item>

                  <ListGroup.Item>Pirce : ${product.price}</ListGroup.Item>

                  <ListGroup.Item>
                    Description:
                    <p>{product.description}</p>
                  </ListGroup.Item>
                </Col>

                <Col md={3}>
                  <Card>
                    <Card.Body>
                      <ListGroup variant='flush'>
                        <ListGroup.Item>
                          <Row>
                            <Col>Price:</Col>
                            <Col>${product.price}</Col>
                          </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <Row>
                            <Col>Status:</Col>
                            <Col>
                              {product.countInStock > 0 ? (
                                <Badge bg="success">In Stock</Badge>
                              ) : (
                                <Badge bg="danger">Unavailable</Badge>
                              )}
                            </Col>
                          </Row>
                        </ListGroup.Item>

                        {product.countInStock > 0 && (
                          <ListGroup.Item>
                            <div className="d-grid">
                              <Button variant="primary" onClick={addToCartHandler}>
                                Add to Cart
                              </Button>
                            </div>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
    </>
  )
}

export default ProductScreen;