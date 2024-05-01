import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from '../loginForm/LoginForm.module.scss';

const RegistrationForm = ({ user, toggleForm, handler }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (user) {
      const { username, email, password } = user;
      setUsername(username);
      setEmail(email);
      setPassword(password);
      setConfirm(password);
    }
  }, [user]);

  const onChangeFirstName = (e) => setFirstName(e.target.value);
  const onChangeLastName = (e) => setLastName(e.target.value);
  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);
  const onChangeConfirm = (e) => setConfirm(e.target.value);
  const onChangeLevel = (e) => setLevel(e.target.value);

  const onSubmitForm = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    const fullName = `${firstName} ${lastName}`;
    // const formData = new FormData();
    // formData.append('username', username);
    // formData.append('level', level);
    // formData.append('email', email);
    // formData.append('password', password);
    // formData.append('fullName', fullName);
    const newUser = { username, level, email, password, fullName };

    if (user && toggleForm) {
      axios
        .post(`http://localhost:5000/users/update/${user._id}`, newUser)
        .then((res) => res.data)
        .then((data) => console.log(data))
        .then(() => toggleForm())
        .catch((error) => alert(error));
    } else {
      axios
        .post('http://localhost:5000/users/add', newUser)
        .then((res) => res.data)
        .then((data) => console.log(data))
        .then(() => alert('User added'))
        .then(() => handler())
        .catch((error) => alert(error));
    }
  };

  return (
    <form className={styles.LoginForm} onSubmit={onSubmitForm}>
      {!user && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor='firstname' className={styles.offscreen}>
              Your First Name
            </label>
            <input
              type='text'
              name='firstname'
              id='firstname'
              placeholder='First Name'
              value={firstName}
              onChange={onChangeFirstName}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='lastname' className={styles.offscreen}>
              Your Last Name(s)
            </label>
            <input
              type='text'
              name='lastname'
              id='lastname'
              placeholder='Last Name(s)'
              value={lastName}
              onChange={onChangeLastName}
              required
            />
          </div>
        </>
      )}
      <div className={styles.formGroup}>
        <label htmlFor='username' className={styles.offscreen}>
          Your username
        </label>
        <input
          type='text'
          name='username'
          id='username'
          placeholder='Username'
          value={username}
          onChange={onChangeUsername}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='email' className={styles.offscreen}>
          Your email address
        </label>
        <input
          type='email'
          name='email'
          id='email'
          placeholder='Email'
          value={email}
          onChange={onChangeEmail}
          required
        />
      </div>
      {!user && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor='level' className={styles.offscreen}>
              Select Access Level
            </label>
            <select
              name='level'
              id='level'
              placeholder='Access level'
              value={level}
              onChange={onChangeLevel}
              required
            >
              <option value={1}>--Select Access Level--</option>
              <option value={0}>Administrator</option>
              <option value={1}>Operator</option>
            </select>
          </div>
        </>
      )}
      <div className={styles.formGroup}>
        <label htmlFor='password' className={styles.offscreen}>
          Your password
        </label>
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='confirm' className={styles.offscreen}>
          Confirm password
        </label>
        <input
          type='password'
          name='confirm'
          id='confirm'
          placeholder='Confirm Password'
          value={confirm}
          onChange={onChangeConfirm}
          required
        />
      </div>
      <input type='submit' value='Submit' />
    </form>
  );
};

export default RegistrationForm;
