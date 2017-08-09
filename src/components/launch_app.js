import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Map from './map';
import RocketList from './rocketlist';
import { getLaunchData } from '../actions';


class LaunchApp extends Component {
  constructor(props) {
    super(props);
    this.handleMapLoad = this.handleMapLoad.bind(this);
  }

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  render() {
    return (
      <div>
        <div className="map-container">
          <Map
            containerElement={<div style={{ height: '100%' }}/>}
            mapElement={<div style={{ height: '100%' }}/>}
            onMapLoad={this.handleMapLoad}
          />
        </div>
        <div className="rocket-container">
          {!_.isEmpty(this.props.activePad) &&
            <RocketList {...this.props.activePad}/>}
        </div>
      </div>
    );
  }
}

LaunchApp.defaultProps = {
  activePad: {}
};

LaunchApp.propTypes = {
  activePad: PropTypes.object
};

const getActivePad = state => {
  if (!state.activePad) {
    return {};
  }
  const pad = state.pads[state.activePad];
  return {
    pad: pad,
    rockets: pad.rockets ? pad.rockets.map(id => state.rockets[id]) : []
  };
};

const mapStateToProps = state => {
  return {
    activePad: getActivePad(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    markerOnClick: marker => dispatch(getLaunchData(marker.id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LaunchApp);
