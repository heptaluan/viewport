import React, { useState, useEffect, useRef } from 'react'
import './CompareBox.scss'
import useWindowSize from '../../hook/useWindowSize'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import MarkNoduleTool from '../../components/common/MarkNoduleTool/MarkNoduleTool'

import CompareMatchList from './CompareMatchList/CompareMatchList'
import CompareMiddleSidePanel from './CompareMiddleSidePanel/CompareMiddleSidePanel'
import CompareNoduleInfo from './CompareNoduleInfo/CompareNoduleInfo'
import CornerstoneViewport from 'react-cornerstone-viewport'
import CustomOverlay from '../../components/common/CustomOverlay/CustomOverlay'
import ScrollBar from '../../components/ScrollBar/ScrollBar'

import { getImageList, getDoctorTask, addNodeRelation, deleteNodeRelation, loadNodeRelation } from '../../api/api'
import { getURLParameters } from '../../util/index'
import { windowChange, defaultTools, loadAndCacheImage } from './util'
import { Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { imageIds } from './imageIds'
import qs from 'query-string'
import { useLocation } from 'react-router-dom'

const CompareBox = _ => {
  const size = useWindowSize()
  const history = useHistory()
  const nodeRef = useRef()
  const params = qs.parse(useLocation().search)

  const [cornerstoneElement, setCornerstoneElement] = useState(null)
  const [toolsConfig] = useState(defaultTools)
  const [imagesConfig, setImagesConfig] = useState([])
  const [noduleList, setNoduleList] = useState([])
  const [noduleMapList, setNoduleMapList] = useState([])
  const [noduleInfo, setNoduleInfo] = useState(null)

  const [sync, setSync] = useState(false)

  const [nodeRelation, setNodeRelation] = useState([])

  useEffect(() => {
    nodeRef.current = {
      noduleList,
      noduleMapList,
      imagesConfig,
      cornerstoneElement,
      sync,
      nodeRelation,
    }
  }, [noduleList, noduleMapList, imagesConfig, cornerstoneElement, sync, nodeRelation])

  // 初始化结节信息
  useEffect(() => {
    const fetchDoctorData = async () => {
      const result = await loadNodeRelation(params.oldOrdId, params.newOrdId)
      if (result.data.code === 200) {
        if (result.data.result) {
          setNodeRelation([...JSON.parse(result.data.result.nodeRelation)])
          formatOldNodeArray(JSON.parse(result.data.result.oldNodeArray), JSON.parse(result.data.result.nodeRelation))
          formatNewNodeArray(JSON.parse(result.data.result.newNodeArray), JSON.parse(result.data.result.nodeRelation))
        }
      }
    }

    const fetchOldImagehData = async () => {
      const res = await getImageList(params.oldHisId)
      setOldImageList(res)
    }

    const fetchNewImagehData = async () => {
      const res = await getImageList(params.newHisId)
      setNewImageList(res)
    }

    fetchDoctorData()
    fetchOldImagehData()
    fetchNewImagehData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 设置图片列表
  const setOldImageList = res => {
    if (res.data.code === 200 && res.data.result.length > 0) {
      const newList = res.data.result
      const imageList = []
      newList.forEach(item => {
        imageList.push(`wadouri:${item.ossUrl.replace('http://', 'https://')}`)
      })

      setImagesConfig(imageList)

      // 缓存图片
      // if (data && data.length > 0) {
      //   loadAndCacheImage(cornerstone, imageList, data)
      // }
    }
  }

  const setNewImageList = res => {
    if (res.data.code === 200 && res.data.result.length > 0) {
      const newList = res.data.result
      const imageList2 = []
      newList.forEach(item => {
        imageList2.push(`wadouri:${item.ossUrl.replace('http://', 'https://')}`)
      })

      setImagesConfig2(imageList2)

      // 缓存图片
      // if (data && data.length > 0) {
      //   loadAndCacheImage(cornerstone, imageList2, data)
      // }
    }
  }

  // 格式化结节（new -> nodulesList2）
  const formatOldNodeArray = (data, nodeRelation) => {
    const nodulesList = []
    const nodulesMapList = []

    for (let i = 0; i < data.length; i++) {
      nodulesList.push({
        num: data[i].imageIndex,
        type: data[i].featureLabel,
        risk: data[i].scrynMaligant,
        scrynMaligant: data[i].scrynMaligant,
        whuScryn: data[i].whuMaligant,
        soak: data[i].invisionClassify || '-',
        newSoak: data[i].invisionClassify || '-',
        info: '',
        markNode: '',
        checked: false,
        active: false,
        noduleName: data[i].nodeId,
        noduleNum: data[i].nodeId,
        state: true,
        lung: data[i].lungLocation,
        lobe: data[i].lobeLocation,
        diameter: data[i].diameter,
        diameterSize: formatDiameter(data[i].diameter),
        noduleSize: data[i].noduleSize,
        newDiameter: '',
        newNoduleSize: '',
        suggest: data[i].suggest,
        isFinish: data[i].isFinish,
        nodeType: data[i].isNew === 1 ? 1 : 0,
        isRelation: nodeRelation.find(item => item.nodeIdOld === data[i].nodeId) ? true : false,
      })

      // 提取结节
      const box = data[i].maxBox ? JSON.parse(data[i].maxBox.replace(/'/g, '"')) : []
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

  const formatNewNodeArray = (data, nodeRelation) => {
    const nodulesList2 = []
    const nodulesMapList2 = []

    for (let i = 0; i < data.length; i++) {
      nodulesList2.push({
        num: data[i].imageIndex,
        type: data[i].featureLabel,
        risk: data[i].scrynMaligant,
        scrynMaligant: data[i].scrynMaligant,
        whuScryn: data[i].whuMaligant,
        soak: data[i].invisionClassify,
        newSoak: data[i].invisionClassify,
        info: '',
        markNode: '',
        checked: false,
        active: false,
        noduleName: data[i].id,
        noduleNum: data[i].id,
        state: true,
        lung: data[i].lungLocation,
        lobe: data[i].lobeLocation,
        diameter: data[i].diameter,
        diameterSize: formatDiameter(data[i].diameter),
        noduleSize: data[i].noduleSize,
        newDiameter: '',
        newNoduleSize: '',
        suggest: data[i].suggest,
        isFinish: data[i].isFinish,
        nodeType: data[i].isNew === 1 ? 1 : 0,
        isRelation: nodeRelation.find(item => item.nodeIdNew === data[i].id) ? true : false,
      })

      // 提取结节
      const box = data[i].boxes ? JSON.parse(data[i].boxes.replace(/'/g, '"')) : []
      for (let j = 0; j < box.length; j++) {
        nodulesMapList2.push({
          noduleName: data[i].id,
          index: Number(box[j].index),
          startX: Number(box[j].box[1]),
          startY: Number(box[j].box[0]),
          endX: Number(box[j].box[3]),
          endY: Number(box[j].box[2]),
        })
      }
    }

    setNoduleList2([...nodulesList2])
    setNoduleMapList2([...nodulesMapList2])
  }

  // 格式化中心直径
  const formatDiameter = diameter => {
    if (diameter) {
      return Math.max(...diameter.replace('*', '').split('mm'))
    } else {
      return ''
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

  // 视窗一

  // ============================================================================

  // ============================================================================

  // ============================================================================

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

    // 同步操作，这里也需要加判断，如果有关联的才进行跳转
    if (nodeRef.current.sync) {
      if (checkItme && checkItme.isRelation) {
        const relationItem = nodeRef.current.nodeRelation.find(item => item.nodeIdOld === checkItme.noduleNum).nodeIdNew
        const item2Index = nodeRef2.current.noduleList2.findIndex(item => item.noduleNum === relationItem)
        console.log(item2Index)
        onCheckChange2(item2Index, nodeRef2.current.noduleList2[item2Index].num)
      }
      //
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
        windowChange(cornerstoneElement, newImage.detail.image, 2)
        addNodeTool(cornerstoneElement, index, nodeRef.current.noduleList, nodeRef.current.noduleMapList)
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })
      }, 0)
    })

    cornerstoneElement.addEventListener('cornerstoneimagerendered', imageRenderedEvent => {
      const curImageId = imageRenderedEvent.detail.image.imageId
      const index = imagesConfig.findIndex(item => item === curImageId)

      // 同步
      if (nodeRef.current.sync && nodeRef2.current.cornerstoneElement2) {
        changeRelationImage(index, nodeRef2.current.cornerstoneElement2, nodeRef2.current.imagesConfig2)
      }
    })
  }

  // 切换第二视图
  const changeRelationImage = (index, cornerstoneElement, imagesConfig) => {
    const checkItme = nodeRef.current.noduleList.find(item => item.checked === true)
    if (checkItme && checkItme.isRelation) {
      const relationItem = nodeRef.current.nodeRelation.find(item => item.nodeIdOld === checkItme.noduleNum).nodeIdNew
      const item2 = nodeRef2.current.noduleList2.find(item => item.noduleNum === relationItem)
      let activeIndex = Number(item2.num) + index - Number(checkItme.num)
      if (activeIndex >= nodeRef2.current.imagesConfig2.length) {
        activeIndex = nodeRef2.current.imagesConfig2.length - 1
      } else if (activeIndex <= 0) {
        activeIndex = 0
      }
      changeActive2Image(activeIndex, cornerstoneElement, imagesConfig)
    } else {
      changeActive2Image(index, cornerstoneElement, imagesConfig)
    }
  }

  const changeActive2Image = (index, cornerstoneElement, imagesConfig) => {
    cornerstone.loadImage(imagesConfig[index]).then(image => {
      cornerstone.displayImage(cornerstoneElement, image)
      cornerstoneTools.addStackStateManager(cornerstoneElement, ['stack'])
      cornerstoneTools.addToolState(cornerstoneElement, 'stack', {
        currentImageIdIndex: Number(index),
        imageIds: imagesConfig,
      })
    })
  }

  // 视窗二

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

  // ============================================================================================

  // ============================================================================================

  // ============================================================================================

  const { confirm } = Modal

  const fetchDoctorData = async () => {
    const result = await loadNodeRelation(params.oldOrdId, params.newOrdId)
    if (result.data.code === 200) {
      if (result.data.result) {
        setNodeRelation([...JSON.parse(result.data.result.nodeRelation)])
        formatOldNodeArray(JSON.parse(result.data.result.oldNodeArray), JSON.parse(result.data.result.nodeRelation))
        formatNewNodeArray(JSON.parse(result.data.result.newNodeArray), JSON.parse(result.data.result.nodeRelation))
      }
    }
  }

  const handleAddRelationship = () => {
    const checkItem1 = nodeRef.current.noduleList.find(item => item.checked === true)
    const checkItem2 = nodeRef2.current.noduleList2.find(item => item.checked === true)

    if (!checkItem1) {
      message.warning(`请先选择结节列表一当中需要关联的结节`)
      return false
    }

    if (!checkItem2) {
      message.warning(`请先选择结节列表二当中需要关联的结节`)
      return false
    }

    confirm({
      title: '结节关联',
      icon: <ExclamationCircleOutlined />,
      content: `是否关联结节列表一中心帧为 ${
        nodeRef.current.imagesConfig.length - Number(checkItem1.num)
      } 和结节列表二中心帧为 ${nodeRef2.current.imagesConfig2.length - Number(checkItem2.num)} 的结节？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const postData = {
          nodeIdOld: checkItem1.noduleNum,
          nodeIdNew: checkItem2.noduleNum,
          orderIdNew: params.newOrdId,
          orderIdOld: params.oldOrdId,
          dicomIdNew: params.newHisId,
          dicomIdOld: params.oldHisId,
        }
        addNodeRelation(postData).then(res => {
          if (res.data.code === 200) {
            fetchDoctorData()
            message.success('关联成功！')
          } else {
            message.error(res.data.message)
          }
        })
      },
    })
  }

  const handleDelRelationship = () => {
    const checkItem1 = nodeRef.current.noduleList.find(item => item.checked === true)
    console.log(checkItem1)

    if (!checkItem1) {
      message.warning(`请选择结节列表一当中已经关联的结节进行解绑`)
      return false
    }

    if (!checkItem1.isRelation) {
      message.warning(`请选择结节列表一当中已经关联的结节进行解绑`)
      return false
    }

    confirm({
      title: '结节解绑',
      icon: <ExclamationCircleOutlined />,
      content: `是否解除结节列表一中心帧为 ${
        nodeRef.current.imagesConfig.length - Number(checkItem1.num)
      } 的关联结节？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const relationItem = nodeRef.current.nodeRelation.find(item => item.nodeIdOld === checkItem1.noduleNum)
        deleteNodeRelation(relationItem.id).then(res => {
          if (res.data.code === 200) {
            fetchDoctorData()
            message.success('解除关联成功！')
          } else {
            message.error(res.data.message)
          }
        })
      },
    })
  }

  return (
    <>
      <div className="header-box">
        <div className="back-btn">
          <Button
            className="add-relationship"
            onClick={e =>
              history.push(
                `/viewer/1?backType=${params.backType}&doctorId=${params.doctorId}&id=${params.id}&orderId=${params.orderId}&page=${params.page}&resource=${params.resource}&taskId=${params.taskId}&token=${params.token}&url=${params.url}&user=${params.user}`
              )
            }
          >
            返回
          </Button>
        </div>
        <div className="btn-group">
          <Button style={{ marginRight: 15 }} onClick={e => handleAddRelationship()}>
            关联结节
          </Button>
          <Button style={{ marginRight: 15 }} onClick={e => handleDelRelationship()}>
            取消关联
          </Button>
          <Button onClick={e => setSync(!sync)}>{sync ? '取消同步' : '开启同步'}</Button>
        </div>
      </div>
      <div className="compare-viewer-box">
        {imagesConfig.length === 0 ? (
          <div className="loading">
            <span>正在加载中，请稍后……</span>
          </div>
        ) : null}
        <div className="box1">
          {imagesConfig.length !== 0 && imagesConfig2.length !== 0 ? (
            <>
              <CompareMiddleSidePanel
                onCheckChange={onCheckChange}
                noduleList={noduleList}
                imagesConfig={imagesConfig}
                title={'结节列表一'}
              />
              {/* <ScrollBar noduleList={noduleList} imageIds={imagesConfig} handleScorllClicked={handleScorllClicked} /> */}
              <CornerstoneViewport
                viewportOverlayComponent={CustomOverlay}
                onElementEnabled={elementEnabledEvt => handleElementEnabledEvt(elementEnabledEvt)}
                tools={toolsConfig}
                imageIds={imagesConfig}
                style={{
                  height: `${(size.height - 50) / 2}px`,
                  flex: '1',
                }}
              />
              <CompareNoduleInfo noduleInfo={noduleInfo} />
            </>
          ) : null}
        </div>
        <div className="box2">
          {imagesConfig.length !== 0 && imagesConfig2.length !== 0 ? (
            <>
              {/* <ScrollBar noduleList={noduleList2} imageIds={imagesConfig2} handleScorllClicked={handleScorllClicked2} /> */}
              <CompareMiddleSidePanel
                onCheckChange={onCheckChange2}
                noduleList={noduleList2}
                imagesConfig={imagesConfig2}
                title={'结节列表二'}
              />
              <CornerstoneViewport
                viewportOverlayComponent={CustomOverlay}
                onElementEnabled={elementEnabledEvt => handleElementEnabledEvt2(elementEnabledEvt)}
                tools={toolsConfig}
                imageIds={imagesConfig2}
                style={{
                  height: `${(size.height - 50) / 2}px`,
                  flex: '1',
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
