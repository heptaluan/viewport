import React, { useState, useEffect, useCallback } from 'react'
import './Viewer.scss'
import Header from '../../components/Header/Header'
import LeftSidePanel from '../../components/LeftSidePanel/LeftSidePanel'
import ViewerMain from '../../components/ViewerMain/ViewerMain'
import MiddleSidePanel from '../../components/MiddleSidePanel/MiddleSidePanel'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import NoduleInfo from '../../components/common/NoduleInfo/NoduleInfo'
import MarkNoduleTool from '../../components/common/MarkNoduleTool/MarkNoduleTool'
import MarkDialog from '../../components/common/MarkDialog/MarkDialog'
import { getMedicalList, getImageList, getPatientsList, getNodeList } from '../../api/api'
import { getURLParameters } from '../../util/index'
import { data } from './data'

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
  const [toolsConfig, setToolsConfig] = useState(defaultTools)
  const [imagesConfig, setImagesConfig] = useState([])
  const [taskLength, setTaskLength] = useState(0)
  const [sequenceListData, setLeftSidePanelData] = useState([])
  const [noduleList, setNoduleList] = useState([])
  const [patients, setPatients] = useState([])
  const [noduleMapList, setNoduleMapList] = useState([])

  // 结节详情
  const [noduleInfo, setNoduleInfo] = useState(null)

  // 初始化序列和图片列表
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await getMedicalList(
  //       getURLParameters(window.location.href).resource,
  //       getURLParameters(window.location.href).type
  //     )
  //     // console.log(result)
  //     if (result.data.code === 200 && result.data.result.length > 0) {
  //       setLeftSidePanelData(result.data.result)
  //       const instanceUid = result.data.result[0].instanceUid
  //       const res = await getImageList(instanceUid)
  //       setImageList(res)
  //     }
  //   }
  //   fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // 初始化结节信息
  useEffect(() => {
    const fetchData = async () => {
      const result = await getNodeList(getURLParameters(window.location.href).id)
      if (result.data.code === 200) {
        console.log(result.data)
        const data = JSON.parse(result.data.result.text.replace(/'/g, '"'))
        formatNodeData(data)
        if (result.data.result.dicomGroupId) {
          getMedicalList(result.data.result.dicomGroupId, getURLParameters(window.location.href).type).then(res => {
            console.log(res)
          })
        }
      }
    }
    fetchData()
    // setNoduleList(defaultNoduleList)
    // setNoduleList([])
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
      if (result.data.code === 200) {
        setPatients(result.data.result)
      }
    }
    fetchData()
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
            color: item[i].noduleName === (checkNode[0] && checkNode[0].noduleName) ? undefined : 'blue',
            invalidated: true,
            handles: {
              start: {
                x: item[i].startX,
                y: item[i].startY,
                highlight: true,
                active: true,
              },
              end: {
                x: item[i].endX,
                y: item[i].endY,
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
            color: 'blue',
            invalidated: true,
            handles: {
              start: {
                x: item[i].startX,
                y: item[i].startY,
                highlight: true,
                active: true,
              },
              end: {
                x: item[i].endX,
                y: item[i].endY,
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
      const imageList = []
      res.data.result.forEach(item => {
        imageList.push(`wadouri:${item.ossUrl}`)
      })

      // console.log(imageList)
      setImagesConfig(imageList)

      // 缓存图片
      // if (imageList.length > 0) {
      //   loadAndCacheImage(cornerstone, imageList)
      // }
    }
  }

  // 序列点击事件
  const handleSequenceListClick = async instanceUid => {
    const res = await getImageList(instanceUid)
    setImageList(res)
  }

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
      setTimeout(() => {
        const viewerItemActive = document.querySelector('#viewerItemBox .item-active')
        viewerItemActive && viewerItemActive.scrollIntoView()
      }, 0)
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
    console.log(checkItme)
    setNoduleList([...noduleList])
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

  // 导出结果
  const handleSubmitResults = () => {}

  // 保存为图片
  const saveAs = (element, filename, mimetype = 'image/png') => {
    const canvas = element.querySelector('canvas')
    if (canvas.msToBlob) {
      const blob = canvas.msToBlob()

      return window.navigator.msSaveBlob(blob, filename)
    }

    const lnk = document.createElement('a')
    lnk.download = filename
    lnk.href = canvas.toDataURL(mimetype, 1)

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents')
      e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      lnk.dispatchEvent(e)
    } else if (lnk.fireEvent) {
      lnk.fireEvent('onclick')
    }
  }

  // 格式化结点数据
  const formatNodeData = data => {
    const nodulesList = []
    const nodulesMapList = []
    let index = 0
    if (data.code === 10000) {
      const res = data.detectionResult.nodulesList.sort(nestedSort('coord', 'coordZ'))
      console.log(res)
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
          state: undefined,
          review: false,
          lung: res[i].lobe.lungLocation,
          lobe: res[i].lobe.lobeLocation,
          noduleSize: res[i].noduleSize,
          featureLabelG: res[i].featureLabelG
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
  const nestedSort =
    (prop1, prop2 = null, direction = 'asc') =>
    (e1, e2) => {
      const a = prop2 ? e1[prop1][prop2] : e1[prop1],
        b = prop2 ? e2[prop1][prop2] : e2[prop1],
        sortOrder = direction === 'asc' ? 1 : -1
      return a < b ? -sortOrder : a > b ? sortOrder : 0
    }

  // 缓存图片请求池
  const loadAndCacheImage = (cornerstone, imageList) => {
    const taskPool = []
    for (let i = 0; i < imageList.length; i++) {
      cornerstone.loadAndCacheImage(imageList[i]).then(image => {
        taskPool.push(image.imageId)
        setTaskLength(taskPool.length)
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
      <Header data={patients} handleSubmitResults={handleSubmitResults} />
      <div className="viewer-center-box">
        <LeftSidePanel data={sequenceListData} handleSequenceListClick={handleSequenceListClick} />
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
        />
        <ViewerMain
          handleToolbarClick={handleToolbarClick}
          handleElementEnabledEvt={handleElementEnabledEvt}
          updateNoduleList={updateNoduleList}
          toolsConfig={toolsConfig}
          imagesConfig={imagesConfig}
          noduleList={noduleList}
        />
      </div>
      <NoduleInfo noduleInfo={noduleInfo} />
      {showMark ? (
        <MarkDialog handleCloseCallback={handleCloseCallback} handleSubmitCallback={handleSubmitCallback} />
      ) : null}
    </div>
  )
}

export default Viewer
