import React, { useState, useEffect, useContext } from 'react'
import diffInMinutes from 'date-fns/difference_in_minutes'
import { withStyles } from '@material-ui/core/styles'
import { useClient } from '../graphql/client'
import { GET_PINS } from '../graphql/queries'
import { DELETE_PIN } from '../graphql/mutations'
import {
  PIN_CREATED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
} from '../graphql/subscriptions'

import Context from '../context'

import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl'
import { Subscription } from 'react-apollo'
import PinIcon from './PinIcon'
import Blog from './Blog'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13,
}

const Map = ({ classes }) => {
  const client = useClient()

  const {
    state: { currentUser, draft, pins, newPin },
    dispatch,
  } = useContext(Context)

  useEffect(() => {
    getPins()
  }, [])

  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null)

  useEffect(() => {
    getUserPosition()
  }, [])

  const [popupPin, setPopupPin] = useState(null)

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS)
    dispatch({ type: 'GET_PINS', payload: getPins })
  }

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({ ...viewport, latitude, longitude })
        setUserPosition({ latitude, longitude })
      })
    }
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    // close any open popups
    setPopupPin(null)
    if (!leftButton) return
    if (!draft) {
      dispatch({ type: 'CREATE_DRAFT' })
    }
    const [longitude, latitude] = lngLat
    dispatch({
      type: 'UPDATE_DRAFT_LOCATION',
      payload: { latitude, longitude },
    })
  }

  const highlightNewPins = pin => {
    const isNewPin = diffInMinutes(Date.now(), Number(pin.createdAt)) <= 30
    return isNewPin ? 'limegreen' : 'darkblue'
  }

  const handleSelectPin = pin => {
    setPopupPin(pin)
    dispatch({ type: 'SET_CURRENT_PIN', payload: pin })
  }

  const isAuthUser = () => currentUser._id === popupPin.author._id

  const handleDeletePin = async pinId => {
    const variables = { pinId }

    //? No longer need response for use in dispatch
    // const { deletePin } = await client.request(DELETE_PIN, variables)
    await client.request(DELETE_PIN, variables)

    //? No longer have to dispatch here directly, will be dispatched by a subscription listener for newly created Pins in Map.js
    // dispatch({ type: 'DELETE_PIN', payload: deletePin._id })

    setPopupPin(null)
  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoibmRzdGVwaGVucyIsImEiOiJjanZyOTN3ZW8yc2p0NDNsNjRmZnJ2NjV0In0.yUu9-1x2TlsiQTZm30lMiA"
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        {/* NAVIGATION CONTROL */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {/* PIN FOR USER'S CURRENT LOCATION */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}

        {/* DRAFT PIN */}
        {draft && (
          <Marker
            latitude={draft.latitude}
            longitude={draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}

        {/* CREATED PINS */}
        {pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={highlightNewPins(pin)}
              newPin={newPin && pin._id === newPin._id}
            />
          </Marker>
        ))}

        {/* POPUP DIALOG FOR SELECTED PIN */}
        {popupPin && (
          <Popup
            anchor="top"
            latitude={popupPin.latitude}
            longitude={popupPin.longitude}
            closeOnClick={false}
            onClose={() => {
              setPopupPin(null)
              dispatch({ type: 'CLEAR_CURRENT_PIN' })
            }}
          >
            <img
              className={classes.popupImage}
              src={popupPin.image}
              alt={popupPin.title}
            />
            <div className={classes.popupTab}>
              <Typography>{popupPin.title}</Typography>
              {/* DELETE BUTTON -- shown if Pin belongs to current user */}
              {isAuthUser() && (
                <Button onClick={e => handleDeletePin(popupPin._id)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>

      {/* SIDEBAR / BLOG -- PIN CONTENT */}
      <Blog />

      {/* SUBSCRIPTIONS FOR CREATING, UPDATING, and DELETING PINS */}
      <Subscription
        subscription={PIN_CREATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinCreatedSubscription } = subscriptionData.data
          dispatch({ type: 'CREATE_PIN', payload: pinCreatedSubscription })
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdatedSubscription } = subscriptionData.data
          dispatch({
            type: 'UPDATE_PIN_WITH_COMMENT',
            payload: pinUpdatedSubscription,
          })
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeletedSubscription } = subscriptionData.data
          dispatch({
            type: 'DELETE_PIN',
            payload: pinDeletedSubscription._id,
          })
        }}
      />
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em',
  },
  deleteIcon: {
    color: 'red',
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover',
  },
  popupTab: {
    maxWidth: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    // flexDirection: 'column',
    '& p': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      paddingLeft: '0.6em',
    },
    '& button': {
      paddingRight: '0',
      paddingLeft: '0',
      // marginRight: '-14px',
      minWidth: '36px',
    },
  },
}

export default withStyles(styles)(Map)
