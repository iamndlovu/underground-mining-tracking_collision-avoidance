import React from 'react';

import footerStyles from './Footer.module.scss';

const Footer = () => {
	return (
		<footer className={footerStyles.Footer}>
			&copy; {new Date().getFullYear()} Company Name. All Rights Reserved.
		</footer>
	);
};

export default Footer;
