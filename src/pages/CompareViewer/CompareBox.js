import React, { useState, useEffect, useRef } from 'react'
import './CompareBox.scss'

import CompareMatchList from './CompareMatchList/CompareMatchList'
import CompareViewer1 from './CompareViewer1'
import CompareViewer2 from './CompareViewer2'

import { Button } from 'antd'

const CompareBox = _ => {
  const viewer1Ref = React.createRef()
  const viewer2Ref = React.createRef()
  const [showTab, setShowTab] = useState(false)
  const [sync, setSync] = useState(false)

  const viewer1ListClicked = (index, num) => {
    if (document.getElementById('syncBtn').classList.contains('activeSync')) {
      viewer2Ref.current.onCheckChange(index, num)
    }
  }

  const viewer1ImageChange = index => {
    console.log(viewer2Ref.current)
    if (document.getElementById('syncBtn').classList.contains('activeSync')) {
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
      <div className="header-box">
        <Button id="syncBtn" className={sync ? 'activeSync' : ''} onClick={e => setSync(!sync)}>
          {sync ? '取消同步' : '开启同步'}
        </Button>
      </div>
      <div className="compare-viewer-box">
        {showTab ? <CompareMatchList noduleList={[]} imagesConfig={[]} /> : null}
        <div className="box1">
          <CompareViewer1
            ref={viewer1Ref}
            viewer1ListClicked={viewer1ListClicked}
            viewer1ScrollBarClicked={viewer1ListClicked}
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
