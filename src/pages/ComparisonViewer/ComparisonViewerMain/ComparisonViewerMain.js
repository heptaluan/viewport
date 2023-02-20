import React from 'react'
import CornerstoneViewport from 'react-cornerstone-viewport'
import './ComparisonViewerMain.scss'
import useWindowSize from '../../../hook/useWindowSize'
import CustomOverlay from '../../../components/common/CustomOverlay/CustomOverlay'
import ScrollBar from '../../../components/ScrollBar/ScrollBar'
import { Spin } from 'antd'

const ComparisonViewerMain = props => {
  const size = useWindowSize()
  return (
    <div className="viewer-main-box">
      {props.imagesConfig.length === 0 ? (
        <div className="error-tips">
          <Spin tip="加载失败，请重新尝试" />
        </div>
      ) : (
        <div className='comparison-viewer-main'>
          <ScrollBar
            noduleList={props.noduleList}
            imageIds={props.imagesConfig}
            handleScorllClicked={props.handleScorllClicked}
          />
          {/* <Toolbar
            handleSliderChange={props.handleSliderChange}
            handleToolbarClick={props.handleToolbarClick}
            handleSubmitNodeDetail={props.handleSubmitNodeDetail}
            handleShowMarker={props.handleShowMarker}
            showMarker={props.showMarker}
          /> */}
          <CornerstoneViewport
            imageIdIndex={props.imageIdIndex}
            viewportOverlayComponent={CustomOverlay}
            onElementEnabled={elementEnabledEvt => props.handleElementEnabledEvt(elementEnabledEvt)}
            tools={props.toolsConfig}
            imageIds={props.imagesConfig}
            style={{
              height: `${(size.height - 50) / 2}px`,
              flex: '1',
              paddingRight: 15
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ComparisonViewerMain
