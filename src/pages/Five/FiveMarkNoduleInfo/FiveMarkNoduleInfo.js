import React, { useState, useEffect, useRef } from 'react'
import './FiveMarkNoduleInfo.scss'
import { Slider, Select, Button, Radio, Segmented, Checkbox, Cascader, Modal } from 'antd'
import { formatNodeSize, formatNodeTypeRemark } from '../../../util/index'
import Draggable from 'react-draggable'
// import ResultNoduleInfo from '../ResultNoduleInfo/ResultNoduleInfo'

const { Option } = Select

const FiveMarkNoduleInfo = props => {
  // ==================================================
  // ==================================================

  // 格式化标题
  const formatNodeTypeTitle = val => {
    if (val === '部分实性') {
      return '实性成分比例'
    } else if (val === '肺内钙化') {
      return '肺内钙化程度分级'
    } else if (val === '胸膜钙化') {
      return '胸膜钙化程度分级'
    }
  }

  // 微小结节
  const [isMiniNode, setIsMiniNode] = useState(false)

  // 发现难易度
  const [difficultyLevel, setDifficultyLevel] = useState(false)

  // 微小结节处理
  useEffect(() => {
    if (formatNodeSize(props.noduleInfo?.size) === '微小结节') {
      setIsMiniNode(true)
      props.handleResetMiniNode()
    } else {
      setIsMiniNode(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.noduleInfo?.size])

  // 发现难易度处理
  useEffect(() => {
    if (props.noduleInfo?.difficultyLevel === '非常微妙') {
      setDifficultyLevel(true)
      props.handleResetDifficultyLevel()
    } else {
      setDifficultyLevel(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.noduleInfo?.difficultyLevel])

  // 查看复核结果
  const [openResult, setOpenResult] = useState(false)
  const [resultDisabled, setResultDisabled] = useState(false)

  const draggleResultRef = useRef(null)

  const handleResultCancel = _ => {
    setOpenResult(false)
  }

  const handleShowResultModal = _ => {
    setOpenResult(true)
  }

  const formatDanger = val => {
    if (val === 0) {
      return '良性'
    } else if (val >= 1) {
      return '恶性'
    }
  }

  return (
    <div className="mark-box-wrap">
      {props.noduleInfo ? (
        <>
          <div className="box-title">
            肺结节标注标签{' '}
            {/* {props.noduleInfo.state ? (
              <Button
                className="show-result-btn"
                size="small"
                onClick={e => handleShowResultModal()}
                style={{ fontSize: 12, position: 'absolute', right: 0 }}
              >
                查看审核结果
              </Button>
            ) : null} */}
          </div>

          <Modal
            title={
              <div
                style={{
                  width: '100%',
                  cursor: 'move',
                }}
                onMouseOver={() => {
                  if (resultDisabled) {
                    setResultDisabled(false)
                  }
                }}
                onMouseOut={() => {
                  setResultDisabled(true)
                }}
                onFocus={() => {}}
                onBlur={() => {}}
              >
                查看审核结果
              </div>
            }
            visible={openResult}
            modalRender={modal => (
              <Draggable>
                <div ref={draggleResultRef}>{modal}</div>
              </Draggable>
            )}
            mask={false}
            maskClosable={false}
            width={470}
            onCancel={handleResultCancel}
            footer={[
              <Button key="back" onClick={e => setOpenResult(false)}>
                关闭
              </Button>,
            ]}
          >
            {/* <ResultNoduleInfo noduleInfo={props.resultNoduleInfo} /> */}
          </Modal>

          <div className="box-wrap">
            <div className="list-title" style={{ marginBottom: 5 }}>
              良恶性
            </div>
            <div className="mark-box">
              <div className="mark-title" style={{ width: 300 }}>
                危险程度（分级），目前所选分级：
                {/* <span style={{ color: '#ff4d4f' }}> */}
                {formatDanger(Number(props.noduleInfo.danger))}
                {/* </span> */}
              </div>
              <div className="mark-content" style={{ width: 310 }}>
                <Slider
                  max={100}
                  marks={{
                    0: 0,
                    99: 99,
                  }}
                  included={false}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'danger')}
                  value={props.noduleInfo.danger}
                  step={null}
                />
              </div>
            </div>
            <div className="tips">
              <span className={`${props.noduleInfo.danger === 0 ? 'active' : ''}`}>良性，对应概率：0</span>
              <br />
              <span className={`${props.noduleInfo.danger >= 1 ? 'active' : ''}`}>恶性，对应概率：99</span>
            </div>
          </div>

          <div className="mark-box">
            <div className="mark-title w250"></div>
            <div className="mark-content">
              <Button
                style={{ fontSize: 12 }}
                disabled={props.noduleInfo.state}
                size="small"
                onClick={props.updateSingleNodeResult}
              >
                提交当前结节
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default FiveMarkNoduleInfo
