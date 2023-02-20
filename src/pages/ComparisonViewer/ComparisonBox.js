import React, { useState, useEffect, useRef } from 'react'
import './ComparisonBox.scss'

import ComparisonHeader from './ComparisonHeader/ComparisonHeader'
import ComparisonViewer from './ComparisonViewer/ComparisonViewer'

const ComparisonBox = () => {

  return (
    <>
      <ComparisonHeader />
      <div className="viewer-center-box">
        <div className="box1">
          <ComparisonViewer />
        </div>
        <div className="box2">
          <ComparisonViewer />
        </div>
      </div>
    </>
  )
}

export default ComparisonBox
