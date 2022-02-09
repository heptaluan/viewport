import React from 'react'
import CornerstoneViewport from 'react-cornerstone-viewport'
import './ViewerMain.scss'
import useWindowSize from '../../hook/useWindowSize'
import Toolbar from '../../components/Toolbar/Toolbar'
import CustomOverlay from '../common/CustomOverlay/CustomOverlay'
import { Button, Spin } from 'antd'

const ViewerMain = props => {
  const size = useWindowSize()
  return (
    <div className="viewer-main-box">
      {props.imagesConfig.length === 0 ? (
        <div className="error-tips">
          <Spin tip="Loading..." />
        </div>
      ) : (
        <div>
          <Toolbar handleToolbarClick={props.handleToolbarClick} />
          <CornerstoneViewport
            viewportOverlayComponent={CustomOverlay}
            onElementEnabled={elementEnabledEvt => props.handleElementEnabledEvt(elementEnabledEvt)}
            tools={props.toolsConfig}
            imageIds={props.imagesConfig}
            style={{ minWidth: '100%', height: `${size.height - 85}px`, flex: '1' }}
          />
          {props.noduleList.some(item => item.checked === true) ? (
            <div className="check-group">
              <div className="group-wrap">
                <span>是否为结节</span>
                <div className="group">
                  <Button onClick={e => props.updateNoduleList(false)}>否</Button>
                  <Button onClick={e => props.updateNoduleList(true)} type="primary">
                    是
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default ViewerMain
