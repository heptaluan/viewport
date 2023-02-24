import React from 'react'
import CornerstoneViewport from 'react-cornerstone-viewport'
import './ViewerMain.scss'
import useWindowSize from '../../hook/useWindowSize'
import Toolbar from '../../components/Toolbar/Toolbar'
import CustomOverlay from '../common/CustomOverlay/CustomOverlay'
import ScrollBar from '../ScrollBar/ScrollBar'
import { Spin } from 'antd'

const ViewerMain = props => {
  const size = useWindowSize()
  return (
    <div className="viewer-main-box">
      {props.imagesConfig.length === 0 ? (
        <div className="error-tips">
          <Spin tip="正在加载，请稍后……" />
        </div>
      ) : (
        <div>
          <ScrollBar
            noduleList={props.noduleList}
            imageIds={props.imagesConfig}
            handleScorllClicked={props.handleScorllClicked}
          />
          <Toolbar
            handleSliderChange={props.handleSliderChange}
            handleToolbarClick={props.handleToolbarClick}
            handleSubmitNodeDetail={props.handleSubmitNodeDetail}
            handleShowMarker={props.handleShowMarker}
            showMarker={props.showMarker}
          />
          <CornerstoneViewport
            imageIdIndex={props.imageIdIndex}
            viewportOverlayComponent={CustomOverlay}
            onElementEnabled={elementEnabledEvt => props.handleElementEnabledEvt(elementEnabledEvt)}
            tools={props.toolsConfig}
            imageIds={props.imagesConfig}
            style={{
              minWidth: '100%',
              height: `${size.height - 85}px`,
              flex: '1',
              paddingRight: 15
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ViewerMain
