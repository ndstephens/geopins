import React from 'react'
import PlaceTwoTone from '@material-ui/icons/PlaceTwoTone'

export default ({ size, color, newPin, onClick }) => (
  <PlaceTwoTone
    onClick={onClick}
    style={{ fontSize: size, color }}
    className={newPin ? 'animated bounce delay-1s' : ''}
  />
)
