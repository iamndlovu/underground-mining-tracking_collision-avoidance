import React from 'react';
import { Helmet } from 'react-helmet';
import Header from './header/Header';
import Footer from './footer/Footer';

import pageLayout from './Layout.module.scss';

const Layout = ({ children, title, user }) => {
	return (
		<>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<div className={pageLayout.Layout}>
				<div className={pageLayout.container}>
					<Header user={user} />
					{children}
				</div>
				<Footer />
			</div>
		</>
	);
};

export default Layout;
