import React from 'react'
import './CustomOverlay.scss'

const CustomOverlay = props => {
  return (
    <ul className="custom-overlay-box">
      <li>
        当前帧数：<span>{props.imageIndex}</span>
      </li>
      <li>
        总帧数：<span>{props.stackSize}</span>
      </li>
    </ul>
  )
}

export default CustomOverlay
