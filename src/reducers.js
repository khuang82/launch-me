import _ from 'lodash';
import {
  GOT_PAD_DATA,
  GOT_LAUNCH_DATA,
  GOT_LAUNCH_DATA_ERROR
} from './actions';


const singlePadReducer = (state = {}, action, rockets) => {
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
      // Object.assign and spread operator only do a shallow copy
      const rockets = _.isEmpty(state.rockets) ? {} : _.clone(state.rockets);

      action.data.launches.forEach((launch) => {
        if (!rockets[launch.rocket.id]) {
          rockets[launch.rocket.id] = {
            id: launch.rocket.id,
            name: launch.rocket.name,
            configuration: launch.rocket.configuration,
            familyname: launch.rocket.familyname,
          };
        }
      });

      return {
        ...state,
        pads: padsReducer(state.pads, action, rockets),
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
      return {
        ...state,
        ...launchDataReducer(state, action),
        activePad: action.padId
      };
    case GOT_LAUNCH_DATA_ERROR:
      return state;


    default:
      return state;
  }
};
