import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

import Context from '../../context'

import { GoogleLogout } from 'react-google-login'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Typography from '@material-ui/core/Typography'

const Signout = ({ classes }) => {
  const mobileSize = useMediaQuery('(max-width: 650px)')
  const { dispatch } = useContext(Context)

  const handleSignout = () => {
    dispatch({ type: 'SIGNOUT_USER' })
    console.log('signed out')
  }

  return (
    <GoogleLogout
      onLogoutSuccess={handleSignout}
      render={({ onClick }) => (
        //* 'onClick' does NOT trigger a custom function, it triggers the GoogleLogout component to signout the user..."magic"
        <span className={classes.root} onClick={onClick}>
          {!mobileSize && (
            <Typography variant="body1" className={classes.buttonText}>
              Signout
            </Typography>
          )}
          <ExitToApp className={classes.buttonIcon} />
        </span>
      )}
    />
  )
}

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex',
  },
  buttonText: {
    color: 'orange',
  },
  buttonIcon: {
    marginLeft: '5px',
    color: 'orange',
  },
}

export default withStyles(styles)(Signout)
