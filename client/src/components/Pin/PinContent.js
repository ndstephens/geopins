import React, { useContext } from 'react'
import format from 'date-fns/format'

import Context from '../../context'
import { withStyles } from '@material-ui/core/styles'

import CreateComment from '../Comment/CreateComment'
import Comments from '../Comment/Comments'

import Typography from '@material-ui/core/Typography'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import FaceIcon from '@material-ui/icons/Face'

const PinContent = ({ classes }) => {
  const {
    state: {
      currentPin: { title, content, author, createdAt, comments },
    },
  } = useContext(Context)

  return (
    <div className={classes.root}>
      {/* TITLE */}
      <Typography component="h2" variant="h4" color="primary" gutterBottom>
        {title}
      </Typography>

      {/* AUTHOR NAME */}
      <Typography
        className={classes.text}
        component="h3"
        variant="h6"
        color="inherit"
        gutterBottom
      >
        <FaceIcon className={classes.icon} /> {author.name}
      </Typography>

      {/* CREATED AT DATE */}
      <Typography
        className={classes.text}
        variant="subtitle2"
        color="inherit"
        gutterBottom
      >
        <AccessTimeIcon className={classes.icon} />
        {format(+createdAt, 'MMM Do, YYYY')}
      </Typography>

      {/* CONTENT */}
      <Typography variant="subtitle1" gutterBottom>
        {content}
      </Typography>

      {/* CREATE COMMENTS FORM */}
      <CreateComment />

      {/* COMMENTS */}
      <Comments comments={comments} />
    </div>
  )
}

const styles = theme => ({
  root: {
    padding: '1em 0.5em',
    textAlign: 'center',
    width: '100%',
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default withStyles(styles)(PinContent)
