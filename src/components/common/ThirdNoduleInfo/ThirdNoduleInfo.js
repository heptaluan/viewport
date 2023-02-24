import React, { useState, useEffect } from 'react'
import './ThirdNoduleInfo.scss'
import { Slider, Select, Button, Radio, Segmented, Checkbox, Cascader } from 'antd'
import { formatNodeSize, formatDanger, formatNodeTypeRemark } from '../../../util/index'
import { InfoCircleOutlined } from '@ant-design/icons'

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
              <div className="mark-title">
                {props.noduleInfo.paging !== props.noduleInfo.pagingOrigin ? (
                  <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12, marginRight: 2 }} />
                ) : null}
                形态分叶
              </div>
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
              <div className="mark-title">
                {props.noduleInfo.sphere !== props.noduleInfo.sphereOrigin ? (
                  <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12, marginRight: 2 }} />
                ) : null}
                形状
              </div>
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
              <div className="mark-title">
                {props.noduleInfo.rag !== props.noduleInfo.ragOrigin ? (
                  <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12, marginRight: 2 }} />
                ) : null}
                边缘/毛刺
              </div>
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

            <div className="mark-box flex left mb">
              <div className="mark-title">晕征</div>
              <div className="mark-content">
                <Radio.Group
                  options={[
                    { label: '无晕征', value: '无晕征' },
                    { label: '有晕征', value: '有晕征' },
                    { label: '反晕征', value: '反晕征' },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e.target.value, 'rag0', props.index, props.user)}
                  value={props.noduleInfo.rag0}
                />
              </div>
            </div>

            <div className="mark-box mb">
              <div className="mark-title w250 mb">
                {props.noduleInfo.spinous !== props.noduleInfo.spinousOrigin ? (
                  <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12, marginRight: 2 }} />
                ) : null}
                棘突（分级）
              </div>
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
            <div className="list-title">内部特征</div>
            <div className="mark-box flex left">
              <div className="mark-title">结构关系</div>
              <div className="mark-content">
                <Checkbox.Group
                  options={[
                    { label: '侵犯血管', value: '侵犯血管' },
                    { label: '内有血管穿行', value: '内有血管穿行' },
                    { label: '内有支气管穿行', value: '内有支气管穿行' },
                    { label: '支气管壁增厚', value: '支气管壁增厚' },
                    { label: '血管局部增粗', value: '血管局部增粗' },
                    { label: '血管贴边', value: '血管贴边' },
                    { label: '无特殊', value: '无特殊' },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'structuralRelation', props.index, props.user)}
                  value={props.noduleInfo.structuralRelation}
                />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ThirdNoduleInfo
