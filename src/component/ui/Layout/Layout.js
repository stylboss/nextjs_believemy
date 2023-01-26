import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

function Layout(props) {
  return (
    <div
      className="container"
      style={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <Header />
      <div style={{ flexGrow: 1 }}>{props.children}</div>
      <Footer />
    </div>
  );
}

export default Layout;