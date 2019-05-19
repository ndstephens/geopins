import React, { useContext } from 'react'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import Context from '../../context'
import { withStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

const Comments = ({ classes, comments }) => {
  const {
    state: { currentPin },
  } = useContext(Context)

  return (
    <List className={classes.root}>
      {comments.map((comment, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={comment.author.picture} alt={comment.author.name} />
          </ListItemAvatar>
          <ListItemText
            primary={comment.text}
            secondary={
              <>
                <Typography
                  className={classes.block}
                  component="span"
                  color="textSecondary"
                >
                  {comment.author.name}
                </Typography>
                <Typography
                  className={classes.block}
                  component="span"
                  color="textPrimary"
                >
                  {distanceInWordsToNow(+comment.createdAt)} ago
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  )
}

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  block: {
    display: 'block',
  },
})

export default withStyles(styles)(Comments)
