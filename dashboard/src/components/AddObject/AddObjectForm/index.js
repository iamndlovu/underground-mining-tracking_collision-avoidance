import React, { useState } from 'react';

import styles from '../../loginForm/LoginForm.module.scss';
import axios from 'axios';

const AddObjectForm = ({ type }) => {
  const [uid, setUid] = useState('');
  const [driver, setDriver] = useState('');
  const [make, setMake] = useState('');
  const [age, setAge] = useState(16);
  const [gender, setGender] = useState(null);
  const [grade, setGrade] = useState(null);
  const [fullName, setFullName] = useState('');

  const automibile = type.toLowerCase() === 'automobile';
  const employee = type.toLowerCase() === 'employee';

  const onChangeUid = (e) => setUid(e.target.value);
  const onChangeDriver = (e) => setDriver(e.target.value);
  const onChangeFullName = (e) => setFullName(e.target.value);
  const onChangeMake = (e) => setMake(e.target.value);
  const onChangeAge = (e) => setAge(e.target.value);
  const onChangeGender = (e) => setGender(e.target.value);
  const onChangeGrade = (e) => setGrade(e.target.value);

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:5000/${type.toLowerCase()}s/add`,
        { uid, driver, make, age, gender, grade, fullName }
      );

      const { data } = res;
      window.alert(`${data.uid} successfully added!`);
      console.table(res.data);
    } catch (err) {
      console.error(`Failed to add ${type} with message: ${err}`);
      window.alert(`Failed to add ${type} with message: ${err}`);
    } finally {
      setUid('');
      setDriver('');
      setMake('');
      setAge(16);
      setGender(null);
      setGrade(null);
      setFullName('');
    }
  };

  return (
    <form className={styles.LoginForm} onSubmit={submitForm}>
      <div className={styles.formGroup}>
        <label htmlFor='uid' className={styles.offscreen}>
          {type} UID
        </label>
        <input
          type='text'
          name='uid'
          id='uid'
          placeholder='uid'
          value={uid}
          onChange={onChangeUid}
          required
        />
      </div>
      {automibile && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor='make' className={styles.offscreen}>
              Automobile make
            </label>
            <input
              type='text'
              name='make'
              id='make'
              placeholder='make'
              value={make}
              onChange={onChangeMake}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='driver' className={styles.offscreen}>
              Automobile driver
            </label>
            <input
              type='text'
              name='driver'
              id='driver'
              placeholder='driver'
              value={driver}
              onChange={onChangeDriver}
              required
            />
          </div>
        </>
      )}
      {employee && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor='fullName' className={styles.offscreen}>
              Employee fullName
            </label>
            <input
              type='text'
              name='fullName'
              id='fullName'
              placeholder='fullName'
              value={fullName}
              onChange={onChangeFullName}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='gender' className={styles.offscreen}>
              Select Employee Gender
            </label>
            <select
              name='gender'
              id='gender'
              placeholder='Employee gender'
              value={gender}
              onChange={onChangeGender}
              required
            >
              <option value={null}>--Select Employee Gender--</option>
              <option value={'male'}>Male</option>
              <option value={'female'}>Female</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='age' className={styles.offscreen}>
              Employee age
            </label>
            <input
              type='number'
              name='age'
              id='age'
              min='16'
              max='60'
              value={age}
              onChange={onChangeAge}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='grade' className={styles.offscreen}>
              Select Employee Grade
            </label>
            <select
              name='grade'
              id='grade'
              placeholder='Employee grade'
              value={grade}
              onChange={onChangeGrade}
              required
            >
              <option value={null}>--Select Employee Grade--</option>
              <option value={'a1'}>A1</option>
              <option value={'a2'}>A2</option>
              <option value={'k'}>K</option>
              <option value={'j'}>J</option>
              <option value={'x'}>X</option>
              <option value={'y'}>Y</option>
            </select>
          </div>
        </>
      )}
      <input type='submit' value={`Add ${type}`} />
    </form>
  );
};

export default AddObjectForm;
