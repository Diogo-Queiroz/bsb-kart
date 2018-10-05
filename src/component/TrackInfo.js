import React, { Component } from 'react'
import track from '../img/track.svg'

class TrackInfo extends Component {
  render() {
    return (
      <div>
        <img src={track} className='track-info' alt='Track' />
      </div>
    )
  }
}

export default TrackInfo