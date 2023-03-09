import React, { useState, useEffect, useRef } from 'react'
import './CompareBox.scss'
import useWindowSize from '../../hook/useWindowSize'

import CompareMatchList from './CompareMatchList/CompareMatchList'
import CompareHeader from './CompareHeader/CompareHeader'
import CompareViewer1 from './CompareViewer1'
import CompareViewer2 from './CompareViewer2'

import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'

import CompareMiddleSidePanel from './CompareMiddleSidePanel/CompareMiddleSidePanel'
import CompareViewerMain from './CompareViewerMain/CompareViewerMain'
import CompareNoduleInfo from './CompareNoduleInfo/CompareNoduleInfo'

import MarkNoduleTool from '../../components/common/MarkNoduleTool/MarkNoduleTool'
import { getImageList, getDoctorTask } from '../../api/api'
import { getURLParameters } from '../../util/index'
import { windowChange, defaultTools, loadAndCacheImage } from './util'

import CornerstoneViewport from 'react-cornerstone-viewport'
import CustomOverlay from '../../components/common/CustomOverlay/CustomOverlay'

import { Button, Modal } from 'antd'

const CompareBox = props => {
  const size = useWindowSize()

  const nodeRef = useRef()

  const [cornerstoneElement, setCornerstoneElement] = useState(null)
  const [toolsConfig, setToolsConfig] = useState(defaultTools)
  const [imagesConfig, setImagesConfig] = useState([])
  const [noduleList, setNoduleList] = useState([])
  const [noduleMapList, setNoduleMapList] = useState([])
  const [noduleInfo, setNoduleInfo] = useState(null)

  const [sync, setSync] = useState(false)

  useEffect(() => {
    nodeRef.current = {
      noduleList,
      noduleMapList,
      imagesConfig,
      cornerstoneElement,
      sync,
    }
  }, [noduleList, noduleMapList, imagesConfig, cornerstoneElement, sync])

  // 初始化结节信息
  useEffect(() => {
    const fetchDoctorData = async () => {
      const result = await getDoctorTask(getURLParameters(window.location.href).doctorId)
      if (result.data.code === 200) {
        if (result.data.result) {
          if (result.data.result.doctorTask.resultInfo) {
            const data = JSON.parse(result.data.result.imageResult.replace(/'/g, '"'))
            const resultInfo = JSON.parse(result.data.result.doctorTask.resultInfo.replace(/'/g, '"'))
            formatNodeData(data, resultInfo.nodelist)
            fetcImagehData(data.detectionResult.nodulesList)
          } else {
            const data = JSON.parse(result.data.result.imageResult.replace(/'/g, '"'))
            formatNodeData(data, [])
            fetcImagehData(data.detectionResult.nodulesList)
          }
        }
      }
    }

    const fetcImagehData = async data => {
      const res = await getImageList(getURLParameters(window.location.href).resource)
      setImageList(res, data)
    }

    fetchDoctorData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 格式化结节数据
  const formatNodeData = (data, resultInfo) => {
    const nodulesList = []
    const nodulesMapList = []

    const nodulesList2 = []
    const nodulesMapList2 = []

    let index = 0
    if (data.code === 10000) {
      const res = data.detectionResult.nodulesList

      for (let i = 0; i < res.length; i++) {
        nodulesList.push({
          id: index,
          num: res[i].coord.coordZ,
          type: resultInfo[i] ? resultInfo[i].featureLabel : res[i].featureLabel.value,
          risk: (res[i].scrynMaligant * 100).toFixed(0),
          scrynMaligant:
            resultInfo[i] && resultInfo[i].scrynMaligant
              ? resultInfo[i].scrynMaligant
              : (res[i].scrynMaligant * 100).toFixed(0),
          soak: res[i].invisionClassify ? res[i].invisionClassify : '',
          newSoak:
            resultInfo[i] && resultInfo[i].newSoak
              ? resultInfo[i].newSoak
              : res[i].invisionClassify
              ? res[i].invisionClassify
              : '',
          info: '',
          checked: false,
          active: false,
          noduleName: res[i].noduleName,
          noduleNum: res[i].noduleNum,
          state:
            resultInfo[i] && Number(resultInfo[i].invisable) === 1
              ? false
              : resultInfo[i] && Number(resultInfo[i].invisable) === 0
              ? true
              : undefined,
          markNode:
            resultInfo[i] && resultInfo[i].markNode === true
              ? true
              : resultInfo[i] && resultInfo[i].markNode === false
              ? false
              : undefined,
          review: resultInfo[i] ? resultInfo[i].edit : false,
          chiefReview: resultInfo[i] && resultInfo[i].chiefReview ? resultInfo[i].chiefReview : false,
          lung: resultInfo[i] ? resultInfo[i].lungLocation : res[i].lobe.lungLocation,
          lobe: resultInfo[i] ? resultInfo[i].lobeLocation : res[i].lobe.lobeLocation,
          diameter: res[i].diameter,
          diameterSize: '',
          newDiameter: resultInfo[i] && resultInfo[i].newDiameter ? resultInfo[i].newDiameter : '',
          newNoduleSize: resultInfo[i] && resultInfo[i].newNoduleSize ? resultInfo[i].newNoduleSize : '',
          featureLabelG: res[i].featureLabelG,
          suggest: resultInfo[i] ? resultInfo[i].suggest : '',
        })
        nodulesList2.push({
          id: index,
          num: res[i].coord.coordZ,
          type: resultInfo[i] ? resultInfo[i].featureLabel : res[i].featureLabel.value,
          risk: (res[i].scrynMaligant * 100).toFixed(0),
          scrynMaligant:
            resultInfo[i] && resultInfo[i].scrynMaligant
              ? resultInfo[i].scrynMaligant
              : (res[i].scrynMaligant * 100).toFixed(0),
          soak: res[i].invisionClassify ? res[i].invisionClassify : '',
          newSoak:
            resultInfo[i] && resultInfo[i].newSoak
              ? resultInfo[i].newSoak
              : res[i].invisionClassify
              ? res[i].invisionClassify
              : '',
          info: '',
          checked: false,
          active: false,
          noduleName: res[i].noduleName,
          noduleNum: res[i].noduleNum,
          state:
            resultInfo[i] && Number(resultInfo[i].invisable) === 1
              ? false
              : resultInfo[i] && Number(resultInfo[i].invisable) === 0
              ? true
              : undefined,
          markNode:
            resultInfo[i] && resultInfo[i].markNode === true
              ? true
              : resultInfo[i] && resultInfo[i].markNode === false
              ? false
              : undefined,
          review: resultInfo[i] ? resultInfo[i].edit : false,
          chiefReview: resultInfo[i] && resultInfo[i].chiefReview ? resultInfo[i].chiefReview : false,
          lung: resultInfo[i] ? resultInfo[i].lungLocation : res[i].lobe.lungLocation,
          lobe: resultInfo[i] ? resultInfo[i].lobeLocation : res[i].lobe.lobeLocation,
          diameter: res[i].diameter,
          diameterSize: '',
          newDiameter: resultInfo[i] && resultInfo[i].newDiameter ? resultInfo[i].newDiameter : '',
          newNoduleSize: resultInfo[i] && resultInfo[i].newNoduleSize ? resultInfo[i].newNoduleSize : '',
          featureLabelG: res[i].featureLabelG,
          suggest: resultInfo[i] ? resultInfo[i].suggest : '',
        })
        index++
      }

      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].rois.length; j++) {
          const rois = res[i].rois[j]
          nodulesMapList.push({
            noduleName: res[i].noduleName,
            index: Number(rois.key),
            startX: rois.bbox[1],
            startY: rois.bbox[0],
            endX: rois.bbox[3],
            endY: rois.bbox[2],
          })
          nodulesMapList2.push({
            noduleName: res[i].noduleName,
            index: Number(rois.key),
            startX: rois.bbox[1],
            startY: rois.bbox[0],
            endX: rois.bbox[3],
            endY: rois.bbox[2],
          })
        }
      }

      setNoduleList([...nodulesList])
      setNoduleMapList([...nodulesMapList])

      setNoduleList2([...nodulesList2])
      setNoduleMapList2([...nodulesMapList2])
    } else {
      setNoduleList([])
      console.log(`数据加载失败`)
    }
  }

  // 添加结节标注
  const addNodeTool = (cornerstoneElement, index = 0, noduleList, noduleMapList) => {
    const checkItme = noduleList.find(item => item.checked === true)
    const item = noduleMapList.filter(item => item.index === index)

    if (item.length >= 1) {
      cornerstoneTools.clearToolState(cornerstoneElement, 'MarkNodule')
      if (checkItme) {
        const checkNode = item.filter(item => item.noduleName === checkItme.noduleName)
        for (let i = 0; i < item.length; i++) {
          const measurementData = {
            visible: true,
            active: true,
            color: item[i].noduleName === (checkNode[0] && checkNode[0].noduleName) ? undefined : 'white',
            invalidated: true,
            handles: {
              start: {
                x: item[i].nodeType === 1 ? item[i].startX : item[i].startX - 3,
                y: item[i].nodeType === 1 ? item[i].startY : item[i].startY - 3,
                highlight: true,
                active: true,
              },
              end: {
                x: item[i].nodeType === 1 ? item[i].endX : item[i].endX + 3,
                y: item[i].nodeType === 1 ? item[i].endY : item[i].endY + 3,
                highlight: true,
                active: true,
              },
            },
          }
          cornerstoneTools.addToolState(cornerstoneElement, 'MarkNodule', measurementData)
        }
      } else {
        for (let i = 0; i < item.length; i++) {
          const measurementData = {
            visible: true,
            active: true,
            color: 'white',
            invalidated: true,
            handles: {
              start: {
                x: item[i].nodeType === 1 ? item[i].startX : item[i].startX - 3,
                y: item[i].nodeType === 1 ? item[i].startY : item[i].startY - 3,
                highlight: true,
                active: true,
              },
              end: {
                x: item[i].nodeType === 1 ? item[i].endX : item[i].endX + 3,
                y: item[i].nodeType === 1 ? item[i].endY : item[i].endY + 3,
                highlight: true,
                active: true,
              },
            },
          }
          cornerstoneTools.addToolState(cornerstoneElement, 'MarkNodule', measurementData)
        }
      }
      cornerstone.updateImage(cornerstoneElement)
    } else {
      cornerstoneTools.clearToolState(cornerstoneElement, 'MarkNodule')
      cornerstone.updateImage(cornerstoneElement)
    }
  }

  // 设置图片列表
  const setImageList = (res, data) => {
    if (res.data.code === 200 && res.data.result.length > 0) {
      const newList = res.data.result
      const imageList = []
      const imageList2 = []
      newList.forEach(item => {
        imageList.push(`wadouri:${item.ossUrl.replace('http://', 'https://')}`)
        imageList2.push(`wadouri:${item.ossUrl.replace('http://', 'https://')}`)
      })

      setImagesConfig(imageList)
      setImagesConfig2(imageList2)

      // 缓存图片
      if (data && data.length > 0) {
        loadAndCacheImage(cornerstone, imageList, data)
      }
    }
  }

  // 切换当前视图
  const changeActiveImage = (index, cornerstoneElement, imagesConfig) => {
    cornerstone.loadImage(imagesConfig[index]).then(image => {
      cornerstone.displayImage(cornerstoneElement, image)
      cornerstoneTools.addStackStateManager(cornerstoneElement, ['stack'])
      cornerstoneTools.addToolState(cornerstoneElement, 'stack', {
        currentImageIdIndex: Number(index),
        imageIds: imagesConfig,
      })
    })
  }

  // ============================================================================

  // ============================================================================

  // ============================================================================

  // 右侧滚动条结节点击事件
  const handleScorllClicked = index => {
    // 设置列表选中状态
    noduleList.map(item => (item.checked = false))
    noduleList.find(item => item.num === index).checked = true
    setNoduleList([...noduleList])

    // 设置当前视图选中项
    if (cornerstoneElement) {
      changeActiveImage(index, cornerstoneElement)
    }

    // 同步操作
    // const listIndex = noduleList.findIndex(item => item.num === index)
    // props.viewer1ListClicked(listIndex, index)
  }

  // 列表单击
  const onCheckChange = (index, num) => {
    if (nodeRef.current.cornerstoneElement) {
      changeActiveImage(num, nodeRef.current.cornerstoneElement, nodeRef.current.imagesConfig)
    }
    noduleList.map(item => (item.checked = false))
    noduleList[index].checked = true
    setNoduleList([...noduleList])

    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme) {
      setNoduleInfo(checkItme)
    } else {
      setNoduleInfo(null)
    }

    // 同步操作
    if (nodeRef.current.sync) {
      onCheckChange2(index, num)
    }
  }

  // 监听视图变化事件
  const handleElementEnabledEvt = elementEnabledEvt => {
    const cornerstoneElement = document.querySelectorAll('.viewport-element')[0]
    setCornerstoneElement(cornerstoneElement)
    cornerstoneTools.addTool(MarkNoduleTool)

    let flag = true

    cornerstoneElement.addEventListener('cornerstonenewimage', newImage => {
      const curImageId = newImage.detail.image.imageId
      const index = imagesConfig.findIndex(item => item === curImageId)

      if (flag) {
        windowChange(cornerstoneElement, newImage.detail.image, 2)
        flag = false
      }

      cornerstoneTools.setToolActive('MarkNodule', { mouseButtonMask: 1 })
      setTimeout(() => {
        addNodeTool(cornerstoneElement, index, nodeRef.current.noduleList, nodeRef.current.noduleMapList)
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })
      }, 0)
    })

    cornerstoneElement.addEventListener('cornerstoneimagerendered', imageRenderedEvent => {
      const curImageId = imageRenderedEvent.detail.image.imageId
      const index = imagesConfig.findIndex(item => item === curImageId)

      // 同步
      if (nodeRef.current.sync && nodeRef2.current.cornerstoneElement2) {
        changeActiveImage(index, nodeRef2.current.cornerstoneElement2, nodeRef2.current.imagesConfig2)
      }
    })
  }

  // ============================================================================================

  // ============================================================================================

  // ============================================================================================

  // ============================================================================================

  // ============================================================================================

  const nodeRef2 = useRef()

  const [cornerstoneElement2, setCornerstoneElement2] = useState(null)
  const [imagesConfig2, setImagesConfig2] = useState([])
  const [noduleList2, setNoduleList2] = useState([])
  const [noduleMapList2, setNoduleMapList2] = useState([])
  const [noduleInfo2, setNoduleInfo2] = useState(null)

  useEffect(() => {
    nodeRef2.current = {
      noduleList2,
      noduleMapList2,
      imagesConfig2,
      cornerstoneElement2,
      sync,
    }
  }, [noduleList2, noduleMapList2, imagesConfig2, cornerstoneElement2, sync])

  // 右侧滚动条结节点击事件
  const handleScorllClicked2 = index => {
    // 设置列表选中状态
    noduleList2.map(item => (item.checked = false))
    noduleList2.find(item => item.num === index).checked = true
    setNoduleList2([...noduleList2])
    // 设置当前视图选中项
    if (cornerstoneElement2) {
      changeActiveImage(index, cornerstoneElement2)
    }
  }

  // 列表单击
  const onCheckChange2 = (index, num) => {
    if (nodeRef2.current.cornerstoneElement2) {
      changeActiveImage(num, nodeRef2.current.cornerstoneElement2, nodeRef2.current.imagesConfig2)
    }
    noduleList2.map(item => (item.checked = false))
    noduleList2[index].checked = true
    setNoduleList2([...noduleList2])

    const checkItme = noduleList2.find(item => item.checked === true)
    if (checkItme) {
      setNoduleInfo2(checkItme)
    } else {
      setNoduleInfo2(null)
    }
  }

  // 监听视图变化事件
  const handleElementEnabledEvt2 = elementEnabledEvt => {
    const cornerstoneElement2 = document.querySelectorAll('.viewport-element')[1]
    setCornerstoneElement2(cornerstoneElement2)
    cornerstoneTools.addTool(MarkNoduleTool)

    let flag = true

    cornerstoneElement2.addEventListener('cornerstonenewimage', newImage => {
      const curImageId = newImage.detail.image.imageId
      const index = imagesConfig.findIndex(item => item === curImageId)

      if (flag) {
        windowChange(cornerstoneElement2, newImage.detail.image, 2)
        flag = false
      }

      cornerstoneTools.setToolActive('MarkNodule', { mouseButtonMask: 1 })
      setTimeout(() => {
        addNodeTool(cornerstoneElement2, index, nodeRef2.current.noduleList2, nodeRef2.current.noduleMapList2)
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })
      }, 0)
    })
  }

  return (
    <>
      <div className="header-box">
        <Button onClick={e => setSync(!sync)}>{sync ? '取消同步' : '开启同步'}</Button>
      </div>
      <div className="compare-viewer-box">
        <div className="box1">
          {imagesConfig2.length !== 0 ? (
            <>
              <CompareMiddleSidePanel
                onCheckChange={onCheckChange}
                noduleList={noduleList}
                imagesConfig={imagesConfig}
              />
              <CornerstoneViewport
                viewportOverlayComponent={CustomOverlay}
                onElementEnabled={elementEnabledEvt => handleElementEnabledEvt(elementEnabledEvt)}
                tools={toolsConfig}
                imageIds={imagesConfig}
                style={{
                  height: `${(size.height - 50) / 2}px`,
                  flex: '1',
                  paddingRight: 15,
                }}
              />
              <CompareNoduleInfo noduleInfo={noduleInfo} />
            </>
          ) : null}
        </div>
        <div className="box2">
          {imagesConfig2.length !== 0 ? (
            <>
              <CompareMiddleSidePanel
                onCheckChange={onCheckChange2}
                noduleList={noduleList2}
                imagesConfig={imagesConfig2}
              />
              <CornerstoneViewport
                viewportOverlayComponent={CustomOverlay}
                onElementEnabled={elementEnabledEvt => handleElementEnabledEvt2(elementEnabledEvt)}
                tools={toolsConfig}
                imageIds={imagesConfig2}
                style={{
                  height: `${(size.height - 50) / 2}px`,
                  flex: '1',
                  paddingRight: 15,
                }}
              />
              <CompareNoduleInfo noduleInfo={noduleInfo2} />
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default CompareBox
