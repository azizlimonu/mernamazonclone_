import axios from 'axios';
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { Form, useNavigate, useParams } from 'react-router-dom'
import logger from 'use-reducer-logger';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loading from '../components/Loading';
import Error from '../components/Error';
import Rating from '../components/Rating';
import { Store } from '../store';
import {getError} from '../utils/getError';

import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    default:
      break;
  }
};

const ProductScreen = () => {
  let reviewRef = useRef();

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  // const [selectedImage, setSelectedImage] = useState('');

  const initialState = {
    product: [],
    loading: false,
    error: '',
  }

  const [{ product, loading, error, loadingCreateReview }, dispatch] = useReducer(logger(reducer), initialState);

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
  const { cart, userInfo } = state;
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        { headers: { Authorization: `Bearer ${userInfo.token}` } });

      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('Review submitted successfully');

      // update product review, total review and rating
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;

      // update the product and reFresh and scroll to the review sect-
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return (
    <>
      {loading
        ? (<Loading />)
        : error
          ? (<Error variant='danger'>{error}</Error>)
          : (
            <div>
              <Row>
                <Col md={4}>
                  <img
                    className="img-large"
                    src={product.image}
                    alt={product.name}
                  ></img>
                </Col>

                <Col md={5}>
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

                  <ListGroup.Item>Price : ${product.price}</ListGroup.Item>

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

              <div className='my-3'>
                <h2 ref={reviewRef}>Reviews</h2>
                <div className='mb-3'>
                  {product?.reviews?.length === 0 && (
                    <Error>There's No Review</Error>
                  )}
                </div>
                <ListGroup>
                  {product?.reviews?.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating rating={review.rating} caption=" "></Rating>
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <div className='my-3'>
                  {userInfo ? (
                    <form onSubmit={submitHandler}>
                      <h2>Write a customer review</h2>
                      <Form.Group className="mb-3" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          aria-label="Rating"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1- Poor</option>
                          <option value="2">2- Fair</option>
                          <option value="3">3- Good</option>
                          <option value="4">4- Very good</option>
                          <option value="5">5- Excelent</option>
                        </Form.Select>
                      </Form.Group>
                      <FloatingLabel
                        controlId="floatingTextarea"
                        label="Comments"
                        className="mb-3"
                      >
                        <Form.Control
                          as="textarea"
                          placeholder="Leave a comment here"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </FloatingLabel>

                      <div className="mb-3">
                        <Button disabled={loadingCreateReview} type="submit">
                          Submit
                        </Button>
                        {loadingCreateReview && <Loading />}
                      </div>
                    </form>
                  ) : (
                    <Error>
                      Please{' '}
                      <Link to={`/signin?redirect=/product/${product.slug}`}>
                        Sign In
                      </Link>{' '}
                      to write a review
                    </Error>
                  )}
                </div>
              </div>
            </div>
          )}
    </>
  )
}

export default ProductScreen;