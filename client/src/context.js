import { createContext } from 'react'

const Context = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: [],
  newPin: null,
  currentPin: null, // Pin clicked on and displaying a Popup
})

export default Context
