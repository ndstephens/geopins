import React from 'react'
import { GraphQLClient } from 'graphql-request'
import { GoogleLogin } from 'react-google-login'
import { withStyles } from '@material-ui/core/styles'
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
{
  me {
    _id
    name
    email
    picture
  }
}
`

const Login = ({ classes }) => {
  const handleSuccess = async googleUser => {
    // grab the successfully logged-in user's Google idToken
    const idToken = googleUser.getAuthResponse().id_token
    // create a GraphQL Client object, pass it the token as an auth header
    const client = new GraphQLClient('/graphql', {
      headers: {
        authorization: idToken,
      },
    })
    // send a query to the server, includes the auth token, must be verified
    const data = await client.request(ME_QUERY)
    console.log({ data })
  }

  return (
    <GoogleLogin
      clientId="510980565610-7pvoehe81j7borjurdf4jtics2u7t5ed.apps.googleusercontent.com"
      onSuccess={handleSuccess}
      isSignedIn={true}
    />
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
