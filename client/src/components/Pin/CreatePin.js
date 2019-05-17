import React, { useState, useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'

import Context from '../../context'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone'
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined'
import ClearIcon from '@material-ui/icons/Clear'
import SaveIcon from '@material-ui/icons/SaveTwoTone'

const CreatePin = ({ classes }) => {
  const { dispatch } = useContext(Context)

  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')

  const handleDeleteDraft = () => {
    dispatch({ type: 'DELETE_DRAFT' })
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log({ title, image, content })
  }

  return (
    <form className={classes.form}>
      {/* FORM HEADER */}
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} />
        Pin Location
      </Typography>

      <div className={classes.inputContainer}>
        {/* PIN TITLE INPUT */}
        <TextField
          autoFocus
          name="title"
          label="Title"
          placeholder="Insert Pin title"
          fullWidth
          onChange={e => setTitle(e.target.value)}
        />
        {/* PIN PHOTO INPUT -- HIDDEN */}
        <input
          accept="image/*"
          id="image"
          type="file"
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        {/* PIN PHOTO INPUT -- ICON BUTTON */}
        <label htmlFor="image">
          <Button
            style={{ color: image && 'green' }}
            component="span"
            size="small"
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>

      {/* PIN TEXT CONTENT INPUT */}
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={e => setContent(e.target.value)}
        />
      </div>

      {/* BUTTONS */}
      <div className={classes.buttonContainer}>
        {/* DISCARD */}
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant="contained"
          color="primary"
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        {/* SUBMIT */}
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !image || !content.trim()}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  )
}

const styles = theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit,
    width: '80%',
  },
  contentField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // margin: '0 auto',
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'nowrap',
  },
  input: {
    display: 'none',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    // marginRight: theme.spacing.unit,
    // marginLeft: 0,
  },
})

export default withStyles(styles)(CreatePin)
