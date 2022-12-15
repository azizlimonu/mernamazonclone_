import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import Error from '../components/Error';
import Loading from '../components/Loading';
import { Store } from '../store';
import { getError } from '../utils/getError';
import Chart from 'react-google-charts';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const DashboardScreen = () => {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async (req, res) => {
      try {
        const { data } = await axios.get(`/api/orders/summary`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error)
        });
      }
    }
    fetchData();
  }, [userInfo])

  return (
    <>
      <h1>Dashboard</h1>
      {loading ? <Loading /> : error ? <Error variant='danger'>{error}</Error> : (
        <>
          <Row>
            {/* Users */}
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0] ? summary.users[0].numUsers : 0}
                  </Card.Title>
                  <Card.Text> Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* Orders */}
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {/* Total Sales */}
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    $
                    {summary.orders && summary.users[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}
                  </Card.Title>
                  <Card.Text> Orders</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="my-3">
            <h2>Sales</h2>
            {summary.dailyOrders.length === 0 ? (
              <Error>No Sales</Error>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              <Error>No Categories</Error>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default DashboardScreen