import React, { useContext } from 'react'
import Context from '../context'

import Login from '../components/Auth/Login'
import { Redirect } from 'react-router-dom'

const Splash = () => {
  const { state } = useContext(Context)

  return state.isAuth ? <Redirect to="/" /> : <Login />
}

export default Splash
