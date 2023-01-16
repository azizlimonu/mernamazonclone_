import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
// import { useLocation } from 'react-router-dom';

const bannerData = [
  {
    imagePath: "/images/banner-1.jpg",
    desc: "Trending item",
    title: "Women's latest fashion sale",
    text: "Starting at",
    price: "15"
  },
  {
    imagePath: "/images/banner-2.jpg",
    desc: "Trending accessories",
    title: "Modern sunglasses",
    text: "Starting at",
    price: "5"
  },
  {
    imagePath: "/images/banner-3.jpg",
    desc: "Sale Offer",
    title: "New fashion summer sale",
    text: "Starting at ",
    price: "25"

  }
];

export default function Banner() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  // const location = useLocation();
  // console.log(location);

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} interval='10000'>
      {bannerData?.map((item, idx) => (
        <Carousel.Item key={idx} style={{ "position": "relative" }}>
          <img
            className="d-block w-100 object-fit-cover"
            src={item.imagePath}
            alt={`banner${idx}`}
          />
          <div style={{ "position": "absolute", "bottom": "200px", "left": "170px", "right": "25px", "padding": "20px 25px", "width": "400px" }}>
            <p style={{ "textTransform": "capitalize", "letterSpacing": "2px", "marginBottom": "10px", "color": "hsl(353, 100%, 78%)", "fontSize": "1.625rem", "fontWeight": "500" }}>{item.desc}</p>
            <h2 style={{ "color": "#979090", "fontSize": "2.625rem", "textTransform": "uppercase", "lineHeight": "1", "marginBottom": "10px" }}>{item.title}</h2>
            <p style={{ "color": "#979090", "fontSize": "1.5rem", "fontWeight": "400" }}>
              {item.text}
              <span style={{ "fontSize": "2rem", "color": "#989090", "fontWeight": "700" }}> ${item.price}</span>
            </p>
            <a href="/" style={{ "backgroundColor": "hsl(353, 100%, 78%)", "padding": "10px", "borderRadius": "5px", "textDecoration": "none", "color": "white" }}>Shop now</a>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
