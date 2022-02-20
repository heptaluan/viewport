import React, { useState, useEffect } from 'react'
import './Viewer.scss'
import Header from '../../components/Header/Header'
// import LeftSidePanel from '../../components/LeftSidePanel/LeftSidePanel'
import ViewerMain from '../../components/ViewerMain/ViewerMain'
import MiddleSidePanel from '../../components/MiddleSidePanel/MiddleSidePanel'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import NoduleInfo from '../../components/common/NoduleInfo/NoduleInfo'
import MarkNoduleTool from '../../components/common/MarkNoduleTool/MarkNoduleTool'
import MarkDialog from '../../components/common/MarkDialog/MarkDialog'
import { getMedicalList, getImageList, getNodeList, updateDnResult, getPatientsList } from '../../api/api'
import { getURLParameters } from '../../util/index'
import { Modal, message } from 'antd'

const Viewer = () => {
  const defaultTools = [
    {
      name: 'Wwwc',
      mode: 'active',
      modeOptions: { mouseButtonMask: 1 },
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
  const [originNoduleList, setOriginNoduleList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [patients, setPatients] = useState([])
  const [noduleMapList, setNoduleMapList] = useState([])

  // 结节详情
  const [noduleInfo, setNoduleInfo] = useState(null)

  // 页面类型
  const [pageType, setPageType] = useState('')

  // 初始化影像信息
  useEffect(() => {
    const fetcImagehData = async () => {
      const result = await getMedicalList(
        getURLParameters(window.location.href).resource,
        getURLParameters(window.location.href).type
      )
      // console.log(result)
      if (result.data.code === 200 && result.data.result.length > 0) {
        setLeftSidePanelData(result.data.result)
        const instanceUid = result.data.result[0].instanceUid
        const res = await getImageList(instanceUid)
        setImageList(res)
      }
    }

    const fetchReviewData = async () => {
      const result = await getMedicalList(
        getURLParameters(window.location.href).requestId,
        getURLParameters(window.location.href).type
      )
      // console.log(result)
      if (result.data.code === 200 && result.data.result.length > 0) {
        setLeftSidePanelData(result.data.result)
        const instanceUid = result.data.result[0].instanceUid
        const res = await getImageList(instanceUid)
        setImageList(res)
      }
    }

    console.log(pageType)

    if (getURLParameters(window.location.href).page === 'review') {
      setPageType('review')
      fetchReviewData()
    } else if (getURLParameters(window.location.href).page === 'image') {
      setPageType('image')
      fetcImagehData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 初始化结节信息
  useEffect(() => {
    const fetchData = async () => {
      const result = await getNodeList(getURLParameters(window.location.href).id)
      if (result.data.code === 200) {
        console.log(result.data)
        if (result.data.result) {
          const data = JSON.parse(result.data.result.text.replace(/'/g, '"'))
          formatNodeData(data)
        }
      }
    }
    if (getURLParameters(window.location.href).page === 'review') {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 初始化病人信息
  useEffect(() => {
    const fetchData = async () => {
      const result = await getPatientsList(
        getURLParameters(window.location.href).resource,
        getURLParameters(window.location.href).type
      )
      // console.log(result)
      if (result.data.code === 200 && result.data.result) {
        setPatients(result.data.result)
      }
    }
    if (getURLParameters(window.location.href).page === 'image') {
      fetchData()
    }
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

  // ===========================================================

  // 添加结节标注
  const addNodeTool = (cornerstoneElement, index = 0) => {
    const item = noduleMapList.filter(item => item.index === index + 1)
    const checkItme = noduleList.find(item => item.checked === true)

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
                x: item[i].startX - 10,
                y: item[i].startY - 10,
                highlight: true,
                active: true,
              },
              end: {
                x: item[i].endX + 10,
                y: item[i].endY + 10,
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
                x: item[i].startX - 10,
                y: item[i].startY - 10,
                highlight: true,
                active: true,
              },
              end: {
                x: item[i].endX + 10,
                y: item[i].endY + 10,
                highlight: true,
                active: true,
              },
            },
          }
          cornerstoneTools.addToolState(cornerstoneElement, 'MarkNodule', measurementData)
        }
      }
      cornerstone.updateImage(cornerstoneElement)
    }
  }

  // 设置图片列表
  const setImageList = res => {
    if (res.data.code === 200 && res.data.result.length > 0) {
      const newList = sortImageList(res.data.result)
      // const newList = res.data.result
      const imageList = []
      newList.forEach(item => {
        imageList.push(`wadouri:${item.ossUrl}`)
      })

      setImagesConfig(imageList)

      // 缓存图片
      // if (imageList.length > 0) {
      //   loadAndCacheImage(cornerstone, imageList)
      // }
    }
  }

  // 调整影像序列顺序
  const sortImageList = list => {
    if (list[0].sliceLocation > list[1].sliceLocation) {
      return list
    } else {
      return list.reverse()
    }
  }

  // 序列点击事件
  // const handleSequenceListClick = async instanceUid => {
  //   const res = await getImageList(instanceUid)
  //   setImageList(res)
  // }

  // ===========================================================

  // 单选
  const onCheckChange = (e, index) => {
    noduleList.map(item => (item.checked = false))
    noduleList[index].checked = e.target.checked
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
    const item = noduleList.find(item => Number(item.num) === index + 1)
    if (item) {
      noduleList.map(item => (item.active = false))
      item.active = true
      setNoduleList([...noduleList])
      // setTimeout(() => {
      //   const viewerItemActive = document.querySelector('#viewerItemBox .item-active')
      //   viewerItemActive && viewerItemActive.scrollIntoView()
      // }, 0)
    }

    // 设置当前视图选中项
    if (cornerstoneElement) {
      changeActiveImage(index, cornerstoneElement)
    }
  }

  // 更新列表事件
  const updateNoduleList = checkState => {
    const checkItme = noduleList.find(item => item.checked === true)
    checkItme.review = true
    checkItme.state = checkState
    setNoduleList([...noduleList])
  }

  // 更新结节事件
  const checkNoduleList = (val, type) => {
    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme && type === 'lung') {
      checkItme.lung = val
      checkItme.doctorCheck = true
      checkItme.review = true
      checkItme.state = true
    }
    if (checkItme && type === 'lobe') {
      checkItme.lobe = val
      checkItme.doctorCheck = true
      checkItme.review = true
      checkItme.state = true
    }
    if (checkItme && type === 'type') {
      checkItme.type = val
      checkItme.doctorCheck = true
      checkItme.review = true
      checkItme.state = true
    }
    setNoduleList([...noduleList])
  }

  // 更新医生影像建议内容
  const handleTextareaOnChange = e => {
    const checkItme = noduleList.find(item => item.checked === true)
    if (checkItme) {
      checkItme.suggest = e.target.value
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
      default:
        break
    }
  }

  // 切换当前视图
  const changeActiveImage = (index, cornerstoneElement) => {
    cornerstone.loadImage(imagesConfig[index - 1]).then(image => {
      cornerstone.displayImage(cornerstoneElement, image)
      cornerstoneTools.addStackStateManager(cornerstoneElement, ['stack'])
      cornerstoneTools.addToolState(cornerstoneElement, 'stack', {
        currentImageIdIndex: Number(index - 1),
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
      console.log(tool)
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

    cornerstoneElement.addEventListener('cornerstonenewimage', newImage => {
      const curImageId = newImage.detail.image.imageId
      const index = imagesConfig.findIndex(item => item === curImageId)

      cornerstoneTools.setToolActive('MarkNodule', { mouseButtonMask: 1 })
      setTimeout(() => {
        windowChange(cornerstoneElement, newImage.detail.image, 2)
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

  // 保存为图片
  // const saveAs = (element, filename, mimetype = 'image/png') => {
  //   const canvas = element.querySelector('canvas')
  //   if (canvas.msToBlob) {
  //     const blob = canvas.msToBlob()

  //     return window.navigator.msSaveBlob(blob, filename)
  //   }

  //   const lnk = document.createElement('a')
  //   lnk.download = filename
  //   lnk.href = canvas.toDataURL(mimetype, 1)

  //   if (document.createEvent) {
  //     const e = document.createEvent('MouseEvents')
  //     e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  //     lnk.dispatchEvent(e)
  //   } else if (lnk.fireEvent) {
  //     lnk.fireEvent('onclick')
  //   }
  // }

  // 格式化结节数据
  const formatNodeData = data => {
    const nodulesList = []
    const nodulesMapList = []
    let index = 0
    if (data.code === 10000) {
      setOriginNoduleList([...data.detectionResult.nodulesList])
      const res = data.detectionResult.nodulesList
      // const res = data.detectionResult.nodulesList.sort(nestedSort('coord', 'coordZ'))
      for (let i = 0; i < res.length; i++) {
        nodulesList.push({
          id: index,
          num: res[i].coord.coordZ,
          size: res[i].diameter,
          type: res[i].featureLabel.value,
          risk: (res[i].scrynMaligant * 100).toFixed(0) + '%',
          soak: '',
          info: '',
          checked: false,
          active: false,
          noduleName: res[i].noduleName,
          noduleNum: res[i].noduleNum,
          state: undefined,
          review: false,
          lung: res[i].lobe.lungLocation,
          lobe: res[i].lobe.lobeLocation,
          noduleSize: res[i].noduleSize,
          featureLabelG: res[i].featureLabelG,
          doctorCheck: false,
          suggest: '',
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
      setNoduleList(nodulesList)
      setNoduleMapList(nodulesMapList)
    } else {
      setNoduleList([])
      console.log(`数据加载失败`)
    }
  }

  // 排序函数
  // const nestedSort =
  //   (prop1, prop2 = null, direction = 'asc') =>
  //   (e1, e2) => {
  //     const a = prop2 ? e1[prop1][prop2] : e1[prop1],
  //       b = prop2 ? e2[prop1][prop2] : e2[prop1],
  //       sortOrder = direction === 'asc' ? 1 : -1
  //     return a < b ? -sortOrder : a > b ? sortOrder : 0
  //   }

  // 缓存图片请求池
  // const loadAndCacheImage = (cornerstone, imageList) => {
  //   const taskPool = []
  //   for (let i = 0; i < imageList.length; i++) {
  //     cornerstone.loadAndCacheImage(imageList[i]).then(image => {
  //       taskPool.push(image.imageId)
  //       setTaskLength(taskPool.length)
  //     })
  //   }
  // }

  // ===========================================================

  const [visible, setVisible] = useState(false)

  const hideModal = () => {
    setVisible(false)
  }

  // 弹窗
  const handleShowModal = () => {
    if (noduleList.every(item => item.review === true)) {
      setVisible(true)
    } else {
      message.warning(`请检阅完所有结节列表后在进行结果提交`)
    }
  }

  // 提交审核结果
  const handleSubmitResults = () => {
    const postData = {
      id: getURLParameters(window.location.href).id,
      orderId: getURLParameters(window.location.href).orderId,
      doctor: decodeURIComponent(getURLParameters(window.location.href).user),
      resultInfo: {
        nodelist: [],
      },
    }

    const dnPostData = {
      id: getURLParameters(window.location.href).id,
      orderId: getURLParameters(window.location.href).orderId,
      dnResultInfo: {
        nodelist: [],
      },
    }

    if (getURLParameters(window.location.href).user === 'diannei') {
      for (let i = 0; i < noduleList.length; i++) {
        if (noduleList[i].state === false) {
          dnPostData.dnResultInfo.nodelist.push({
            index: originNoduleList.findIndex(item => item.noduleNum === noduleList[i].noduleNum) + 1,
            imageIndex: noduleList[i].num,
            dn_check_invisible: 1,
            dn_check_lung: noduleList[i].doctorCheck ? noduleList[i].lung : null,
            dn_check_local: noduleList[i].doctorCheck ? noduleList[i].lobe : null,
            dn_check_type: noduleList[i].doctorCheck ? noduleList[i].type : null,
            dn_edit: noduleList[i].doctorCheck,
            dn_suggest: noduleList[i].suggest,
          })
        }
      }

      dnPostData.dnResultInfo = JSON.stringify(dnPostData.dnResultInfo)
      updateDnResult(JSON.stringify(dnPostData)).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          message.success(`提交审核结果成功`)
          window.parent.postMessage(
            {
              code: 200,
              success: true,
            },
            '*'
          )
        } else {
          message.error(`提交失败，请重新尝试`)
        }
      })
    } else {
      for (let i = 0; i < noduleList.length; i++) {
        if (noduleList[i].state === false) {
          postData.resultInfo.nodelist.push({
            index: originNoduleList.findIndex(item => item.noduleNum === noduleList[i].noduleNum) + 1,
            imageIndex: noduleList[i].num,
            check_invisible: 1,
            check_lung: noduleList[i].doctorCheck ? noduleList[i].lung : null,
            check_local: noduleList[i].doctorCheck ? noduleList[i].lobe : null,
            check_type: noduleList[i].doctorCheck ? noduleList[i].type : null,
            edit: noduleList[i].doctorCheck,
            suggest: noduleList[i].suggest,
          })
        }
      }

      postData.resultInfo = JSON.stringify(postData.resultInfo)
      updateDnResult(JSON.stringify(postData)).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          message.success(`提交审核结果成功`)
          window.parent.postMessage(
            {
              code: 200,
              success: true,
            },
            '*'
          )
        } else {
          message.error(`提交失败，请重新尝试`)
        }
      })
    }
  }

  return (
    <div className="viewer-box">
      {/* {taskLength !== imagesConfig.length ? (
        <div className="load-image-mask">
          <span>图片序列加载中 {taskLength > 0 ? <em>，正在加载第 {taskLength} 张</em> : null}</span>
        </div>
      ) : null} */}
      <Header data={patients} handleShowModal={handleShowModal} pageType={pageType} />
      <div className="viewer-center-box">
        {/* <LeftSidePanel data={sequenceListData} handleSequenceListClick={handleSequenceListClick} /> */}
        <MiddleSidePanel
          handleVisibleChange={handleVisibleChange}
          handleCheckedListClick={handleCheckedListClick}
          handleHideNodule={handleHideNodule}
          onCheckChange={onCheckChange}
          onCheckAllChange={onCheckAllChange}
          showPopover={showPopover}
          indeterminate={indeterminate}
          checkAll={checkAll}
          noduleList={noduleList}
          handleTextareaOnChange={handleTextareaOnChange}
          noduleInfo={noduleInfo}
        />
        <ViewerMain
          handleToolbarClick={handleToolbarClick}
          handleElementEnabledEvt={handleElementEnabledEvt}
          toolsConfig={toolsConfig}
          imagesConfig={imagesConfig}
          noduleList={noduleList}
        />
      </div>
      <NoduleInfo noduleInfo={noduleInfo} checkNoduleList={checkNoduleList} updateNoduleList={updateNoduleList} />
      {showMark ? (
        <MarkDialog handleCloseCallback={handleCloseCallback} handleSubmitCallback={handleSubmitCallback} />
      ) : null}

      <Modal
        title="提交审核结果"
        maskClosable={false}
        visible={visible}
        onOk={handleSubmitResults}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
        maskStyle={{ backgroundColor: 'transparent' }}
      >
        <p>是否提交检阅结果</p>
      </Modal>
    </div>
  )
}

export default Viewer
