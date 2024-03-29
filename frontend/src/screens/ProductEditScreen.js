import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Error from '../components/Error';
import Loading from '../components/Loading';
import { Store } from '../store';
import { getError } from '../utils/getError';

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

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const ProductEditScreen = () => {
  const params = useParams();
  const { id: productId } = params;
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: true,
    loadingUpload: false,
    loadingUpdate: false,
    error: '',
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [variant, setVariant] = useState([{ name: "", stock: 0 }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setDescription(data.description);
        setVariant(data.variant || [{ name: "", stock: "" }]);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);
  
  // console.log("after fetch", variant);
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(`/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          brand,
          countInStock,
          description,
          variant,
        }, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'UPDATE_SUCCESS', });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(getError(error))
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);

    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      toast.success('Image uploaded successfully');
      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image Uploaded Successfully. Click update to apply it');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(error) });
    }
  }

  const deleteFileHandler = async (fileName) => {
    console.log(fileName);
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image Removed Successfully. Click Update to apply')
  };

  const [nameChoice, setNameChoice] = useState("");
  const [choiceStock, setChoiceStock] = useState(0);

  const handleChoice = (e) => {
    e.preventDefault();
    const choices = { name: nameChoice, stock: choiceStock };
    // setChoice((prev) => [...prev, { ...prev, choices }]);
    setVariant([choices, ...variant]);
    setNameChoice("");
    setChoiceStock("");
    console.log(variant);
  };

  const deleteChoice = (item) => {
    setVariant(variant.filter((x) => x !== item));
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <Error variant="danger">{error}</Error>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageFile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={uploadFileHandler} />
            {loadingUpload && <Loading />}
          </Form.Group>

          <Form.Group className='mb-3' controlId='image'>
            <Form.Label>Additional Images</Form.Label>
            {images.length === 0 && <Error>No image</Error>}
            <ListGroup variant="flush">
              {images?.map((item) => (
                <ListGroup.Item key={item}>
                  {item}
                  <Button variant='light' onClick={() => deleteFileHandler(item)}>
                    <i className='fa fa-times-circle'></i>
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Form.Group>

          <Form.Group className='mb-3' controlId='additionalImageFile'>
            <Form.Label>Upload Aditional Image</Form.Label>
            <Form.Control
              type='file'
              onChange={(e) => uploadFileHandler(e, true)}
            />
            {loadingUpload && <Loading />}
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              as="textarea"
              rows={3}
            />
          </Form.Group>

          <Form.Group className="mb-3 " controlId="addChoiceName">
            <Form.Label>Name Choices</Form.Label>
            <Form.Control
              value={nameChoice}
              onChange={(e) => setNameChoice(e.target.value)}
            />

            <Form.Label>Choices Stock</Form.Label>
            <Form.Control
              value={choiceStock}
              onChange={(e) => setChoiceStock(e.target.value)}
            />
            <button onClick={handleChoice}>Add Choices</button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Variant</Form.Label>
            {variant?.map((item, i) => (
              <ListGroup variant="flush" key={i}>
                <div className='d-flex flex-row'>
                  <ListGroup.Item>Name : {item.name}</ListGroup.Item>
                  <ListGroup.Item>Stock : {item.stock}</ListGroup.Item>
                  <Button variant="danger" onClick={() => deleteChoice(item)}>
                    delete
                  </Button>
                </div>
              </ListGroup>
            ))}
          </Form.Group>

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <Loading />}
          </div>
        </Form>
      )
      }
    </Container >
  )
}

export default ProductEditScreen