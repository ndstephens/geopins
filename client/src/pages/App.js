import React from 'react'
import withRoot from '../withRoot'

import Header from '../components/Header'
import Map from '../components/Map'

const App = () => {
  return (
    <>
      <Header />
      <Map />
    </>
  )
}

export default withRoot(App)
