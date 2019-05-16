import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import Context from './context'

function ProtectedRoute({ component: Component, ...rest }) {
  const { state } = useContext(Context)

  return (
    <Route
      render={routeProps =>
        !state.isAuth ? <Redirect to="/login" /> : <Component {...routeProps} />
      }
      {...rest}
    />
  )
}

export default ProtectedRoute
