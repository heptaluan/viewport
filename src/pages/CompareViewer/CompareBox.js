import React, { useState, useEffect, useRef } from 'react'
import './CompareBox.scss'

import CompareHeader from './CompareHeader/CompareHeader'
import CompareViewer1 from './CompareViewer1'
import CompareViewer2 from './CompareViewer2'

const CompareBox = props => {
  
  const viewer1Ref = React.createRef()
  const viewer2Ref = React.createRef()
  const buttonRef = React.createRef()

  const viewer1ListClicked = (index, num) => {
    if (buttonRef.current.sync) {
      viewer2Ref.current.onCheckChange(index, num)
    }
  }

  const viewer1ImageChange = (index) => {
    if (buttonRef.current.sync) {
      viewer2Ref.current.handleCheckedListClick(index)
    }
  }

  return (
    <>
      <CompareHeader ref={buttonRef} />
      <div className="compare-viewer-box">
        <div className="box1">
          <CompareViewer1 ref={viewer1Ref} viewer1ListClicked={viewer1ListClicked} viewer1ImageChange={viewer1ImageChange} />
        </div>
        <div className="box2">
          <CompareViewer2 ref={viewer2Ref} />
        </div>
      </div>
    </>
  )
}

export default CompareBox
