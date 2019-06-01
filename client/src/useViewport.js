import { useState, useEffect } from 'react'

const DEFAULT_VIEWPORT = {
  latitude: 39.9526,
  longitude: -75.1652,
  zoom: 13,
}

function useViewport(params) {
  const initialViewport =
    JSON.parse(localStorage.getItem('viewport')) || DEFAULT_VIEWPORT

  const [viewport, setViewport] = useState(initialViewport)
  const [userPosition, setUserPosition] = useState(null)
  const [fetchingUserPosition, setFetchingUserPosition] = useState(false)

  useEffect(() => {
    const { latitude, longitude, zoom } = viewport
    localStorage.setItem(
      'viewport',
      JSON.stringify({ latitude, longitude, zoom })
    )
  }, [viewport])

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      setFetchingUserPosition(true)
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({ zoom: 13, latitude, longitude })
        setUserPosition({ latitude, longitude })
        setFetchingUserPosition(false)
      })
    }
  }

  return [
    viewport,
    setViewport,
    userPosition,
    getUserPosition,
    fetchingUserPosition,
  ]
}

export default useViewport
