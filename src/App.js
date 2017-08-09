import React, { Component } from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { rootReducer } from './reducers';
import { getLocations } from './actions';
import LaunchApp from './components/launch_app';
import './App.css';

const configureStore = (initialState) => {
  return createStore(
      rootReducer,
      initialState,
      compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
      )
    );
};
const store = configureStore();
store.dispatch(getLocations());

class App extends Component {
  render() {
    return (
      <div className="App" style={{ height: '100%' }}>
        <Provider store={store}>
          <LaunchApp />
        </Provider>
      </div>
    );
  }
}

export default App;
