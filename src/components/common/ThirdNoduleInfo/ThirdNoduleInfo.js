import React, { useState, useEffect } from 'react'
import './ThirdNoduleInfo.scss'
import { Slider, Select, Button, Radio, Segmented, Checkbox, Cascader } from 'antd'
import { formatNodeSize, formatDanger, formatNodeTypeRemark } from '../../../util/index'

const { Option } = Select

const ThirdNoduleInfo = props => {
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

  return (
    <div className="third-mark-box-wrap">
      {props.noduleInfo ? (
        <>
          <div className="box-title">{props.user}医生审核结果</div>

          <div className="box-wrap">
            <div className="list-title">外观特征</div>

            <div className="mark-box flex mb">
              <div className="mark-title">形态分叶</div>
              <div className="mark-content">
                <Select
                  // disabled={isMiniNode || difficultyLevel}
                  size="small"
                  style={{ width: 198, fontSize: 12 }}
                  placeholder="请选择形态分叶"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'paging', props.index, props.user)}
                  value={props.noduleInfo.paging}
                >
                  <Option value="无分叶">无分叶</Option>
                  <Option value="浅分叶">浅分叶</Option>
                  <Option value="中度分叶">中度分叶</Option>
                  <Option value="明显分叶">明显分叶</Option>
                  <Option value="深度分叶">深度分叶</Option>
                </Select>
              </div>
            </div>
            <div className="mark-box flex mb">
              <div className="mark-title">形状</div>
              <div className="mark-content">
                <Select
                  size="small"
                  style={{ width: 198, fontSize: 12 }}
                  placeholder="请选择形状"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'sphere', props.index, props.user)}
                  value={props.noduleInfo.sphere}
                >
                  <Option value="长条形">长条形</Option>
                  <Option value="不规则形">不规则形</Option>
                  <Option value="近卵形">近卵形</Option>
                  <Option value="卵形">卵形</Option>
                  <Option value="近球形">近球形</Option>
                  <Option value="球形">球形</Option>
                </Select>
              </div>
            </div>
            <div className="mark-box flex mb">
              <div className="mark-title">边缘/毛刺</div>
              <div className="mark-content">
                <Select
                  size="small"
                  allowClear
                  style={{ width: 198, fontSize: 12 }}
                  placeholder="请选择边缘/毛刺"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'rag', props.index, props.user)}
                  value={props.noduleInfo.rag}
                  options={[
                    {
                      label: '光整（无毛刺）',
                      options: [{ label: '光整（无毛刺）', value: '光整（无毛刺）' }],
                    },
                    {
                      label: '短毛刺',
                      options: [
                        { label: '不明显的毛刺', value: '不明显的毛刺' },
                        { label: '有毛刺', value: '有毛刺' },
                        { label: '较明显有毛刺', value: '较明显有毛刺' },
                        { label: '明显毛刺', value: '明显毛刺' },
                      ],
                    },
                  ]}
                ></Select>
              </div>
            </div>

            <div className="mark-box mb">
              <div className="mark-title w250 mb">棘突（分级）</div>
              <div className="mark-content">
                <Segmented
                  onChange={e => props.handleUpdateNoduleInfo(e, 'spinous', props.index, props.user)}
                  value={props.noduleInfo.spinous}
                  size="small"
                  options={['非常微妙', '适度微妙', '微妙', '中度明显', '显而易见']}
                  style={{ fontSize: 12 }}
                />
              </div>
            </div>
          </div>

          <div className="box-wrap">
            <div className="list-title" style={{ marginBottom: 5 }}>
              结节类型
            </div>
            <div className="mark-box flex">
              <div className="mark-content">
                <Select
                  size="small"
                  style={{ width: 198, fontSize: 12 }}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'nodeType', props.index, props.user)}
                  value={props.noduleInfo.nodeType}
                  placeholder="请选择结节类型"
                >
                  <Option value="肺内实性">肺内实性</Option>
                  <Option value="部分实性">部分实性</Option>
                  <Option value="磨玻璃">磨玻璃</Option>
                  <Option value="肺内钙化">肺内钙化</Option>
                  <Option value="胸膜钙化">胸膜钙化</Option>
                  <Option value="胸膜实性">胸膜实性</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </div>
            </div>

            {props.noduleInfo.nodeType === '部分实性' ||
            props.noduleInfo.nodeType === '肺内钙化' ||
            props.noduleInfo.nodeType === '胸膜钙化' ? (
              <div className="mark-box">
                <div className="mark-title" style={{ width: 320, marginTop: 8 }}>
                  {formatNodeTypeTitle(props.noduleInfo.nodeType)}，目前所选分级：
                  {formatNodeTypeRemark(Number(props.noduleInfo.nodeTypeRemark))}
                </div>
                <div className="mark-content" style={{ width: 310 }}>
                  <Slider
                    marks={{
                      0: 0,
                      25: 25,
                      50: 50,
                      75: 75,
                      100: 100,
                    }}
                    included={false}
                    onChange={e => props.handleUpdateNoduleInfo(e, 'nodeTypeRemark', props.index, props.user)}
                    value={props.noduleInfo.nodeTypeRemark}
                  />
                </div>
                <div className="tips">
                  <span
                    className={`${
                      props.noduleInfo.nodeTypeRemark >= 0 && props.noduleInfo.nodeTypeRemark < 25 ? 'active' : ''
                    }`}
                  >
                    非常微妙（0 - 24）
                  </span>
                  <br />
                  <span
                    className={`${
                      props.noduleInfo.nodeTypeRemark >= 25 && props.noduleInfo.nodeTypeRemark < 50 ? 'active' : ''
                    }`}
                  >
                    适度微妙（25 - 49）
                  </span>
                  <br />
                  <span
                    className={`${
                      props.noduleInfo.nodeTypeRemark >= 50 && props.noduleInfo.nodeTypeRemark < 75 ? 'active' : ''
                    }`}
                  >
                    微妙（50 - 74）
                  </span>
                  <br />
                  <span
                    className={`${
                      props.noduleInfo.nodeTypeRemark >= 75 && props.noduleInfo.nodeTypeRemark < 100 ? 'active' : ''
                    }`}
                  >
                    中度明显（75 - 99）
                  </span>
                  <br />
                  <span className={`${props.noduleInfo.nodeTypeRemark >= 100 ? 'active' : ''}`}>显而易见（100）</span>
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ThirdNoduleInfo
