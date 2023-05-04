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
import CompareModalDetail from '../../components/CompareModal/CompareModalDetail'
import {
  updateNodeResult,
  getImageList,
  getNodeList,
  getPatientsList,
  getDoctorTask,
  getDoctorHistoryTask,
  addNewNodeList,
  updateDnResult,
  updateSuperDoctorResult,
  addNewNodeList2,
  ossKeyUrl,
  getDnReslutByOrderIdUrl,
  addNodeSourceDetail,
  deleteNodeSourceDetail,
  getImageReslutByOrderId,
} from '../../api/api'
import { getURLParameters, formatMiniNodule } from '../../util/index'
import { Modal, message, Button, InputNumber } from 'antd'
import Draggable from 'react-draggable'
import AddNewNode from '../../components/common/AddNewNode/AddNewNode'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import qs from 'query-string'
import { useLocation } from 'react-router-dom'

const { confirm } = Modal

const Viewer = () => {
  const params = qs.parse(useLocation().search)

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

  // 页面类型和状态
  const [pageType, setPageType] = useState('')
  const [pageState, setPageState] = useState('')

  // 跳转帧数
  const [imageIdIndex, setImageIdIndex] = useState(0)

  // 当前帧数
  const [currentImageIdIndex, setCurrentImageIdIndex] = useState(0)

  // 隐藏标注
  const [showMarker, setShowMarker] = useState(true)

  // 临时变量
  const nodeRef = useRef()

  // 历史记录
  const [historyList, setHistoryList] = useState([])

  // 医生比对
  const [doctorList, setDoctorList] = useState([])
  const [compareList, setCompareList] = useState([])

  // dnId
  const [dnId, setDnId] = useState('')

  // ossKey，当前 Dicom 文件，当前帧
  const [ossKey, setOssKey] = useState('')
  const [dicomFile, setDicomFile] = useState('')
  const [currentCoordZ, setCurrentCoordZ] = useState('')

  useEffect(() => {
    nodeRef.current = {
      noduleList,
      noduleMapList,
      showMarker,
    }
  }, [noduleList, noduleMapList, showMarker])

  const formatNodeData = () => {
    // 到时候删除
  }

  // 初始化结节信息
  useEffect(() => {
    // 管理员请求接口和订单跳转请求接口
    const getAdminReslutByOrderId = async () => {
      const result = await getImageReslutByOrderId(params.orderId)
      if (result.data.code === 200) {
        if (result.data.result) {
          formatAdminNodeData(result.data.result.nodeFinalList)
          fetcImagehData(result.data.result.nodeFinalList[0].dicomId)
        }
      }
    }

    // 医生请求接口
    const fetchDoctorData = async () => {
      const result = await getDoctorTask(params.doctorId)
      if (result.data.code === 200) {
        if (result.data.result) {
          setDoctorList([result.data.result.nodeChiefDoctorList, result.data.result.nodeDoctorList])
          setHistoryList(result.data.result.historyReportList)
          formatDoctorNodeData(result.data.result.nodeSourceList, result.data.result.nodeDoctorList)
          fetcImagehData(result.data.result.nodeSourceList[0].dicomId)
        }
      }
    }

    // 历史记录请求接口
    const fetchDoctorHistoryData = async () => {
      const result = await getDoctorHistoryTask(params.taskId)
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
      const res = await getImageList(params.resource)
      setImageList(res, data)
    }

    if (params.from === 'history') {
      setPageType('review')
      setPageState('admin')
      fetchDoctorHistoryData()
    } else {
      if (params.user === 'admin' || params.requestType === 'order') {
        setPageState('admin')
        getAdminReslutByOrderId()
      } else if (!params.user) {
        fetcImagehData(null)
      } else {
        fetchDoctorData()
      }

      // 现实对应的界面配置
      if (params.page === 'review') {
        setPageType('review')
      } else if (params.page === 'image') {
        setPageType('image')
      } else if (params.page === 'detail') {
        setPageType('detail')
        const index = params.index
        if (index) {
          setImageIdIndex(Number(index))
        } else {
          setImageIdIndex(0)
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取 ossKey
  useEffect(() => {
    const fetchData = async () => {
      const result = await getPatientsList(params.resource)
      if (result.data.code === 200 && result.data.result) {
        setOssKey(result.data.result.records[0].ossKey)
      }
    }
    fetchData()
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
        // imageList.push(`wadouri:${item.ossUrl.replace('http://', 'https://')}`)
        imageList.push(`wadouri:${item.ossUrl.replace('yydsofflone', 'yydsoffline')}`)
      })

      setImagesConfig(imageList)

      // 缓存图片
      // if (data && data.length > 0) {
      //   loadAndCacheImage(cornerstone, imageList, data)
      // }
    }
  }

  // 格式化结节数据（管理员和订单跳转）
  const formatAdminNodeData = data => {
    const nodulesList = []
    const nodulesMapList = []

    // 初始化滑块的值
    // if (resultInfo[0] && resultInfo[0].diameterStandard) {
    //   localStorage.setItem('diameterSize', resultInfo[0].diameterStandard)
    // } else {
    //   localStorage.setItem('diameterSize', 3)
    // }

    // scrynMaligant    AI 的结果，不会变
    // whuMaligant      武大的结果，不会变
    // doctorMaligant   医生的结果，会变

    for (let i = 0; i < data.length; i++) {
      nodulesList.push({
        doctorNodeId: data[i].id,
        num: data[i].imageIndex,
        type: data[i].featureLabel,
        risk: data[i].scrynMaligant,
        scrynMaligant: data[i].doctorMaligant,
        whuScryn: data[i].whuMaligant,
        soak: data[i].invisionClassify ? data[i].invisionClassify : 'OTHER',
        newSoak: data[i].newInvisionClassify ? data[i].newInvisionClassify : 'OTHER',
        info: '',
        markNode: '',
        checked: false,
        active: false,
        noduleName: data[i].id,
        noduleNum: data[i].id,
        state: data[i].id.invisable === 1 ? false : true,
        lung: data[i].lungLocation,
        lobe: data[i].lobeLocation,
        diameter: data[i].diameter,
        diameterSize: formatDiameter(data[i].diameter),
        noduleSize: data[i].noduleSize,
        suggest: data[i].suggest,
        isFinish: data[i].isFinish,
        nodeType: data[i].isNew,
      })

      // 提取结节
      const box = data[i].boxes ? JSON.parse(data[i].boxes.replace(/'/g, '"')) : []
      for (let j = 0; j < box.length; j++) {
        nodulesMapList.push({
          noduleName: data[i].id,
          index: Number(box[j].index),
          startX: Number(box[j].box[1]),
          startY: Number(box[j].box[0]),
          endX: Number(box[j].box[3]),
          endY: Number(box[j].box[2]),
        })
      }
    }

    setNoduleList([...nodulesList])
    setNoduleMapList([...nodulesMapList])
  }

  // 格式化结节数据（医生接口）
  const formatDoctorNodeData = (data, resultInfo) => {
    const nodulesList = []
    const nodulesMapList = []

    // 初始化滑块的值
    // if (resultInfo[0] && resultInfo[0].diameterStandard) {
    //   localStorage.setItem('diameterSize', resultInfo[0].diameterStandard)
    // } else {
    //   localStorage.setItem('diameterSize', 3)
    // }

    // scrynMaligant    AI 的结果，不会变，risk
    // whuMaligant      武大的结果，不会变，scrynMaligant
    // doctorMaligant   医生的结果，会变

    for (let i = 0; i < data.length; i++) {
      const item = resultInfo.find(item => item.nodeId === data[i].id)

      if (item) {
        nodulesList.push({
          doctorNodeId: data[i].id,
          num: data[i].imageIndex,
          type: item.featureLabel,
          risk: item.scrynMaligant,
          scrynMaligant: item.doctorMaligant,
          whuScryn: item.whuMaligant,
          soak: item.invisionClassify ? item.invisionClassify : 'OTHER',
          newSoak: item.newInvisionClassify ? item.newInvisionClassify : 'OTHER',
          info: '',
          markNode: '',
          checked: false,
          active: false,
          noduleName: data[i].id,
          noduleNum: data[i].id,
          state: item.invisable === 1 ? false : true,
          lung: item.lungLocation,
          lobe: item.lobeLocation,
          diameter: item.diameter,
          diameterSize: formatDiameter(item.diameter),
          noduleSize: item.noduleSize,
          newNoduleSize: item.newNoduleSize,
          suggest: item.suggest,
          isFinish: item.isFinish,
          nodeType: item.isNew,
        })
      } else {
        nodulesList.push({
          doctorNodeId: data[i].id,
          num: data[i].imageIndex,
          type: data[i].featureLabel,
          risk: data[i].scrynMaligant,
          scrynMaligant: data[i].doctorMaligant,
          whuScryn: data[i].whuMaligant,
          soak: data[i].invisionClassify ? data[i].invisionClassify : 'OTHER',
          newSoak: data[i].newInvisionClassify ? data[i].newInvisionClassify : 'OTHER',
          info: '',
          markNode: '',
          checked: false,
          active: false,
          noduleName: data[i].id,
          noduleNum: data[i].id,
          state: data[i].id.invisable === 1 ? false : true,
          lung: data[i].lungLocation,
          lobe: data[i].lobeLocation,
          diameter: data[i].diameter,
          diameterSize: formatDiameter(data[i].diameter),
          noduleSize: data[i].noduleSize,
          suggest: data[i].suggest,
          isFinish: data[i].isFinish,
          nodeType: data[i].isNew,
        })
      }

      // 提取结节
      const box = data[i].boxes ? JSON.parse(data[i].boxes.replace(/'/g, '"')) : []
      for (let j = 0; j < box.length; j++) {
        nodulesMapList.push({
          noduleName: data[i].id,
          index: Number(box[j].index),
          startX: Number(box[j].box[1]),
          startY: Number(box[j].box[0]),
          endX: Number(box[j].box[3]),
          endY: Number(box[j].box[2]),
        })
      }
    }

    setNoduleList([...nodulesList])
    setNoduleMapList([...nodulesMapList])
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

    // 设置右侧结节详情
    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme && pageType !== 'detail') {
      setNoduleInfo(checkItme)
    } else {
      setNoduleInfo(null)
    }
  }

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
    if (checkItme && pageType !== 'detail') {
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

  // 是否为结节
  const updateNoduleList = checkState => {
    const checkItme = noduleList.find(item => item.checked === true)
    checkItme.review = true
    checkItme.state = checkState
    setNoduleList([...noduleList])
  }

  // 是否标记为良性样本
  const updateChiefMarkNode = checkState => {
    const checkItme = noduleList.find(item => item.checked === true)
    checkItme.markNode = checkState
    setNoduleList([...noduleList])
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
      checkItme.review = true
    }
    if (checkItme && type === 'soak') {
      checkItme.newSoak = val
      checkItme.review = true
    }
    setNoduleList([...noduleList])
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
  }

  // 更新恶性风险
  const handleUpdateRisk = (val, type) => {
    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme) {
      checkItme.scrynMaligant = val
      checkItme.review = true
      setNoduleList([...noduleList])
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
        setTimeout(() => {
          windowChange(cornerstoneElement, newImage.detail.image, 2)
          flag = false
        }, 0)
      }

      cornerstoneTools.setToolActive('MarkNodule', { mouseButtonMask: 1 })
      setTimeout(() => {
        addNodeTool(cornerstoneElement, index)
        setActiveToolState()
      }, 0)
    })

    // cornerstoneElement.addEventListener('cornerstoneimageloaded', newImage => {
    //   console.log(1)
    // })

    cornerstoneElement.addEventListener('cornerstoneimagerendered', imageRenderedEvent => {
      const curImageId = imageRenderedEvent.detail.image.imageId
      const index = imagesConfig.findIndex(item => item === curImageId)
      setDicomFile(curImageId)
      setCurrentCoordZ(index)
      setCurrentImageIdIndex(index)
      // handleCheckedListClick(index)
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
    //     noduleList[i].state = true
    //   }

    //   if (noduleList[i].diameterSize >= val && noduleList[i].diameterSize < preVal) {
    //     noduleList[i].review = false
    //     noduleList[i].state = undefined
    //   }
    // }
    setNoduleList([...noduleList])
    // if (preVal !== val) {
    //   setPreVal(val)
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

  // 格式化提交数据
  const formatPostData = () => {
    // 微小结节度量
    const noduleMeasure = Number(localStorage.getItem('diameterSize'))

    const checkItme = noduleList.find(item => item.checked === true)
    const diameterSize = checkItme.newDiameter ? formatDiameter(checkItme.newDiameter) : checkItme.diameter ? formatDiameter(checkItme.diameter) : ''

    const postData = {
      id: checkItme.doctorNodeId || '',
      dttrId: params.taskId,
      orderId: params.orderId,
      nodeId: checkItme.noduleNum,
      diameter: checkItme.diameter,
      newDiameter: checkItme.newDiameter ? checkItme.newDiameter : '',
      lobeLocation: checkItme.lobe,
      lungLocation: checkItme.lung,
      newNoduleSize: checkItme.newNoduleSize,
      noduleSize: checkItme.noduleSize,
      imageIndex: checkItme.num,
      invisionClassify: checkItme.soak,
      invisable: checkItme.state === false ? '1' : checkItme.state === true ? '0' : '-',
      suggest: checkItme.suggest,
      featureLabel: checkItme.type,
      isMiniType: diameterSize <= noduleMeasure ? 1 : 0,
      diameterStandard: noduleMeasure,
      whuMaligant: checkItme.whuScryn,
      scrynMaligant: checkItme.risk,
      doctorMaligant: checkItme.scrynMaligant,
    }

    console.log(postData)

    return postData
  }

  // 暂存当前结节数据
  const saveResults = _ => {
    throttle(handleSaveResults, 2000)()
  }

  const handleSaveResults = _ => {
    const postData = formatPostData()
    updateNodeResult(postData).then(res => {
      if (res.data.code === 200) {
        message.success(`结节信息保存成功`)
        const checkItme = noduleList.find(item => item.checked === true)
        checkItme.isFinish = 1
        setNoduleList([...noduleList])
      } else {
        message.error(`结节结果保存失败，请检查网络或是重新登录后再行尝试`)
      }
    })
  }

  // 提交审核结果（添加节流）
  const [pre, setPre] = useState(0)

  const throttle =
    (fn, delay) =>
    (...rest) => {
      const current = Date.now()
      if (current - pre > delay) {
        fn(rest)
        setPre(current)
      }
    }

  const handleShowModal = _ => {
    throttle(handleUpdateResult, 2000)()
  }

  // 提交审核结果按钮
  const handleUpdateResult = () => {
    if (params.user === 'chief_lwx') {
      if (!noduleList.every(item => item.isFinish === 1)) {
        message.warning(`请复核完所有结节后在进行结果提交`)
        return false
      }
      setVisible(true)
    } else {
      if (noduleList.every(item => item.isFinish === 1)) {
        setVisible(true)
      } else {
        message.warning(`请检阅完所有结节后在进行结果提交`)
      }
    }
  }

  // 提交审核结果弹窗
  const handleSubmitResults = () => {
    const postData = {
      id: params.user === 'admin' ? params.taskId : params.doctorId,
    }

    if (params.user === 'chief_lwx') {
      updateSuperDoctorResult(JSON.stringify(postData)).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          message.success(`提交审核结果成功`)
          setVisible(false)
          setTimeout(() => {
            window.parent.postMessage(
              {
                code: 200,
                success: true,
                backId: params.backId,
                backType: params.backType,
              },
              '*'
            )
          }, 1000)
        } else {
          message.error(`提交失败，请重新尝试！`)
        }
      })
    } else {
      updateDnResult(JSON.stringify(postData)).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          message.success(`提交审核结果成功`)
          setVisible(false)
          setTimeout(() => {
            window.parent.postMessage(
              {
                code: 200,
                success: true,
                backId: params.backId,
                backType: params.backType,
              },
              '*'
            )
          }, 1000)
        } else {
          message.error(`提交失败，请重新尝试！`)
        }
      })
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
    const result = await getDoctorTask(params.doctorId)
    if (result.data.code === 200) {
      if (result.data.result) {
        if (result.data.result.doctorTask.resultInfo) {
          const data = JSON.parse(result.data.result.imageResult)
          const resultInfo = JSON.parse(result.data.result.doctorTask.resultInfo)
          formatNodeData(data, resultInfo)
          callback && callback()
        } else {
          const data = JSON.parse(result.data.result.imageResult)
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

  const [showRisk, setShowRisk] = useState(false)
  const [riskVal, setRiskVal] = useState(0)
  const [postData, setPostData] = useState(null)
  const [res, setRes] = useState(null)

  // 新增结节操作
  const handleRiskOk = () => {
    setConfirmLoading(true)

    const startX = postData.boxes.split(',')[1]
    const startY = postData.boxes.split(',')[0]
    const endX = postData.boxes.split(',')[3]
    const endY = postData.boxes.split(',')[2]
    const rowPixelSpacing = cornerstone.getImage(cornerstoneElement).rowPixelSpacing
    const noduleMeasure = Number(localStorage.getItem('diameterSize'))

    const newNodeData = {
      dttrId: params.taskId,
      orderId: params.orderId,
      dnId: dnId,
      diameter: `${(Math.abs(endX - startX) * rowPixelSpacing).toFixed(2)}mm*${(Math.abs(endY - startY) * rowPixelSpacing).toFixed(2)}mm`,
      lobeLocation: toolList[0].lobe,
      lungLocation: toolList[0].lung,
      noduleSize: (Math.pow(Math.sqrt(toolList[0].cachedStats.area) / 2, 3) * Math.PI).toFixed(2),
      imageIndex: currentImageIdIndex,
      invisionClassify: 'OTHER',
      invisable: 1,
      suggest: toolList[0].suggest,
      featureLabel: toolList[0].type,
      diameterStandard: noduleMeasure,

      maxHu: toolList[0].cachedStats.max,
      minHu: toolList[0].cachedStats.min,
      meanHu: toolList[0].cachedStats.mean.toFixed(2),
      centerHu: cornerstone.getPixels(cornerstoneElement, (Number(startX) + Number(endX)) / 2, (Number(startY) + Number(endY)) / 2, 1, 1)[0],

      imageUrl: '',
      imageSurl: '',
      scrynMaligant: 0,
      whuMaligant: 0,

      // imageUrl1: res.data.imageUrl1,
      // imageUrl2: res.data.imageUrl2,
      // scrynMaligant: riskVal ? riskVal : res.data.scrynMaligant,
      // whu_scrynMaligant: riskVal ? riskVal : res.data.whu_scrynMaligant,

      isNew: 1,
      maxBox: [startY, startX, endY, endX].toString(),
      boxes: JSON.stringify([{ index: currentImageIdIndex, box: [startY, startX, endY, endX] }]),

      isFinish: 1,
    }

    addNodeSourceDetail(newNodeData).then(res => {
      if (res.data.code === 200) {
        fetchDoctorData(callback => {
          updateCanvasAndList()
        })
        message.success(`新增成功！`)
        setConfirmLoading(false)
      } else {
        message.error(`新增失败，请重新尝试！`)
        setConfirmLoading(false)
        return false
      }
    })

    setShowRisk(false)
  }

  // 新增结节时计算风险
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
      dicom_zip: ossKeyUrl + ossKey,
      boxes: [],
      coordZ: currentCoordZ,
      dicom_url: dicomFile.replace('wadouri:', '').replace('https://', 'http://'),
    }

    if (toolList[0].startX > toolList[0].endX) {
      postData.boxes = [parseInt(toolList[0].endY), parseInt(toolList[0].endX), parseInt(toolList[0].startY), parseInt(toolList[0].startX)].join(',')
    } else {
      postData.boxes = [parseInt(toolList[0].startY), parseInt(toolList[0].startX), parseInt(toolList[0].endY), parseInt(toolList[0].endX)].join(',')
    }

    setPostData(postData)

    // startX: rois.bbox[1],
    // startY: rois.bbox[0],
    // endX: rois.bbox[3],
    // endY: rois.bbox[2],

    const hide = message.loading('新增结节中，请稍等..', 0)
    setConfirmLoading(true)

    // addNewNodeList2(JSON.stringify(postData)).then(res => {
    //   if (res.data.code === 1) {
    setTimeout(hide)
    // setRiskVal(res.data.scrynMaligant)
    setRiskVal('0')
    setRes(res)
    setShowRisk(true)
    // } else {
    //   message.error(`新增失败，请重新尝试`)
    //   setTimeout(hide)
    //   setConfirmLoading(true)
    //   return false
    // }
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

        deleteNodeSourceDetail(item.noduleNum).then(res => {
          if (res.data.code === 200) {
            fetchDoctorData(callback => {
              updateCanvasAndList()
            })
            message.success('删除成功！')
          } else {
            message.error(res.data.message)
          }
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
      const toolData = tool.data[0]
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
      checkItme.diameterSize = formatDiameter(`${Math.abs(data.width.toFixed(2))}mm*${Math.abs(data.height.toFixed(2))}mm`)

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

      // 调整完成后删除标注工具
      cornerstoneTools.removeToolState(cornerstoneElement, 'MeasureRect', toolData)
      cornerstone.updateImage(cornerstoneElement)
    }

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

    setshowMarkModal(false)
  }

  const handleMarkModalCancel = () => {
    setshowMarkModal(false)
  }

  /**
   * 新增医生查看李主任审阅后的比对结果
   */
  const [openDetail, setOpenDetail] = useState(false)
  const [detailDisabled, setDetailDisabled] = useState(false)

  const draggleDetailRef = useRef(null)

  const handleDetailCancel = _ => {
    setOpenDetail(false)
  }

  const handleShowCompareModal = item => {
    const nodeChiefDoctorList = doctorList[0].find(v => v.nodeId === item.doctorNodeId)
    const nodeDoctorList = doctorList[1].find(v => v.nodeId === item.doctorNodeId)
    setCompareList([nodeChiefDoctorList, nodeDoctorList])
    setOpenDetail(true)
  }

  return (
    <div className={pageType ? `viewer-${pageType}-box` : 'viewer-box'}>
      <Header data={patients} handleShowModal={handleShowModal} pageType={pageType} pageState={pageState} historyList={historyList} />
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
            handleShowCompareModal={handleShowCompareModal}
          />
        </div>
        <ViewerMain
          handleSliderChange={handleSliderChange}
          handleSubmitNodeDetail={handleSubmitNodeDetail}
          handleToolbarClick={handleToolbarClick}
          handleElementEnabledEvt={handleElementEnabledEvt}
          handleShowMarker={handleShowMarker}
          handleScorllClicked={handleScorllClicked}
          toolsConfig={toolsConfig}
          imagesConfig={imagesConfig}
          noduleList={noduleList}
          pageType={pageType}
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
        updateChiefMarkNode={updateChiefMarkNode}
        handleUpdateRisk={handleUpdateRisk}
        handleShowAdjustModal={handleShowAdjustModal}
        handleShowMarkModal={handleShowMarkModal}
        pageState={pageState}
        saveResults={saveResults}
      />
      {showMark ? <MarkDialog handleCloseCallback={handleCloseCallback} handleSubmitCallback={handleSubmitCallback} /> : null}

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
        <p>是否提交最终结果</p>
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

      {pageType === 'review' ? (
        <div className="show-button">
          <Button onClick={showNoduleList}>{showState ? '展开结节列表' : '收起结节列表'}</Button>
          {params.patientId && params.patientId !== 'null' ? (
            <span className="infor-detail">
              patientId: <em>{params.patientId}</em>
            </span>
          ) : null}
        </div>
      ) : null}

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

      {/* 医生结节比较弹窗 */}
      <Modal
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (detailDisabled) {
                setDetailDisabled(false)
              }
            }}
            onMouseOut={() => {
              setDetailDisabled(true)
            }}
            onFocus={() => {}}
            onBlur={() => {}}
          >
            审阅结果比对
          </div>
        }
        visible={openDetail}
        modalRender={modal => (
          <Draggable>
            <div ref={draggleDetailRef}>{modal}</div>
          </Draggable>
        )}
        mask={false}
        maskClosable={false}
        wrapClassName={'detail-box-modal'}
        width={590}
        onCancel={handleDetailCancel}
        footer={[
          <Button key="back" onClick={e => setOpenDetail(false)}>
            关闭
          </Button>,
        ]}
        style={{
          position: 'absolute',
          left: 466,
          top: 95,
        }}
      >
        <div className="third-detail-box">
          {compareList.map((item, index) => (
            <div key={index}>
              <CompareModalDetail key={index} index={index} noduleInfo={item} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default Viewer
