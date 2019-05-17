import { useState, useEffect } from 'react'
import { GraphQLClient } from 'graphql-request'

export const BASE_URL = '/graphql'

export const useClient = () => {
  const [idToken, setIdToken] = useState('')

  useEffect(() => {
    setIdToken(
      window.gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getAuthResponse().id_token
    )
  }, [])

  return new GraphQLClient(BASE_URL, {
    headers: { authorization: idToken },
  })
}
