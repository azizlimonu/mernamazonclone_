import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
// import logger from 'use-reducer-logger';
// component
import { Product } from '../components';
import Loading from '../components/Loading';
import Error from '../components/Error';
// bootsrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      break;
  }
};

const HomeScreen = () => {
  const initialState = {
    products: [],
    loading: false,
    error: '',
  }
  const [state, dispatch] = useReducer((reducer), initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        const result = await axios.get('http://localhost:5500/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (error) {
        console.log(error);
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {state?.loading
          ? (<Loading />)
          : state.error
            ? (<Error variant='danger'>{state.error}</Error>)
            : (
              <Row>
                {state?.products?.map((product) => (
                  <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                    <Product product={product}></Product>
                  </Col>
                ))}
              </Row>
            )}
      </div>
    </div>
  )
}

export default HomeScreen