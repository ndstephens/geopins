import React, { useState, useContext } from 'react'
import Context from '../../context'
import { withStyles } from '@material-ui/core'

import { useClient } from '../../graphql/client'
import { CREATE_COMMENT } from '../../graphql/mutations'

import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import ClearIcon from '@material-ui/icons/Clear'
import SendIcon from '@material-ui/icons/Send'

const CreateComment = ({ classes }) => {
  const client = useClient()

  const {
    // dispatch,
    state: { currentPin },
  } = useContext(Context)

  const [commentText, setCommentText] = useState('')

  const handleCommentSubmit = async () => {
    const variables = { pinId: currentPin._id, text: commentText }

    //? No longer need response for use in dispatch
    // const { createComment } = await client.request(CREATE_COMMENT, variables)
    await client.request(CREATE_COMMENT, variables)

    //? No longer have to dispatch here directly, will be dispatched by a subscription listener for updated Pins in Map.js
    // dispatch({ type: 'UPDATE_PIN_WITH_COMMENT', payload: createComment })

    setCommentText('')
  }

  return (
    <>
      <form className={classes.form}>
        <IconButton
          onClick={() => setCommentText('')}
          disabled={!commentText.trim()}
          className={classes.clearButton}
        >
          <ClearIcon />
        </IconButton>
        <InputBase
          autoFocus
          className={classes.input}
          placeholder="Add Comment"
          multiline={true}
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <IconButton
          onClick={handleCommentSubmit}
          disabled={!commentText.trim()}
          className={classes.sendButton}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  )
}

const styles = theme => ({
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  clearButton: {
    padding: 0,
    color: 'red',
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark,
  },
})

export default withStyles(styles)(CreateComment)
