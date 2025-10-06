import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about">
      <h1>About Crackers Bazaar</h1>
      <p>
        Crackers Bazaar is a modern e-commerce platform specializing in premium fireworks and crackers. 
        We are committed to providing our customers with the highest quality products while ensuring 
        safety and compliance with all regulations.
      </p>
      <p>
        Our platform is built with cutting-edge technology, featuring a React TypeScript frontend and Spring Boot backend, 
        ensuring a fast, secure, and user-friendly shopping experience.
      </p>
      <p>
        Whether you're celebrating a festival, organizing an event, or just want to add some sparkle to your 
        special moments, Crackers Bazaar has everything you need.
      </p>
      <div className="features">
        <div className="feature-card">
          <h3>🛒 Easy Shopping</h3>
          <p>Browse our extensive catalog with an intuitive and responsive interface.</p>
        </div>
        <div className="feature-card">
          <h3>💳 Secure Payments</h3>
          <p>Safe and secure payment processing with multiple payment options.</p>
        </div>
        <div className="feature-card">
          <h3>📞 24/7 Support</h3>
          <p>Round-the-clock customer support to help with all your needs.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
