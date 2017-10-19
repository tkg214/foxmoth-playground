import Immutable from 'seamless-immutable';

const initialState = Immutable({
  test: 'works',
});

// eslint-disable-next-line no-unused-vars
const testReducer = (state = initialState, action) => {
  return state;
};

export default testReducer;
