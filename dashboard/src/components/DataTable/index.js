import React, { useEffect, useState } from 'react';
import axios from 'axios';

import boxStyles from '../../box.module.scss';
import tableStyles from './DataTable.module.scss';

// icons
import person from '../../assets/icons/person.png';
import truck from '../../assets/icons/monster_truck.png';
import questionMark from '../../assets/icons/question-mark.png';

const DataTable = ({ showAll }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const dataRes = await axios.get('http://localhost:5000/data');
        setData(dataRes.data);
      } catch (err) {
        console.error(`Failed to fetch data from server:\n\t\t${err}`);
      }
    })();
  }, []);

  return (
    <table className={tableStyles.DataTable}>
      <thead className={tableStyles.tableHead}>
        <tr>
          <td>Type</td>
          <td>ID</td>
          <td>
            safety
            <br />
            distance
          </td>
          <td>
            Distance
            <br />
            Status
          </td>
          <td>
            <table>
              <thead>
                <tr>
                  <td colSpan={2}>Location</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    &nbsp;&nbsp;&nbsp;&nbsp;Latitude&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>&nbsp;&nbsp;&nbsp;Longitude&nbsp;&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </td>
          {showAll && (
            <>
              <td>
                Distance from
                <br />
                Zone 1
              </td>
              <td>
                Distance from
                <br />
                Zone 2
              </td>
            </>
          )}
          <td>Location Status</td>
          <td>Overall Status</td>
          <td>Date</td>
        </tr>
      </thead>
      <tbody className={tableStyles.tableBody}>
        {data &&
          data.map((item) => {
            let {
              _id,
              objectID,
              type,
              safetyDistance,
              distanceStatus,
              gps,
              locationStatus,
              overallStatus,
              createdAt,
            } = item;
            const { latitude, longitude } = gps;
            const types = [truck, person, questionMark];
            type = types[type] || 'unknown';

            distanceStatus =
              ['safe zone', 'caution zone', 'alarm zone', 'danger zone'][
                distanceStatus
              ] || 'unknown';
            locationStatus =
              ['closest to zone 1', 'closest to zone 2'][locationStatus] ||
              'unknown';
            const overallText =
              [
                'notifications OFF',
                'notifications OFF',
                'alarm ON',
                'SMS Sent; Alarm ON',
              ][overallStatus] || 'unknown';

            const overallClass =
              [
                boxStyles.safe,
                boxStyles.warning,
                boxStyles.alarm,
                boxStyles.danger,
              ][overallStatus] || 'unknown';

            return (
              <tr key={_id}>
                <td>
                  <img src={type} alt={'?'} style={{ height: '1.74rem' }} />
                </td>{' '}
                {/* Automobile, employee, unknown */}
                <td>{objectID}</td>
                <td>{safetyDistance}</td>
                <td>{distanceStatus}</td>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        <td>{latitude}</td>
                        <td>{longitude}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                {showAll && (
                  <>
                    <td>unknown</td>
                    <td>unknown</td>
                  </>
                )}
                <td>{locationStatus}</td>
                <td style={{ textAlign: 'left', padding: '0 7px' }}>
                  <span className={`${boxStyles.box} ${overallClass}`}></span>
                  <span
                    style={{
                      marginLeft: '0 4px 0 10px',
                      display: 'inline-block',
                    }}
                  >
                    {overallText}
                  </span>
                </td>
                <td>{new Date(createdAt).toLocaleString()}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default DataTable;
