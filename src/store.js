import { createStore } from 'redux';
import { rootReducer } from './reducers';

export default const getStore = () => {
  return createStore(rootReducer);
};
