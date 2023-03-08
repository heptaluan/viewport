import React, { useState, useEffect, useRef } from 'react'
import './CompareBox.scss'

import CompareMatchList from './CompareMatchList/CompareMatchList'
import CompareHeader from './CompareHeader/CompareHeader'
import CompareViewer1 from './CompareViewer1'
import CompareViewer2 from './CompareViewer2'

const CompareBox = props => {
  const viewer1Ref = React.createRef()
  const viewer2Ref = React.createRef()
  const buttonRef = React.createRef()
  const [showTab, setShowTab] = useState(false)

  const viewer1ListClicked = (index, num) => {
    if (buttonRef.current.sync) {
      viewer2Ref.current.onCheckChange(index, num)
    }
  }

  const viewer1ImageChange = index => {
    console.log(buttonRef.current)
    if (buttonRef.current.sync) {
      viewer2Ref.current.handleCheckedListClick(index)
    }
  }

  // TAB 切换
  const handleTabClick = (key, event) => {
    if (Number(key) === 2) {
      setShowTab(true)
    } else {
      setShowTab(false)
    }
  }

  return (
    <>
      <CompareHeader ref={buttonRef} />
      <div className="compare-viewer-box">
        {showTab ? <CompareMatchList noduleList={[]} imagesConfig={[]} /> : null}
        <div className="box1">
          <CompareViewer1
            ref={viewer1Ref}
            viewer1ListClicked={viewer1ListClicked}
            viewer1ImageChange={viewer1ImageChange}
            handleTabClick={handleTabClick}
          />
        </div>
        <div className="box2">
          <CompareViewer2 ref={viewer2Ref} />
        </div>
      </div>
    </>
  )
}

export default CompareBox
