import React, { useState, useEffect, useRef } from 'react'
import './CompareViewer.scss'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'

import CompareHeader from './CompareHeader/CompareHeader'
import CompareMiddleSidePanel from './CompareMiddleSidePanel/CompareMiddleSidePanel'
import CompareViewerMain from './CompareViewerMain/CompareViewerMain'
import CompareNoduleInfo from './CompareNoduleInfo/CompareNoduleInfo'

import MarkNoduleTool from '../../components/common/MarkNoduleTool/MarkNoduleTool'
import MeasureRectTool from '../../components/common/MeasureRect/MeasureRect'
import { getImageList, getDoctorTask } from '../../api/api'
import { getURLParameters } from '../../util/index'
import { windowChange, defaultTools, loadAndCacheImage } from './util'

const CompareViewer = props => {
  // eslint-disable-next-line no-unused-vars
  const [toolsConfig, setToolsConfig] = useState(defaultTools)
  const [imagesConfig, setImagesConfig] = useState([])

  const [noduleList, setNoduleList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [noduleMapList, setNoduleMapList] = useState([])

  // 结节详情
  const [noduleInfo, setNoduleInfo] = useState(null)

  // 当前帧数
  const [currentImageIdIndex, setCurrentImageIdIndex] = useState(0)

  // 隐藏标注
  const [showMarker, setShowMarker] = useState(true)

  // 临时变量
  const nodeRef = useRef()

  // 视图元素
  const [cornerstoneElement, setCornerstoneElement] = useState(null)

  useEffect(() => {
    nodeRef.current = {
      noduleList,
      noduleMapList,
      showMarker,
    }
  }, [noduleList, noduleMapList, showMarker])

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
    let index = 0
    if (data.code === 10000) {
      const res = data.detectionResult.nodulesList

      // 初始化滑块的值
      if (resultInfo[0] && resultInfo[0].diameterMaxSize) {
        localStorage.setItem('diameterSize', resultInfo[0].diameterMaxSize)
      } else {
        localStorage.setItem('diameterSize', 3)
      }

      // const res = data.detectionResult.nodulesList.sort(nestedSort('coord', 'coordZ'))
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
        }
      }

      for (let i = 0; i < resultInfo.length; i++) {
        if (resultInfo[i].nodeType && resultInfo[i].nodeType === 1) {
          nodulesList.push({
            id: index,
            num: resultInfo[i].imageIndex,
            size: '',
            type: resultInfo[i].featureLabel,
            risk: resultInfo[i].risk,
            scrynMaligant: resultInfo[i].scrynMaligant,
            soak: '',
            info: '',
            checked: false,
            active: false,
            noduleName: resultInfo[i].noduleName,
            noduleNum: resultInfo[i].noduleNum,
            state: Number(resultInfo[i].invisable) === 1 ? false : Number(resultInfo[i].invisable) === 0 ? true : true,
            markNode: resultInfo[i].markNode === true ? true : resultInfo[i].markNode === false ? false : true,
            review: true,
            chiefReview: resultInfo[i].chiefReview ? resultInfo[i].chiefReview : false,
            lung: resultInfo[i].lungLocation,
            lobe: resultInfo[i].lobeLocation,
            featureLabelG: resultInfo[i].featureLabel,
            suggest: resultInfo[i].suggest,
            nodeType: resultInfo[i].nodeType,
            imageUrl1: resultInfo[i].imageUrl1,
            imageUrl2: resultInfo[i].imageUrl2,
            whu_scrynMaligant: resultInfo[i].whu_scrynMaligant,
            nodeBox: resultInfo[i].nodeBox,
            maxHu: resultInfo[i].maxHu,
            minHu: resultInfo[i].minHu,
            meanHu: resultInfo[i].meanHu,
            diameterNorm: resultInfo[i].diameterNorm,
            centerHu: resultInfo[i].centerHu,
            diameter: resultInfo[i].diameter,
            diameterSize: '',
            noduleSize: resultInfo[i].noduleSize,
            newDiameter: resultInfo[i].newDiameter,
            newNoduleSize: resultInfo[i].newNoduleSize,
          })

          index++

          nodulesMapList.push({
            noduleName: resultInfo[i].noduleName,
            nodeType: 1,
            index: resultInfo[i].imageIndex,
            startX: resultInfo[i].nodeBox[1],
            startY: resultInfo[i].nodeBox[0],
            endX: resultInfo[i].nodeBox[3],
            endY: resultInfo[i].nodeBox[2],
          })
        }
      }

      setNoduleList([...nodulesList])
      setNoduleMapList([...nodulesMapList])
    } else {
      setNoduleList([])
      console.log(`数据加载失败`)
    }
  }

  // 是否隐藏标注
  const handleShowMarker = e => {
    const flag = !showMarker
    setShowMarker(flag)

    if (flag) {
      setTimeout(() => {
        addNodeTool(cornerstoneElement, currentImageIdIndex)
      }, 200)
    } else {
      cornerstoneTools.clearToolState(cornerstoneElement, 'MarkNodule')
      cornerstone.updateImage(cornerstoneElement)
    }
  }

  // 添加结节标注
  const addNodeTool = (cornerstoneElement, index = 0) => {
    const item = nodeRef.current.noduleMapList.filter(item => item.index === index)
    const checkItme = nodeRef.current.noduleList.find(item => item.checked === true)

    if (nodeRef.current.showMarker === false) {
      cornerstoneTools.clearToolState(cornerstoneElement, 'MarkNodule')
      cornerstone.updateImage(cornerstoneElement)
    }

    if (item.length >= 1 && nodeRef.current.showMarker) {
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
      newList.forEach(item => {
        imageList.push(`wadouri:${item.ossUrl.replace('http://', 'https://')}`)
      })

      setImagesConfig(imageList)

      // loadAndCacheImage(cornerstone, imageList, data)

      // 缓存图片
      if (data && data.length > 0) {
        loadAndCacheImage(cornerstone, imageList, data)
      }
    }
  }

  // 右侧滚动条结节点击事件
  const handleScorllClicked = index => {
    // 设置列表选中状态
    noduleList.map(item => (item.checked = false))
    noduleList.find(item => item.num === index).checked = true
    setNoduleList([...noduleList])

    // 设置当中帧数
    setCurrentImageIdIndex(index)

    // 设置当前视图选中项
    if (cornerstoneElement) {
      changeActiveImage(index, cornerstoneElement)
    }
  }

  // 列表单击
  const onCheckChange = (index, num) => {
    handleCheckedListClick(num)
    noduleList.map(item => (item.checked = false))
    noduleList[index].checked = true
    setNoduleList([...noduleList])

    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme) {
      setNoduleInfo(checkItme)
    } else {
      setNoduleInfo(null)
    }
  }

  // 列表点击事件
  const handleCheckedListClick = index => {
    // 设置当中帧数
    setCurrentImageIdIndex(index)

    // 设置当前视图选中项
    if (cornerstoneElement) {
      changeActiveImage(index, cornerstoneElement)
    }
  }

  // 切换当前工具栏选中项
  const changeToolActive = (checked, type) => {
    if (checked) {
      cornerstoneTools.setToolActive(type, { mouseButtonMask: 1 })
    } else {
      cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })
    }
  }

  // 设定当前选中工具状态
  const setActiveToolState = () => {
    const activeTool = document.querySelector('.tool-bar-box .active')
    if (activeTool) {
      cornerstoneTools.setToolActive(activeTool.dataset.type, { mouseButtonMask: 1 })
    } else {
      cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })
    }
  }

  const handleToolbarClick = (type, checked) => {
    let viewport = cornerstone.getViewport(cornerstoneElement)
    switch (type) {
      case 'Magnify':
      case 'RectangleRoi':
      case 'Eraser':
      case 'EllipticalRoi':
      case 'Angle':
      case 'Length':
      case 'MarkNodule':
      case 'MeasureRect':
      case 'Zoom':
      case 'Pan':
        changeToolActive(checked, type)
        break
      case 'hflip':
        viewport.hflip = !viewport.hflip
        cornerstone.setViewport(cornerstoneElement, viewport)
        break
      case 'vflip':
        viewport.vflip = !viewport.vflip
        cornerstone.setViewport(cornerstoneElement, viewport)
        break
      case 'playClip':
        if (checked) {
          cornerstoneTools.playClip(cornerstoneElement, 10)
        } else {
          cornerstoneTools.stopClip(cornerstoneElement)
        }
        break
      case 'Reset':
        cornerstone.reset(cornerstoneElement)
        windowChange(cornerstoneElement, cornerstone.getImage(cornerstoneElement), 2)
        break
      default:
        break
    }
  }

  // 切换当前视图
  const changeActiveImage = (index, cornerstoneElement) => {
    cornerstone.loadImage(imagesConfig[index]).then(image => {
      cornerstone.displayImage(cornerstoneElement, image)
      cornerstoneTools.addStackStateManager(cornerstoneElement, ['stack'])
      cornerstoneTools.addToolState(cornerstoneElement, 'stack', {
        currentImageIdIndex: Number(index),
        imageIds: imagesConfig,
      })
    })
  }

  // 监听视图变化事件
  const handleElementEnabledEvt = elementEnabledEvt => {
    const cornerstoneElement = elementEnabledEvt.detail.element
    setCornerstoneElement(cornerstoneElement)
    cornerstoneTools.addTool(MarkNoduleTool)
    cornerstoneTools.addTool(MeasureRectTool)

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
        addNodeTool(cornerstoneElement, index)
        setActiveToolState()
      }, 0)
    })

    cornerstoneElement.addEventListener('cornerstoneimagerendered', imageRenderedEvent => {
      const curImageId = imageRenderedEvent.detail.image.imageId
      const index = imagesConfig.findIndex(item => item === curImageId)
      handleCheckedListClick(index)
    })
  }

  return (
    <>
      <CompareHeader />
      <div className="compare-viewer-box">
        <div className="box1">
          <CompareMiddleSidePanel onCheckChange={onCheckChange} noduleList={noduleList} imagesConfig={imagesConfig} />
          <CompareViewerMain
            handleToolbarClick={handleToolbarClick}
            handleElementEnabledEvt={handleElementEnabledEvt}
            handleShowMarker={handleShowMarker}
            handleScorllClicked={handleScorllClicked}
            toolsConfig={toolsConfig}
            imagesConfig={imagesConfig}
            noduleList={noduleList}
            showMarker={showMarker}
          />
          <CompareNoduleInfo noduleInfo={noduleInfo} />
        </div>
        <div className="box2">
          <CompareMiddleSidePanel onCheckChange={onCheckChange} noduleList={noduleList} imagesConfig={imagesConfig} />
          <CompareViewerMain
            handleToolbarClick={handleToolbarClick}
            handleElementEnabledEvt={handleElementEnabledEvt}
            handleShowMarker={handleShowMarker}
            handleScorllClicked={handleScorllClicked}
            toolsConfig={toolsConfig}
            imagesConfig={imagesConfig}
            noduleList={noduleList}
            showMarker={showMarker}
          />
          <CompareNoduleInfo noduleInfo={noduleInfo} />
        </div>
      </div>
    </>
  )
}

export default CompareViewer