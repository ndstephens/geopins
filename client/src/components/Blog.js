import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'

import Context from '../context'

import NoContent from './Pin/NoContent'
import CreatePin from './Pin/CreatePin'
import PinContent from './Pin/PinContent'

import { Paper } from '@material-ui/core'

const Blog = ({ classes }) => {
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
    <Paper className={classes.root}>
      <BlogContent />
    </Paper>
  )
}

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'scroll',
    display: 'flex',
    justifyContent: 'center',
  },
  rootMobile: {
    maxWidth: '100%',
    maxHeight: 300,
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
}

export default withStyles(styles)(Blog)
