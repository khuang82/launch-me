import React from 'react';

const RocketList = props => {
  // TODO: add pagination and a loading message
  return (
      <div className="rocket-list">
        <h4>Rockets Launched at {props.pad.name}</h4>
        {props.rockets.map((rocket, index) => {
          return (
            <div className="rocket-item" key={index}>
              <div>{rocket.name}</div>
              <div>Family: {rocket.familyname}</div>
              <div>Configuration: {rocket.configuration}</div>
            </div>
          );
        })}
      </div>
  );
};

export default RocketList;
