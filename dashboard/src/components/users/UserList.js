import React, { useEffect, useState } from 'react';
import UserListItem from './UserListItem';
import Restricted from '../Restricted';
import Loading from '../Loading';
import RegistrationForm from '../registrationForm/RegistrationForm';
import axios from 'axios';

import styles from './UserList.module.scss';

const UserList = ({ user }) => {
  const { level } = user;

  const [users, setUsers] = useState(null);
  const [msg, setMsg] = useState('Fetching users...');
  const [activeEdit, setActiveEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/users')
      .then((res) => res.data)
      .then((data) => setUsers(data))
      .catch((err) => setMsg(`Failed to fetch system users : ${err}`));
  });

  const deleteUser = (id) => {
    const { username } = users.filter((user) => user._id === id)[0];
    if (
      window.confirm(
        `Are you sure you want to permanantly delete @${username}?`
      )
    )
      axios
        .delete(`http://localhost:5000/users/${id}`)
        .then((res) => res.data)
        .then((data) => {
          axios
            .get('http://localhost:5000/users')
            .then((res) => setUsers(res.data))
            .then(() => alert(data));
        })
        .catch((err) => alert(`FAILED TO DELETE USER\n${err}`));
  };

  const toggleForm = (id) => {
    // axios
    // 	.post(`http://localhost:5000/users/update/${id}`)
    // 	.then(res => alert(res.data))
    // 	.catch(err => alert(err));
    if (id) {
      const user = users.filter((user) => user._id === id)[0];
      setActiveEdit(user);
      setShowForm(true);
    } else {
      setActiveEdit(null);
      setShowForm(false);
      axios
        .get('http://localhost:5000/users')
        .then((res) => res.data)
        .then((data) => setUsers(data))
        .catch((err) => setMsg(`Failed to fetch system users : ${err}`));
    }
  };

  return (
    (level === 0 && (
      <>
        <button
          className={`${styles.danger} ${showForm && styles.show}`}
          onClick={() => toggleForm()}
        >
          x
        </button>
        <section
          className={`${styles.formContainer} ${showForm && styles.show}`}
        >
          <div>
            <RegistrationForm user={activeEdit} toggleForm={toggleForm} />
          </div>
        </section>
        <h1 className={'heading ' + styles.heading}>System Users</h1>
        {users ? (
          <ul className={styles.UserList}>
            {users.map((user) => (
              <div key={user._id} id={user._id}>
                <UserListItem
                  user={user}
                  handlers={{ deleteUser, toggleForm }}
                />
              </div>
            ))}
          </ul>
        ) : (
          <Loading message={msg} />
        )}
      </>
    )) || <Restricted />
  );
};

export default UserList;
