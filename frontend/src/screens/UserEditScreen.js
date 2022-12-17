import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Error from '../components/Error';
import Loading from '../components/Loading';
import { Store } from '../store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const UserEditScreen = () => {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_SUCCESS' });
        const { data } = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        console.log(data);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error });

      }
    }
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/users/${userId}`,
        { _id: userId, name, email, isAdmin },
        { headers: { Authorization: `Bearer ${userInfo.token}` } });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('User updated successfully');
      navigate('/admin/users');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className='w-75'>
      <Helmet>
        <title>Edit User ${name}</title>
      </Helmet>
      <h1>Edit User ${name}</h1>

      {loading ? (<Loading />) : error ? <Error>{error}</Error> : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <Loading />}
          </div>
        </Form>
      )}
    </Container>
  )
}

export default UserEditScreen;