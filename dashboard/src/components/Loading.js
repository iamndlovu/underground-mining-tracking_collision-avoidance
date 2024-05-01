import React from 'react';

const Loading = ({ message = 'Loading...' }) => (
	<div
		style={{
			height: '100%',
			width: '100%',
			flexGrow: 1,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			fontSize: '4rem',
			fontWeight: 100,
		}}
	>
		{message}
	</div>
);

export default Loading;
