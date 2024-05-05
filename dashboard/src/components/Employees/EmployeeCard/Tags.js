import React from 'react';
import SingleTag from './SingleTag';

const sidePadding = '0.63rem';

const Tags = ({ taglist }) => {
  return (
    <ul style={tagListStyles}>
      {taglist &&
        taglist.map((tag) => (
          <SingleTag key={tag} tag={tag} rightMargin={sidePadding} />
        ))}
    </ul>
  );
};

const tagListStyles = {
  listStyle: 'none',
  margin: '0',
  padding: `0.45rem 0 0.45rem ${sidePadding}`,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
};

export default Tags;
