import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Error from '../components/Error';
import Loading from '../components/Loading';
import { Store } from '../store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true }

    case 'FETCH_SUCCESS':
      return {
        ...state,
        product: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false
      }

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }

    default:
      return state;
  }
};

const ProductListScreen = () => {
  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: ''
  });

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/api/products/admin?page=${page}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    };
    fetchData();
  }, [page, userInfo]);

  return (
    <>
      <h1>Products</h1>
      {loading ? <Loading /> : error ? <Error>{error}</Error> : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            {/* body */}
            <tbody>
              {products?.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={{
                  pathname: '/admin/products',
                  search: `page=${x + 1}`
                }}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default ProductListScreen;