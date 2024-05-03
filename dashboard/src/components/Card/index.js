import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Card.module.scss';

const Card = ({ title, navItems }) => {
  return (
    <article className={styles.Card}>
      <div>
        <h4>{title}</h4>
        <hr />
      </div>
      <div>
        <nav>
          {navItems.map((item) => {
            const { text, link } = item;
            return (
              <NavLink to={link} key={`${text}-${link}`}>
                {text}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </article>
  );
};

export default Card;
