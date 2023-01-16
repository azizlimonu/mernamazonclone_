import React from 'react'
import { Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';

export default function Categories() {
  const Categories = [
    {
      image: "/images/men.jpg",
      title: "Mens's Fashion",
      link: <Link to={{pathname:'/search',search:'?category=Men'}}>Men</Link>,
    },
    {
      image: "/images/womens.jpg",
      title: "Women's Fashion",
      link: <Link to={{pathname:'/search',search:'?category=Women'}}>Women</Link>,
    },
    {
      image: "/images/kids.jpg",
      title: "Kid's Fashion",
      link: <Link to={{pathname:'/search',search:'?category=Kids'}}>Kids</Link>

    },
    {
      image: "/images/accessories.jpg",
      title: "ACCESSORIES",
      link: <Link to={{pathname:'/search',search:'?category=Accessories'}}>Accessories</Link>,
    },
  ];

  return (
    <div className='mt-5'>
      <h1 className='text-center mb-3'>Categories</h1>
      <Row className=''>
        {Categories?.map((item, idx) => (
          <div className="col-md-3 text-center" key={idx}>
            <div className='categories-item'>
              <img src={item.image} alt={item.title} />
              <div>
                <h4>{item.title}</h4>
                <p className="text-center">{item.link}</p>
              </div>
            </div>
          </div>
        ))}
      </Row>
    </div>
  )
}
