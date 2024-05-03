import React from 'react';
import { Helmet } from 'react-helmet';
import Header from './header/Header';
import Footer from './footer/Footer';

import pageLayout from './Layout.module.scss';

const Layout = ({ children, title, user, hideHeader, hideFooter }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className={pageLayout.Layout}>
        <div className={pageLayout.container}>
          {!hideHeader && <Header user={user} />}
          {children}
        </div>
        {!hideFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;
