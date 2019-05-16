import React, { useContext } from 'react'
import Context from '../../context'
import { GraphQLClient } from 'graphql-request'
import { ME_QUERY } from '../../graphql/queries'

import { withStyles } from '@material-ui/core/styles'

import { GoogleLogin } from 'react-google-login'
import Typography from '@material-ui/core/Typography'

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context)

  const handleSuccess = async googleUser => {
    try {
      // grab the successfully logged-in user's Google idToken
      const idToken = googleUser.getAuthResponse().id_token
      // create a GraphQL Client object, pass it the token as an auth header
      const client = new GraphQLClient('/graphql', {
        headers: {
          authorization: idToken,
        },
      })
      // query the server (server verifies token, finds or creates a User, returns user's info)
      const { me } = await client.request(ME_QUERY)
      // add the user's info to 'currentUser' field in state
      dispatch({ type: 'LOGIN_USER', payload: me })
      dispatch({ type: 'IS_LOGGED_IN', payload: googleUser.isSignedIn() })
    } catch (err) {
      handleFailure(err)
    }
  }

  const handleFailure = err => console.error('Error logging in', err)

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: 'rgb(66, 133, 244)' }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="510980565610-7pvoehe81j7borjurdf4jtics2u7t5ed.apps.googleusercontent.com"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
        isSignedIn={true}
        theme="dark"
      />
    </div>
  )
}

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
}

export default withStyles(styles)(Login)
