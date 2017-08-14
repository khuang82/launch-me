import _ from 'lodash';
import {
  GOT_PAD_DATA,
  GOT_LAUNCH_DATA,
  GOT_LAUNCH_DATA_ERROR
} from './actions';


const singlePadReducer = (state = {}, action, rockets = {}) => {
  switch (action.type) {
    case GOT_PAD_DATA:
      return {
        ...state,
        id: action.padId,
        name: action.data.name,
        locationId: action.data.locationid,
        position: {
          lat: +action.data.latitude,
          lng: +action.data.longitude,
        }
      };
    case GOT_LAUNCH_DATA:
      return {
        ...state,
        rockets: rockets && Object.keys(rockets).map(key => +key)
      };
    default:
      return state;
  }
};

const padsReducer = (state = {}, action, rockets) => {
  switch (action.type) {
    case GOT_PAD_DATA:
    case GOT_LAUNCH_DATA:
      return {
        ...state,
        [action.padId]: singlePadReducer(state[action.padId], action, rockets)
      };
    default:
      return state;
  }
};

const launchDataReducer = (state = {}, action) => {
  switch (action.type) {
    case GOT_LAUNCH_DATA:
    case GOT_LAUNCH_DATA_ERROR:
      // Object.assign and spread operator only do a shallow copy
      const rockets = _.clone(state.rockets || {});
      const currentRockets = {};

      action.data.launches.forEach((launch) => {
        const rocket = {
          id: launch.rocket.id,
          name: launch.rocket.name,
          configuration: launch.rocket.configuration,
          familyname: launch.rocket.familyname
        };
        currentRockets[rocket.id] = { ...rocket };
        if (!rockets[rocket.id]) {
          rockets[rocket.id] = { ...rocket };
        }
      });

      return {
        ...state,
        pads: padsReducer(state.pads, action, currentRockets),
        rockets
      };
    default:
      return state;
  }
};

export const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case GOT_PAD_DATA:
      return { ...state, pads: padsReducer(state.pads, action) };
    case GOT_LAUNCH_DATA:
    case GOT_LAUNCH_DATA_ERROR:
      return {
        ...state,
        ...launchDataReducer(state, action),
        activePad: action.padId
      };


    default:
      return state;
  }
};
