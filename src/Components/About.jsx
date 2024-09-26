import React from 'react';
import img from '../assets/car1.jpg'
const About = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About Us</h1>
      <p style={styles.text}>
        Welcome to <strong>Car Wash</strong>, where your vehicle receives the care and attention it deserves. 
        With a passion for pristine cars and a commitment to exceptional service, we have been serving 
        <strong></strong>  <strong></strong>.
      </p>
      <p style={styles.text}>
        At <strong>Car Wash</strong>, we believe that a clean car is a happy car. Our state-of-the-art facility 
        is equipped with the latest technology and eco-friendly products to ensure your vehicle gets a thorough clean 
        while minimizing our environmental footprint. Whether it's a quick exterior wash or a comprehensive detailing service, 
        our skilled team is dedicated to delivering results that exceed your expectations.
      </p>
      <h2 style={styles.subtitle}>What Sets Us Apart</h2>
      <ul style={styles.list}>
        <li><strong>Expertise:</strong> Our team consists of trained professionals who know cars inside and out.</li>
        <li><strong>Quality:</strong> We use only high-quality products and techniques to achieve a showroom finish.</li>
        <li><strong>Convenience:</strong> With flexible hours and convenient location, keeping your car clean has never been easier.</li>
        <li><strong>Customer Satisfaction:</strong> Your satisfaction is our priority, and we strive to provide a pleasant experience every time you visit.</li>
      </ul>
      <p style={styles.text}>
        Join countless satisfied customers who trust <strong> Wash </strong> for all their car care needs. Whether you're 
        preparing for a special occasion, maintaining your vehicle's value, or simply love driving a clean car, we're here to help.
      </p>
      <p style={styles.text}>
        Visit us today and experience the difference at <strong>Car Wash</strong>. Because when it comes to your car, only the best will do.
      </p>
      <img src={img} alt="" />
    </div>
  );
};

// Inline styling for simplicity
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.8rem',
    marginTop: '20px',
    marginBottom: '10px',
  },
  text: {
    fontSize: '1.1rem',
    marginBottom: '15px',
  },
  list: {
    paddingLeft: '20px',
    marginBottom: '15px',
  },
};

export default About;
