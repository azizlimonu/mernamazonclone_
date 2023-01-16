import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BsFacebook, BsGem, BsGithub, BsGoogle, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';

export default function Footer() {
  return (
    <footer className='text-center text-lg-start text-muted mt-5'>
      <section className='d-flex justify-content-center border-top'>
        <div className='me-5 d-none d-lg-block mt-4'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div className='mt-4'>
          <a href='/' className='me-4 text-reset'>
            <BsFacebook color='secondary' size={24} />
            {/* <MDBIcon color='secondary' fab icon='facebook-f' /> */}
          </a>
          <a href='/' className='me-4 text-reset'>
            <BsTwitter color='secondary' size={24} />
          </a>
          <a href='/' className='me-4 text-reset'>
            <BsGoogle color='secondary' size={24} />
          </a>
          <a href='/' className='me-4 text-reset'>
            <BsInstagram color='secondary' size={24} />
          </a>
          <a href='/' className='me-4 text-reset'>
            <BsLinkedin color='secondary' size={24} />
          </a>
          <a href='/' className='me-4 text-reset'>
            <BsGithub color='secondary' size={24} />
          </a>
        </div>
      </section>

      <section className=''>
        <Container className='text-center text-md-start mt-5'>
          <Row className='mt-3'>
            <Col md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <BsGem color='secondary' size={24} className='me-3'/>
                Amazino
              </h6>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est, et atque ducimus deserunt asperiores aliquid?
                Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit
                amet, consectetur adipisicing elit.
              </p>
            </Col>

            <Col md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='/search?category=Women' className='text-reset'>
                  Women
                </a>
              </p>
              <p>
                <a href='/search?category=Men' className='text-reset'>
                  Men
                </a>
              </p>
              <p>
                <a href='/search?category=Kids' className='text-reset'>
                  Kids
                </a>
              </p>
              <p>
                <a href='/search?category=Accessories' className='text-reset'>
                  Accessories
                </a>
              </p>
            </Col>

            <Col md='3' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='/profile' className='text-reset'>
                  Profile
                </a>
              </p>
              <p>
                <a href='/orderhistory' className='text-reset'>
                  Order History
                </a>
              </p>
            </Col>

            <Col md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                {/* <MDBIcon color='secondary' icon='home' className='me-2' /> */}
                New York, NY 10012, US
              </p>
              <p>
                {/* <MDBIcon color='secondary' icon='envelope' className='me-3' /> */}
                info@example.com
              </p>
              <p>
                {/* <MDBIcon color='secondary' icon='phone' className='me-3' /> + 01 234 567 88 */}
              </p>
              <p>
                {/* <MDBIcon color='secondary' icon='print' className='me-3' /> + 01 234 567 89 */}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2021 Copyright:
        <a className='text-reset fw-bold' href='/'>
          amazino.com
        </a>
      </div>
    </footer>
  )
}
