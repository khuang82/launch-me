import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { getLaunchData } from '../actions';

const Map = withGoogleMap(props => {
  // TODO: find a way to intelligently center the map
  const defaultCenter = {
    lat: -25.363882,
    lng: 131.044922
  };

  return (
    <GoogleMap
      defaultZoom={2}
      defaultCenter={defaultCenter}
    >
      {Object.values(props.markers).map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          onClick={() => props.markerOnClick(marker)}
        >
          {props.activePad === marker.id && (
            <InfoWindow>
              <div>{props.padName}</div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
});

Map.defaultProps = {
  markers: {}
};

Map.propTypes = {
  markers: PropTypes.object.isRequired,
  activePad: PropTypes.number,
  padName: PropTypes.string
};

const mapStateToProps = state => {
  return {
    activePad: state.activePad,
    markers: state.pads
  };
};

const mapDispatchToProps = dispatch => {
  return {
    markerOnClick: marker => dispatch(getLaunchData(marker.id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
