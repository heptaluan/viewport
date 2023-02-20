import React, { useState, useEffect, useRef } from 'react'
import './CompareBox.scss'

import CompareHeader from './CompareHeader/CompareHeader'
import CompareViewer from './CompareViewer/CompareViewer'

const CompareBox = () => {

  return (
    <>
      <CompareHeader />
      <div className="viewer-center-box">
        <div className="box1">
          <CompareViewer />
        </div>
        <div className="box2">
          <CompareViewer />
        </div>
      </div>
    </>
  )
}

export default CompareBox
