export default function reducer(state, { type, payload }) {
  switch (type) {
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: payload,
      }
    case 'IS_LOGGED_IN':
      return {
        ...state,
        isAuth: payload,
      }
    case 'SIGNOUT_USER':
      return {
        ...state,
        currentUser: null,
        isAuth: false,
      }
    case 'CREATE_DRAFT':
      return {
        ...state,
        draft: {
          latitude: 0,
          longitude: 0,
        },
      }
    case 'UPDATE_DRAFT_LOCATION':
      return {
        ...state,
        draft: payload,
      }
    case 'DELETE_DRAFT':
      return {
        ...state,
        draft: null,
      }
    case 'GET_PINS':
      return {
        ...state,
        pins: payload,
        newPin: null,
      }
    case 'CREATE_PIN':
      const pinAlreadyInState = state.pins.some(pin => pin._id === payload._id)
      if (pinAlreadyInState) return state
      return {
        ...state,
        pins: [...state.pins, payload],
        newPin: payload,
      }
    default:
      return state
  }
}
