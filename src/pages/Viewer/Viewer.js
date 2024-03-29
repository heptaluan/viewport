import React, { useState, useEffect, useRef } from 'react'
import './Viewer.scss'
import Header from '../../components/Header/Header'
// import LeftSidePanel from '../../components/LeftSidePanel/LeftSidePanel'
import ViewerMain from '../../components/ViewerMain/ViewerMain'
import MiddleSidePanel from '../../components/MiddleSidePanel/MiddleSidePanel'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import NoduleInfo from '../../components/common/NoduleInfo/NoduleInfo'
import MarkNoduleTool from '../../components/common/MarkNoduleTool/MarkNoduleTool'
import MeasureRectTool from '../../components/common/MeasureRect/MeasureRect'
import MarkDialog from '../../components/common/MarkDialog/MarkDialog'
import {
  getNodeList,
  getImageList,
  addNewResult,
  getSecondprimaryDetail,
  addSecondprimaryResult,
  saveSecondprimaryResult,
} from '../../api/api'
import { Modal, message, Button, InputNumber } from 'antd'
import Draggable from 'react-draggable'
import AddNewNode from '../../components/common/AddNewNode/AddNewNode'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import { useHistory } from 'react-router-dom'

const { confirm } = Modal

const Viewer = () => {
  const history = useHistory()

  const defaultTools = [
    {
      name: 'Wwwc',
      mode: 'active',
      modeOptions: { mouseButtonMask: 2 },
    },
    { name: 'StackScrollMouseWheel', mode: 'active' },
    {
      name: 'RectangleRoi',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Eraser',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Magnify',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'EllipticalRoi',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Angle',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Length',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Pan',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Zoom',
      modeOptions: { mouseButtonMask: 1 },
      configuration: {
        invert: false,
        preventZoomOutsideImage: false,
        minScale: 0.1,
        maxScale: 20.0,
      },
    },
  ]

  // 初始化
  // eslint-disable-next-line no-unused-vars
  const [toolsConfig, setToolsConfig] = useState(defaultTools)
  const [imagesConfig, setImagesConfig] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [taskLength, setTaskLength] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [sequenceListData, setLeftSidePanelData] = useState([])
  const [noduleList, setNoduleList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [patients, setPatients] = useState([])
  const [noduleMapList, setNoduleMapList] = useState([])

  // 结节详情
  const [noduleInfo, setNoduleInfo] = useState(null)

  // 跳转帧数
  const [imageIdIndex, setImageIdIndex] = useState(0)

  // 当前帧数
  const [currentImageIdIndex, setCurrentImageIdIndex] = useState(0)

  // 当前 Dicom 文件
  const [currentDicomFileUrl, setCurrentDicomFileUrl] = useState('')

  // 隐藏标注
  const [showMarker, setShowMarker] = useState(true)

  // 临时变量
  const nodeRef = useRef()

  useEffect(() => {
    nodeRef.current = {
      noduleList,
      noduleMapList,
      showMarker,
    }
  }, [noduleList, noduleMapList, showMarker])

  // 获取路由参数
  const params = qs.parse(useLocation().search)

  // 角色
  const [userInfo, setUserInfo] = useState('')

  // 初始化结节与影像列表信息
  useEffect(() => {
    const fetchNodeListData = async () => {
      const result = await getNodeList(params.orderId)
      if (result.data.code === 200) {
        try {
          const data = JSON.parse(result.data.data.replace(/'/g, '"'))
          formatNodeData(data, [])
        } catch (error) {
          console.log(error)
        }
      } else if (result.data.code === 401) {
        message.warning(`登录已失效，请重新登录`)
        history.push('/login')
      }
    }

    const fetcImagehData = async _ => {
      const res = await getImageList(params.dicomId)
      if (res.data.code === 200 && res.data.data.length > 0) {
        const newList = res.data.data
        const imageList = []
        newList.forEach(item => {
          imageList.push(`wadouri:${item.replace('http://', 'https://')}`)
        })
        setImagesConfig(imageList)
      }
    }

    const fetchSecondprimaryDetail = async () => {
      const result = await getSecondprimaryDetail(params.id)
      if (result.data.code === 200) {
        formatSecondprimaryNodeData(result.data.data)
      } else if (result.data.code === 401) {
        message.warning(`登录已失效，请重新登录`)
        history.push('/login')
      }
    }

    // 保存用户角色
    const info = localStorage.getItem('info')
    setUserInfo(info)

    // 根据角色请求不同的数据
    if (params.type === 'mission') {
      fetchSecondprimaryDetail()
    } else {
      if (info === 'chief') {
        fetchNodeListData()
        fetcImagehData()
      } else if (info === 'doctor') {
        fetchSecondprimaryDetail()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 初始化病人信息
  useEffect(() => {
    // const fetchData = async () => {
    // const result = await getPatientsList(params.dicomId)
    // if (result.data.code === 200 && result.data.result) {
    //   setPatients(result.data.result.records[0])
    //   localStorage.setItem('patients', JSON.stringify(result.data.result.records[0]))
    // } else {
    localStorage.setItem('patients', '')
    // }
    // }
    // fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 多选
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(true)

  // 视图元素
  const [cornerstoneElement, setCornerstoneElement] = useState(null)

  // 弹出层
  const [showPopover, setShowPopover] = useState({
    index: 0,
    visible: false,
  })

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

  // ===========================================================

  // 格式化结节数据
  const formatNodeData = (data, resultInfo) => {
    const nodulesList = []
    const nodulesMapList = []
    let index = 0
    if (data.code === 10000) {
      const res = data.detectionResult.nodulesList

      // 初始化滑块的值
      // if (resultInfo[0] && resultInfo[0].diameterMaxSize) {
      //   localStorage.setItem('diameterSize', resultInfo[0].diameterMaxSize)
      // } else {
      //   localStorage.setItem('diameterSize', 3)
      // }

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
          review: resultInfo[i] ? resultInfo[i].edit : false,
          chiefReview: resultInfo[i] && resultInfo[i].chiefReview ? resultInfo[i].chiefReview : false,
          lung: resultInfo[i] ? resultInfo[i].lungLocation : res[i].lobe.lungLocation,
          lobe: resultInfo[i] ? resultInfo[i].lobeLocation : res[i].lobe.lobeLocation,
          diameter: res[i].diameter,
          diameterSize:
            resultInfo[i] && resultInfo[i].newDiameter
              ? formatDiameter(resultInfo[i].newDiameter)
              : formatDiameter(res[i].diameter),
          noduleSize: res[i].noduleSize,
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

      console.log(nodulesList)
      console.log(nodulesMapList)

      setNoduleList([...nodulesList])
      setNoduleMapList([...nodulesMapList])
    } else {
      setNoduleList([])
      console.log(`数据加载失败`)
    }
  }

  // 格式化二次筛选结节数据
  const formatSecondprimaryNodeData = data => {
    const nodulesList = []
    const nodulesMapList = []
    let index = 0

    // 格式化结节信息
    for (let i = 0; i < data.nodeInfo.length; i++) {
      const res = data.nodeInfo[i]
      const resultInfo = data.resultInfo[i]
      nodulesList.push({
        id: index,
        num: Number(res.coordz),
        error: res.error,
        error_mark: res.error_mark,
        checked: false,
        state: resultInfo.isFinish === 0 ? undefined : resultInfo.isBenign === 1 ? true : false,
        review: resultInfo.isFinish === 1 ? true : false,
        type: resultInfo.featuresType ? resultInfo.featuresType : res.featuresType,
        kyTaskId: resultInfo.id,
        noduleName: `nodule_${res.id}`,
        remark: resultInfo.remark ? resultInfo.remark : undefined,
      })

      const acrossCoordz = res.acrossCoordz.split(',')
      const box = res.box.split(',')
      for (let j = 0; j < acrossCoordz.length; j++) {
        nodulesMapList.push({
          noduleName: `nodule_${res.id}`,
          index: Number(acrossCoordz[j]),
          startX: Number(box[1].trim()),
          startY: Number(box[0].trim()),
          endX: Number(box[3].trim()),
          endY: Number(box[2].trim()),
        })
      }

      index++
    }

    // 格式化影像信息
    const newList = data.imageList
    const imageList = []
    newList.forEach(item => {
      imageList.push(`wadouri:${item.replace('http://', 'https://')}`)
    })

    console.log(nodulesList)
    console.log(nodulesMapList)

    setNoduleList([...nodulesList])
    setNoduleMapList([...nodulesMapList])
    setImagesConfig(imageList)
  }

  // ===========================================================

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

  // ===========================================================

  // 单选
  const onCheckChange = (index, num) => {
    handleCheckedListClick(num)
    noduleList.map(item => (item.checked = false))
    noduleList[index].checked = true
    setNoduleList([...noduleList])
    if (noduleList.every(item => item.checked === true)) {
      setIndeterminate(false)
      setCheckAll(true)
    } else {
      setIndeterminate(true)
      setCheckAll(false)
    }

    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme) {
      setNoduleInfo(checkItme)
    } else {
      setNoduleInfo(null)
    }
  }

  // 全选
  const onCheckAllChange = e => {
    setCheckAll(e.target.checked)
    if (e.target.checked) {
      noduleList.map(item => (item.checked = true))
      setNoduleList([...noduleList])
    } else {
      noduleList.map(item => (item.checked = false))
      setNoduleList([...noduleList])
    }
  }

  // 弹出层按钮事件
  const handleHideNodule = (e, id) => {
    // noduleList.splice(
    //   noduleList.findIndex(item => item.id === id),
    //   1
    // )
    // setNoduleList([...noduleList])
    // setShowPopover({
    //   visible: false,
    //   index: 0,
    // })
  }

  // 列表点击事件
  const handleCheckedListClick = index => {
    // const item = noduleList.find(item => Number(item.num) === index + 1)
    // if (item) {
    //   noduleList.map(item => (item.active = false))
    //   item.active = true
    //   setNoduleList([...noduleList])
    //   setTimeout(() => {
    //     const viewerItemActive = document.querySelector('#viewerItemBox .item-active')
    //     viewerItemActive && viewerItemActive.scrollIntoView()
    //   }, 0)
    // }

    // noduleList.map(item => (item.checked = false))
    // noduleList[index].checked = true
    // setNoduleList([...noduleList])

    // 设置当中帧数
    setCurrentImageIdIndex(index)

    // 设置当前视图选中项
    if (cornerstoneElement) {
      changeActiveImage(index, cornerstoneElement)
    }
  }

  const updateChiefNoduleList = checkState => {
    const checkItme = noduleList.find(item => item.checked === true)
    checkItme.chiefReview = checkState
    setNoduleList([...noduleList])

    // 提交结节数据
    saveResults()
  }

  // 更新列表结节状态
  const updateNoduleList = checkState => {
    const checkItme = noduleList.find(item => item.checked === true)
    checkItme.review = true
    checkItme.state = checkState
    setNoduleList([...noduleList])
    if (params.type === 'mission') {
      saveSecondprimaryResults(checkItme)
    } else {
      if (userInfo === 'doctor') {
        saveSecondprimaryResults(checkItme)
      }
    }
  }

  // 更新结节事件
  const checkNoduleList = (val, type) => {
    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme && type === 'lung') {
      checkItme.lung = val
      checkItme.review = true
    }

    if (checkItme && type === 'lobe') {
      checkItme.lobe = val
      checkItme.review = true
    }

    if (checkItme && type === 'type') {
      checkItme.type = val
      // checkItme.review = true
    }

    if (checkItme && type === 'soak') {
      checkItme.newSoak = val
      checkItme.review = true
    }

    if (checkItme && type === 'position') {
      checkItme.remark = val
      checkItme.review = true
    }

    setNoduleList([...noduleList])

    if (params.type === 'mission') {
      saveSecondprimaryResults(checkItme)
    } else {
      if (userInfo === 'doctor') {
        saveSecondprimaryResults(checkItme)
      }
    }
  }

  // 更新医生影像建议内容
  const handleTextareaOnChange = e => {
    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme) {
      checkItme.suggest = e.target.value
      checkItme.review = true
      setNoduleList([...noduleList])
    }
  }

  // 备注框失去焦点后保存数据
  const handleInputBlur = e => {
    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme) {
      checkItme.suggest = e.target.value
      checkItme.review = true
      setNoduleList([...noduleList])
    }
    // 提交结节数据
    saveResults()
  }

  // 更新恶性风险
  const handleUpdateRisk = (val, type) => {
    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme) {
      checkItme.scrynMaligant = val
      checkItme.review = true
      setNoduleList([...noduleList])
    }
    // 提交结节数据
    if (type !== 'inputChange') {
      saveResults()
    }
  }

  // 列表右侧操作菜单
  const handleVisibleChange = (visible, index) => {
    if (visible) {
      setShowPopover({
        visible: visible,
        index: index,
      })
    } else {
      setShowPopover({
        visible: visible,
        index: 0,
      })
    }
  }

  // ===========================================================

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

  // 工具回调
  const [showMark, setShowMark] = useState(false)
  const showMarkDialog = (e, cornerstoneElement) => {
    const tool = cornerstoneTools.getToolState(cornerstoneElement, 'MarkNodule')
    let mark = document.getElementById('mark')
    if (tool && mark && mark.classList.contains('active')) {
      setShowMark(true)
    }
  }

  // 工具操作函数
  const handleCloseCallback = () => {
    const tool = cornerstoneTools.getToolState(cornerstoneElement, 'MarkNodule')
    const toolData = tool.data.pop()
    cornerstoneTools.removeToolState(cornerstoneElement, 'MarkNodule', toolData)
    cornerstone.updateImage(cornerstoneElement)
    setShowMark(false)
  }

  const handleSubmitCallback = value => {
    const tool = cornerstoneTools.getToolState(cornerstoneElement, 'MarkNodule')

    if (tool) {
      const toolData = tool.data.pop()
      const measurementData = {
        visible: true,
        active: false,
        color: undefined,
        invalidated: true,
        handles: {
          start: {
            x: toolData.handles.start.x,
            y: toolData.handles.start.y,
            highlight: true,
            active: false,
          },
          end: {
            x: toolData.handles.end.x,
            y: toolData.handles.end.y,
            highlight: true,
            active: true,
          },
        },
      }
      cornerstoneTools.clearToolState(cornerstoneElement, 'MarkNodule')
      cornerstoneTools.addToolState(cornerstoneElement, 'MarkNodule', measurementData)
      cornerstone.updateImage(cornerstoneElement)
      setShowMark(false)
    }
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
      setCurrentDicomFileUrl(curImageId)
      handleCheckedListClick(index)
    })

    cornerstoneElement.addEventListener('cornerstonetoolsmouseup', e => {
      if (localStorage.getItem('active') === 'true') {
        showMarkDialog(e, cornerstoneElement)
      }
    })
  }

  // 调整窗宽窗位
  const windowChange = (element, image, index) => {
    /*
     * index = 1，ww: default, wl: default
     * index = 2，ww: 1500, wl: -450
     * index = 3，ww: 250, wl: 30
     * index = 4，ww: 1000, wl: 250
     * index = 5，ww: 300, wl: 40
     */
    const viewportDefault = cornerstone.getDefaultViewportForImage(element, image)
    const viewport = cornerstone.getViewport(element)
    viewport.voiLUT = undefined

    if (index === 1) {
      viewport.voi.windowWidth = viewportDefault.voi.windowWidth
      viewport.voi.windowCenter = viewportDefault.voi.windowCenter
    } else if (index === 2) {
      viewport.voi.windowWidth = 1500
      viewport.voi.windowCenter = -400
    } else if (index === 3) {
      viewport.voi.windowWidth = 250
      viewport.voi.windowCenter = 30
    } else if (index === 4) {
      viewport.voi.windowWidth = 1000
      viewport.voi.windowCenter = 250
    } else if (index === 5) {
      viewport.voi.windowWidth = 300
      viewport.voi.windowCenter = 40
    }

    cornerstone.setViewport(element, viewport)
  }

  // ===========================================================

  // 格式化中心直径
  const formatDiameter = diameter => {
    if (diameter) {
      return Math.max(...diameter.replace('*', '').split('mm'))
    } else {
      return ''
    }
  }

  // 保存之前滑块的值
  // const [preVal, setPreVal] = useState(localStorage.getItem('diameterSize'))

  // 根据滑块调整列表的检阅状态
  const handleSliderChange = (val, type) => {
    // for (let i = 0; i < noduleList.length; i++) {
    //   if (noduleList[i].diameterSize <= val) {
    //     noduleList[i].review = true
    //     noduleList[i].chiefReview = true
    //     noduleList[i].state = true
    //   }

    //   if (noduleList[i].diameterSize >= val && noduleList[i].diameterSize < preVal) {
    //     noduleList[i].review = false
    //     noduleList[i].chiefReview = false
    //     noduleList[i].state = undefined
    //   }
    // }
    setNoduleList([...noduleList])
    // if (preVal !== val) {
    //   setPreVal(val)
    // }
    if (type !== 'init') {
      saveResults()
    }
  }

  // 缓存图片请求池
  const loadAndCacheImage = (cornerstone, imageList, data) => {
    try {
      const coordZList = []
      for (let i = 0; i < data.length; i++) {
        coordZList.push(data[i].coord.coordZ)
      }

      let filterArr = []
      for (let i = 0; i < coordZList.length; i++) {
        var pre = coordZList[i] - 5 > 0 ? coordZList[i] - 5 : 0
        for (let j = 0; j < 10; j++) {
          filterArr.push(pre + j)
        }
      }

      filterArr = [...new Set(filterArr)]
      const newImageList = []
      for (let i = 0; i < filterArr.length; i++) {
        newImageList.push(imageList[filterArr[i]])
      }

      for (let i = 0; i < newImageList.length; i++) {
        cornerstone.loadAndCacheImage(newImageList[i])
      }
    } catch (error) {
      console.log(error)
    }
    // for (let i = 0; i < imageList.length; i++) {
    //   cornerstone.loadAndCacheImage(imageList[i])
    // }
  }

  // ===========================================================

  const [showState, setShowState] = useState(false)

  // 隐藏和显示结节列表
  const showNoduleList = () => {
    console.log(showState)
    setShowState(!showState)
  }

  // ===========================================================

  const [visible, setVisible] = useState(false)

  const hideModal = () => {
    setVisible(false)
  }

  // 获取结节坐标
  const getBox = list => {
    let box = ''
    const item = noduleMapList.filter(item => item.index === list.num)[0]
    if (item.startX > item.endX) {
      box = `${item.endY}, ${item.endX}, ${item.startY}, ${item.startX}`
    } else {
      box = `${item.startY}, ${item.startX}, ${item.endY}, ${item.endX}`
    }
    return box
  }

  // 获取穿梭帧
  const getAcrossCoordz = list => {
    const item = noduleMapList.filter(item => item.noduleName === list.noduleName)
    const crossCoordz = []
    item.map(n => crossCoordz.push(n.index))
    return crossCoordz.join(',')
  }

  // 暂存结节数据
  const saveResults = callback => {
    // const postData = formatPostData()
    // saveDnResult(JSON.stringify(postData)).then(res => {
    //   if (res.data.code === 200) {
    //     message.success(`结节信息保存成功`)
    //     callback && callback()
    //   } else {
    //     message.error(`结节结果保存失败，请检查网络或是重新登录后再行尝试`)
    //   }
    // })
  }

  // 暂存二筛数据
  const saveSecondprimaryResults = async checkItme => {
    const postData = {
      id: checkItme.kyTaskId,
      featuresType: checkItme.type,
      isBenign: checkItme.state ? 1 : 0,
      remark: checkItme.remark
    }
    const result = await saveSecondprimaryResult(postData)
    if (result.data.code === 200) {
      message.success(`结节信息暂存成功`)
    } else if (result.data.code === 401) {
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    } else {
      message.error(`结节信息暂存失败，请检查网络后重新尝试`)
    }
  }

  // 格式化提交数据
  const formatPostData = () => {
    const patients = JSON.parse(localStorage.getItem('record'))
    const postData = {
      ...patients,
      imageCount: imagesConfig.length,
      nodeText: [],
    }

    for (let i = 0; i < noduleList.length; i++) {
      if (noduleList[i].state) {
        postData.nodeText.push({
          index: noduleList[i].id + 1,
          imageIndex: noduleList[i].num,
          featureLabel: noduleList[i].type,
          box: getBox(noduleList[i]),
          acrossCoordz: getAcrossCoordz(noduleList[i]),
        })
      }
    }

    console.log(postData.nodeText)

    postData.nodeText = JSON.stringify(postData.nodeText)

    return postData
  }

  // 提交审核结果按钮
  const handleShowModal = () => {
    // formatPostData()
    console.log(noduleList)
    if (params.type === 'mission') {
      setVisible(true)
    } else {
      if (noduleList.every(item => item.review === true)) {
        setVisible(true)
      } else {
        message.warning(`请检阅完所有结节后在进行结果提交`)
      }
    }
  }

  // 提交审核结果弹窗
  const handleSubmitResults = async () => {
    if (params.type === 'mission') {
      const result = await addSecondprimaryResult(params.id)
      // saveResults
      if (result.data.code === 200) {
        message.success(`提交审核结果成功`)
        setVisible(false)
        history.push('/missionList')
      } else if (result.data.code === 401) {
        message.warning(`登录已失效，请重新登录`)
        history.push('/login')
      } else {
        message.error(`提交失败，请稍后重新尝试`)
      }
    } else {
      if (userInfo === 'chief') {
        const postData = formatPostData()
        const result = await addNewResult(JSON.stringify(postData))
        if (result.data.code === 200) {
          message.success(`提交审核结果成功`)
          setVisible(false)
          history.push('/studyList')
        } else if (result.data.code === 401) {
          message.warning(`登录已失效，请重新登录`)
          history.push('/login')
        } else {
          message.error(`提交失败，请稍后重新尝试`)
        }
      } else {
        const result = await addSecondprimaryResult(params.id)
        // saveResults
        if (result.data.code === 200) {
          message.success(`提交审核结果成功`)
          setVisible(false)
          history.push('/studyList')
        } else if (result.data.code === 401) {
          message.warning(`登录已失效，请重新登录`)
          history.push('/login')
        } else {
          message.error(`提交失败，请稍后重新尝试`)
        }
      }
    }
  }

  // ===========================================================

  const draggleRef = React.createRef()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalDisabled, setModalDisabled] = useState(true)
  const [modalBounds, setModalBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const [toolList, setToolList] = useState([])
  const [adjustModalVisible, setAdjustModalVisible] = useState(false)

  const [confirmLoading, setConfirmLoading] = useState(false)

  // 提交结节信息
  const handleSubmitNodeDetail = e => {
    const tool = cornerstoneTools.getToolState(cornerstoneElement, 'RectangleRoi')
    if (!tool || tool.data.length === 0) {
      message.warn(`请进行结节标注后在进行新增`)
      return false
    }

    if (tool.data.length > 1) {
      message.warn(`暂时只支持单个结节的新增，请删减后在进行新增`)
      return false
    }

    formatNewNodeData(tool.data)
    setTimeout(() => {
      showModal()
    }, 0)
  }

  // 重新请求，刷新数据
  const fetchDoctorData = async callback => {
    const result = await getNodeList(params.orderId)
    if (result.data.code === 200) {
      if (result.data.result) {
        if (result.data.result.doctorTask.resultInfo) {
          const data = JSON.parse(result.data.result.imageResult.replace(/'/g, '"'))
          const resultInfo = JSON.parse(result.data.result.doctorTask.resultInfo.replace(/'/g, '"'))
          formatNodeData(data, resultInfo.nodelist)
          callback && callback()
        } else {
          const data = JSON.parse(result.data.result.imageResult.replace(/'/g, '"'))
          formatNodeData(data, [])
          callback && callback()
        }
      }
    } else {
      message.error(`请求数据失败，请检查网络后重新尝试`)
    }
  }

  // 格式化新增结节数据
  const formatNewNodeData = data => {
    const toolList = []
    for (let i = 0; i < data.length; i++) {
      toolList.push({
        uuid: data[i].uuid,
        lung: '',
        lobe: '',
        type: undefined,
        suggest: '',
        cachedStats: data[i].cachedStats,
        startX: data[i].handles.start.x,
        startY: data[i].handles.start.y,
        endX: data[i].handles.end.x,
        endY: data[i].handles.end.y,
      })
    }
    setToolList(toolList)
  }

  // 更新结节事件
  const updateToolList = (val, type, id) => {
    const checkItme = toolList.find(item => item.uuid === id)
    if (checkItme && type === 'lung') {
      checkItme.lung = val
    }
    if (checkItme && type === 'lobe') {
      checkItme.lobe = val
    }
    if (checkItme && type === 'type') {
      checkItme.type = val
    }
    setToolList([...toolList])
  }

  // 更新医生影像建议内容
  const handleToolListTextareaChange = (e, id) => {
    const checkItme = toolList.find(item => item.uuid === id)
    if (checkItme) {
      checkItme.suggest = e.target.value
      setToolList([...toolList])
    }
  }

  // 建议框失去焦点后保存数据
  const handleToolListTextareaBlur = (e, id) => {
    const checkItme = toolList.find(item => item.uuid === id)
    if (checkItme) {
      checkItme.suggest = e.target.value
      setToolList([...toolList])
    }
  }

  const showModal = () => {
    setModalVisible(true)
  }

  const handleCancel = e => {
    setModalVisible(false)
  }

  // 新增结节
  const [showRisk, setShowRisk] = useState(false)
  const [riskVal, setRiskVal] = useState(0)
  const [postData, setPostData] = useState(null)
  const [res, setRes] = useState(null)

  const handleRiskOk = () => {
    setConfirmLoading(false)

    const startX = postData.boxes.split(',')[1]
    const startY = postData.boxes.split(',')[0]
    const endX = postData.boxes.split(',')[3]
    const endY = postData.boxes.split(',')[2]
    const rowPixelSpacing = cornerstone.getImage(cornerstoneElement).rowPixelSpacing

    const newNodeData = {
      active: false,
      checked: false,
      featureLabelG: '',
      id: `id_${toolList[0].uuid}`,
      info: '',
      lobe: toolList[0].lobe,
      lung: toolList[0].lung,
      noduleName: `nodule_${toolList[0].uuid}`,
      noduleNum: toolList[0].uuid,
      num: currentImageIdIndex,
      review: false,
      chiefReview: false,
      size: '',
      soak: '',
      state: true,
      suggest: toolList[0].suggest,
      type: toolList[0].type,
      nodeType: 1,
      imageUrl1: res.data.imageUrl1,
      imageUrl2: res.data.imageUrl2,
      risk: res.data.scrynMaligant,
      scrynMaligant: riskVal ? riskVal : res.data.scrynMaligant,
      whu_scrynMaligant: riskVal ? riskVal : res.data.whu_scrynMaligant,
      nodeBox: [startY, startX, endY, endX],
      diameter: `${(Math.abs(endX - startX) * rowPixelSpacing).toFixed(2)}mm*${(
        Math.abs(endY - startY) * rowPixelSpacing
      ).toFixed(2)}mm`,
      diameterSize: formatDiameter(
        `${(Math.abs(endX - startX) * rowPixelSpacing).toFixed(2)}mm*${(
          Math.abs(endY - startY) * rowPixelSpacing
        ).toFixed(2)}mm`
      ),
      maxHu: toolList[0].cachedStats.max,
      minHu: toolList[0].cachedStats.min,
      meanHu: toolList[0].cachedStats.mean.toFixed(2),
      diameterNorm: Math.sqrt(toolList[0].cachedStats.area).toFixed(2),
      noduleSize: (Math.pow(Math.sqrt(toolList[0].cachedStats.area) / 2, 3) * Math.PI).toFixed(2),
      centerHu: cornerstone.getPixels(
        cornerstoneElement,
        (Number(startX) + Number(endX)) / 2,
        (Number(startY) + Number(endY)) / 2,
        1,
        1
      )[0],
    }

    noduleList.push(newNodeData)
    setNoduleList([...noduleList])

    saveResults(callback => {
      fetchDoctorData(callback => {
        updateCanvasAndList()
      })
    })

    setShowRisk(false)
  }

  const handleOk = e => {
    for (let i = 0; i < toolList.length; i++) {
      if (!toolList[i].lung) {
        message.warn(`请选择结节的肺属性后在进行新增`)
        return false
      }

      if (!toolList[i].lobe) {
        message.warn(`请选择结节的肺叶属性后在进行新增`)
        return false
      }

      if (!toolList[i].type) {
        message.warn(`请选择结节的类型属性后在进行新增`)
        return false
      }

      if (toolList[i].lung === '左肺' && toolList[i].lobe === '中叶') {
        message.warn(`请选择结节的肺叶属性后在进行新增`)
        return false
      }
    }

    const postData = {
      dicom_url: currentDicomFileUrl.replace('wadouri:', '').replace('https://', 'http://'),
      boxes: [],
    }

    if (toolList[0].startX > toolList[0].endX) {
      postData.boxes = [
        parseInt(toolList[0].endY),
        parseInt(toolList[0].endX),
        parseInt(toolList[0].startY),
        parseInt(toolList[0].startX),
      ].join(',')
    } else {
      postData.boxes = [
        parseInt(toolList[0].startY),
        parseInt(toolList[0].startX),
        parseInt(toolList[0].endY),
        parseInt(toolList[0].endX),
      ].join(',')
    }

    setPostData(postData)

    // startX: rois.bbox[1],
    // startY: rois.bbox[0],
    // endX: rois.bbox[3],
    // endY: rois.bbox[2],

    const hide = message.loading('新增结节中，请稍等..', 0)
    setConfirmLoading(true)

    // addNewNodeList(JSON.stringify(postData)).then(res => {
    //   if (res.data.code === 1) {
    //     setTimeout(hide)
    //     setRiskVal(res.data.scrynMaligant)
    //     setRes(res)
    //     setShowRisk(true)
    //   } else {
    //     message.error(`新增失败，请重新尝试`)
    //     setTimeout(hide)
    //     setConfirmLoading(true)
    //     return false
    //   }
    // })
  }

  // 删除结节
  const showDeleteConfirm = item => {
    confirm({
      title: `是否删除该中心帧为 ${imagesConfig.length - Number(item.num)} 的结节？`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          肺：{item.lung} <br />
          肺叶：{item.lobe} <br />
          类型：{item.type} <br />
        </div>
      ),
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const itemIndex = noduleList.findIndex(n => n.noduleNum === item.noduleNum)
        noduleList.splice(itemIndex, 1)
        setNoduleList([...noduleList])
        setNoduleInfo(null)

        saveResults(callback => {
          fetchDoctorData(callback => {
            updateCanvasAndList()
          })
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  // 更新画布与结节列表
  const updateCanvasAndList = () => {
    const index = currentImageIdIndex
    setNoduleInfo(null)
    cornerstoneTools.clearToolState(cornerstoneElement, 'RectangleRoi')
    cornerstoneTools.clearToolState(cornerstoneElement, 'MarkNodule')
    cornerstone.updateImage(cornerstoneElement)
    addNodeTool(cornerstoneElement, index)
    setModalVisible(false)
  }

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setModalBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    })
  }

  // 调整结节大小
  const handleShowAdjustModal = () => {
    const tool = cornerstoneTools.getToolState(cornerstoneElement, 'MeasureRect')

    if (!tool || tool.data.length === 0) {
      message.warn(`请使用面积测量工具进行标注后在进行调整`)
      return false
    }

    if (tool.data.length > 1) {
      message.warn(`暂时只支持单个结节的调整，请删减后在进行调整`)
      return false
    }

    setAdjustModalVisible(true)
  }

  // 重新计算相关属性
  const handleAdjustNodeOk = () => {
    const checkItme = noduleList.find(item => item.checked === true)

    if (checkItme) {
      const tool = cornerstoneTools.getToolState(cornerstoneElement, 'MeasureRect')
      const data = tool.data[0].cachedStats
      // const handle = tool.data[0].handles
      const oldDiameter = checkItme.diameter.replace('*', '').split('mm')
      const oldArea = (oldDiameter[0] * oldDiameter[1]).toFixed(2)
      // let nodeBox = []
      if (checkItme.nodeType === 1) {
        checkItme.diameter = `${Math.abs(data.width.toFixed(2))}mm*${Math.abs(data.height.toFixed(2))}mm`
        checkItme.noduleSize = (checkItme.noduleSize * Math.pow(data.area / oldArea, 1.5)).toFixed(2)
      } else {
        checkItme.newDiameter = `${Math.abs(data.width.toFixed(2))}mm*${Math.abs(data.height.toFixed(2))}mm`
        checkItme.newNoduleSize = (checkItme.noduleSize * Math.pow(data.area / oldArea, 1.5)).toFixed(2)
      }

      // 重新计算中心直径
      checkItme.diameterSize = formatDiameter(
        `${Math.abs(data.width.toFixed(2))}mm*${Math.abs(data.height.toFixed(2))}mm`
      )

      // if (handle.start.x > handle.end.x) {
      //   nodeBox = [parseInt(handle.end.y), parseInt(handle.end.x), parseInt(handle.start.y), parseInt(handle.start.x)]
      // } else {
      //   nodeBox = [parseInt(handle.start.y), parseInt(handle.start.x), parseInt(handle.end.y), parseInt(handle.end.x)]
      // }

      // startX: rois.bbox[1],
      // startY: rois.bbox[0],
      // endX: rois.bbox[3],
      // endY: rois.bbox[2],

      // const startX = nodeBox[1]
      // const startY = nodeBox[0]
      // const endX = nodeBox[3]
      // const endY = nodeBox[2]

      // checkItme.nodeBox = nodeBox
      // checkItme.maxHu = data.max
      // checkItme.minHu = data.min
      // checkItme.meanHu = data.mean.toFixed(2)
      checkItme.diameterNorm = Math.sqrt(data.area).toFixed(2)
      // checkItme.centerHu = cornerstone.getPixels(
      //   cornerstoneElement,
      //   (Number(startX) + Number(endX)) / 2,
      //   (Number(startY) + Number(endY)) / 2,
      //   1,
      //   1
      // )[0]

      setNoduleList([...noduleList])
    }

    saveResults()
    setAdjustModalVisible(false)
  }

  const handleAdjustNodeCancel = () => {
    setAdjustModalVisible(false)
  }

  // 标记为结节
  const [showMarkModal, setshowMarkModal] = useState(false)

  const handleShowMarkModal = () => {
    setshowMarkModal(true)
  }

  const handleMarkModalOk = () => {
    const checkItme = noduleList.find(item => item.checked === true)

    if (checkItme) {
      const oldDiameter = checkItme.diameter.replace('*', '').split('mm')
      const oldArea = (oldDiameter[0] * oldDiameter[1]).toFixed(2)
      const newArea = (0.99 * 0.99).toFixed(2)

      if (checkItme.nodeType === 1) {
        checkItme.diameter = `0.99mm*0.99mm`
        checkItme.noduleSize = (checkItme.noduleSize * Math.pow(newArea / oldArea, 1.5)).toFixed(2)
      } else {
        checkItme.newDiameter = `0.99mm*0.99mm`
        checkItme.newNoduleSize = (checkItme.noduleSize * Math.pow(newArea / oldArea, 1.5)).toFixed(2)
      }

      checkItme.diameterSize = formatDiameter(`0.99mm*0.99mm`)
      checkItme.diameterNorm = Math.sqrt(newArea).toFixed(2)

      setNoduleList([...noduleList])
    }

    saveResults()
    setshowMarkModal(false)
  }

  const handleMarkModalCancel = () => {
    setshowMarkModal(false)
  }

  return (
    <div className="viewer-box">
      <Header data={patients} handleShowModal={handleShowModal} />
      <div className="viewer-center-box">
        <div className={showState ? 'middle-box-wrap-show' : 'middle-box-wrap-hide'}>
          <MiddleSidePanel
            handleVisibleChange={handleVisibleChange}
            handleCheckedListClick={handleCheckedListClick}
            handleHideNodule={handleHideNodule}
            onCheckChange={onCheckChange}
            onCheckAllChange={onCheckAllChange}
            showDeleteConfirm={showDeleteConfirm}
            showPopover={showPopover}
            indeterminate={indeterminate}
            checkAll={checkAll}
            noduleList={noduleList}
            noduleInfo={noduleInfo}
            imagesConfig={imagesConfig}
          />
        </div>
        <ViewerMain
          handleSliderChange={handleSliderChange}
          handleSubmitNodeDetail={handleSubmitNodeDetail}
          handleToolbarClick={handleToolbarClick}
          handleElementEnabledEvt={handleElementEnabledEvt}
          handleShowMarker={handleShowMarker}
          toolsConfig={toolsConfig}
          imagesConfig={imagesConfig}
          noduleList={noduleList}
          imageIdIndex={imageIdIndex}
          showMarker={showMarker}
        />
      </div>
      <NoduleInfo
        noduleInfo={noduleInfo}
        handleTextareaOnChange={handleTextareaOnChange}
        handleInputBlur={handleInputBlur}
        checkNoduleList={checkNoduleList}
        updateNoduleList={updateNoduleList}
        updateChiefNoduleList={updateChiefNoduleList}
        handleUpdateRisk={handleUpdateRisk}
        handleShowAdjustModal={handleShowAdjustModal}
        handleShowMarkModal={handleShowMarkModal}
      />
      {showMark ? (
        <MarkDialog handleCloseCallback={handleCloseCallback} handleSubmitCallback={handleSubmitCallback} />
      ) : null}

      <Modal
        title="确认模型风险结果"
        className="risk-modal"
        visible={showRisk}
        onOk={handleRiskOk}
        okText="确认"
        closable="false"
        keyboard="false"
        maskClosable="false"
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p>当前模型风险结果为：</p>
          <InputNumber onChange={setRiskVal} value={riskVal} addonAfter="%" min={1} max={99} />
        </div>
      </Modal>

      <Modal
        title="提交结果"
        maskClosable={false}
        visible={visible}
        onOk={handleSubmitResults}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
        maskStyle={{ backgroundColor: 'transparent' }}
      >
        <p>是否提交结果</p>
      </Modal>

      <Modal
        title="结节大小与体积调整"
        maskClosable={false}
        visible={adjustModalVisible}
        onOk={handleAdjustNodeOk}
        onCancel={handleAdjustNodeCancel}
        okText="确认"
        cancelText="取消"
        maskStyle={{ backgroundColor: 'transparent' }}
      >
        <p>是否使用图中测量的数据自动调整当前结节的大小与体积</p>
      </Modal>

      <Modal
        title="标记微小结节"
        maskClosable={false}
        visible={showMarkModal}
        onOk={handleMarkModalOk}
        onCancel={handleMarkModalCancel}
        okText="确认"
        cancelText="取消"
        maskStyle={{ backgroundColor: 'transparent' }}
      >
        <p>是否将当前结节标记为微小结节</p>
      </Modal>

      <div className="show-button">
        {/* <Button onClick={showNoduleList}>{showState ? '展开结节列表' : '收起结节列表'}</Button> */}
      </div>

      <Modal
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (modalDisabled) {
                setModalDisabled(false)
              }
            }}
            onMouseOut={() => {
              setModalDisabled(true)
            }}
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            新增结节
          </div>
        }
        okText={'确定'}
        cancelText={'取消'}
        visible={modalVisible}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        modalRender={modal => (
          <Draggable disabled={modalDisabled} bounds={modalBounds} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <AddNewNode
          handleToolListTextareaChange={handleToolListTextareaChange}
          handleToolListTextareaBlur={handleToolListTextareaBlur}
          updateToolList={updateToolList}
          currentImageIdIndex={currentImageIdIndex}
          toolList={toolList}
          imagesConfig={imagesConfig}
          cornerstoneElement={cornerstoneElement}
        />
      </Modal>
    </div>
  )
}

export default Viewer
