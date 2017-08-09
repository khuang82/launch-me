export const GOT_LOCATIONS = 'GOT_LOCATIONS';
export const GOT_PAD_DATA = 'GOT_PAD_DATA';
export const GOT_LAUNCH_DATA = 'GOT_LAUNCH_DATA';
export const GOT_LAUNCH_DATA_ERROR = 'GOT_LAUNCH_DATA_ERROR';

const URL_ROOT = 'https://launchlibrary.net/1.2/';

export const gotLocations = data => ({
  type: GOT_LOCATIONS,
  data
});

export const gotPadData = (padId, data) => ({
  type: GOT_PAD_DATA,
  padId,
  data
});

const gotLaunchData = (padId, data) => ({
  type: GOT_LAUNCH_DATA,
  padId,
  data
});

const gotLaunchDataError = (locationId, data) => ({
  type: GOT_LAUNCH_DATA_ERROR,
  locationId,
  data
});

export const getLocations = () => {
  return dispatch => {
    // TODO: set limit=100 to get all the locations at once.
    // May not work in the future if there are > 100
    fetch(URL_ROOT + 'location/?limit=100')
      .then(response => response.json())
      .then(responseBody => {
        responseBody.locations.forEach((item) => {
          dispatch(getPads(item.id, item.name));
        });
      })
      .catch((error) => {
        console.error('Error fetching pad info', error);
      });
  }
};

export const getPads = (locationId, name) => {
  return dispatch => {
    fetch(URL_ROOT + 'pad/?limit=30&locationid=' + locationId)
      .then(response => response.json())
      .then(responseBody => {
        responseBody.pads.forEach(item => {
          dispatch(gotPadData(item.id, item));
        });
      })
  };
};

export const getLaunchData = (padId) => {
  return dispatch => {
    // 'locationid' param in launch API is wrong - should be the pad ID
    fetch(URL_ROOT + 'launch/?limit=200&locationid=' + padId)
      .then(response => response.json())
      .then(responseBody => {
        if (responseBody.status === 'error') {
          dispatch(gotLaunchDataError(padId, responseBody));
        } else {
          if (responseBody.total > 200) {
            console.log('over 200 launches');
          }
          dispatch(gotLaunchData(padId, responseBody));
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
};
