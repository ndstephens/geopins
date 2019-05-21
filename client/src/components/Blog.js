import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

import Context from '../context'

import NoContent from './Pin/NoContent'
import CreatePin from './Pin/CreatePin'
import PinContent from './Pin/PinContent'

import { Paper } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

const Blog = ({ classes, getUserPosition, fetchingUserPosition }) => {
  const mobileSize = useMediaQuery('(max-width: 650px)')
  const {
    state: { draft, currentPin },
  } = useContext(Context)

  let BlogContent
  if (!draft && !currentPin) {
    BlogContent = NoContent
  } else if (draft && !currentPin) {
    BlogContent = CreatePin
  } else if (!draft && currentPin) {
    BlogContent = PinContent
  }

  return (
    <Paper className={mobileSize ? classes.rootMobile : classes.root}>
      {/* USER LOCATION BUTTON */}
      <div className={classes.userLocationBtn}>
        <Button
          disabled={fetchingUserPosition}
          onClick={getUserPosition}
          variant="contained"
          color="primary"
        >
          {fetchingUserPosition ? 'Fetching...' : 'Current Location'}
        </Button>
      </div>

      <Divider />

      {/* NoContent / CreatePin / PinContent */}
      <BlogContent />
    </Paper>
  )
}

const styles = {
  root: {
    minWidth: 350,
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'scroll',
  },
  rootMobile: {
    maxWidth: '100%',
    maxHeight: 300,
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  userLocationBtn: {
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

export default withStyles(styles)(Blog)
