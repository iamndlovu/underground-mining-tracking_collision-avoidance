import React from "react";

const Thumbnail = ({ photoInfo }) => {
	const { photoSrc, photoAlt } = photoInfo;

	return <img src={photoSrc} alt={photoAlt} style={thumbnailStyles} />;
};

const thumbnailStyles = {
	display: "block",
	maxWidth: "98%",
	maxHeight: "350px",
	margin: "auto",
	padding: "1% 0",
	objectFit: "cover",
	borderRadius: "4px",
};

export default Thumbnail;
