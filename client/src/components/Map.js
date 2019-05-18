import React, { useState, useEffect, useContext } from 'react'
import diffInMinutes from 'date-fns/difference_in_minutes'
import { withStyles } from '@material-ui/core/styles'
import { useClient } from '../graphql/client'
import { GET_PINS } from '../graphql/queries'

import Context from '../context'

import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl'
import PinIcon from './PinIcon'
import Blog from './Blog'

// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13,
}

const Map = ({ classes }) => {
  const client = useClient()

  const {
    state: { draft, pins, newPin },
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
              size={40}
              color={highlightNewPins(pin)}
              newPin={newPin && pin._id === newPin._id}
            />
          </Marker>
        ))}
      </ReactMapGL>

      {/* BLOG -- PIN CONTENT */}
      <Blog />
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
}

export default withStyles(styles)(Map)
