import React, { useState, useEffect } from 'react'
import './ThirdNoduleInfo.scss'
import { Tooltip, Select, Button, Radio, Segmented, Checkbox, Cascader } from 'antd'
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
            <div className="list-title">发现</div>
            <div className={`mark-box flex mb ${props.noduleInfo.chiefNodeMark === 'find' ? 'active' : ''}`}>
              <div className="mark-title">
                {props.noduleInfo.difficultyLevel !== props.noduleInfo.difficultyLevelOrigin ? (
                  <Tooltip placement="topLeft" title={'该值进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                检测难易度
              </div>
              <div className="mark-content">
                <Select
                  size="small"
                  style={{ width: 110, fontSize: 12 }}
                  placeholder="请选择形态分叶"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'difficultyLevel', props.index, props.user)}
                  value={props.noduleInfo.difficultyLevel}
                  dropdownStyle={{
                    zoom: 0.9
                  }}
                >
                  <Option value="非常微妙">非常微妙</Option>
                  <Option value="适度微妙">适度微妙</Option>
                  <Option value="微妙">微妙</Option>
                  <Option value="中度明显">中度明显</Option>
                  <Option value="显而易见">显而易见</Option>
                </Select>
              </div>
            </div>

            <div className={`mark-box flex mb ${props.noduleInfo.chiefNodeMark === 'size' ? 'active' : ''}`}>
              <div className="mark-title">
                {props.noduleInfo.size !== props.noduleInfo.sizeOrigin ? (
                  <Tooltip placement="topLeft" title={'该值进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                结节大小
              </div>
              <div className="mark-content">
                <Select
                  size="small"
                  style={{ width: 110, fontSize: 12 }}
                  placeholder="请选择形态分叶"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'size', props.index, props.user)}
                  value={props.noduleInfo.size}
                  dropdownStyle={{
                    zoom: 0.9
                  }}
                >
                  <Option value="微小结节">微小结节</Option>
                  <Option value="小结节">小结节</Option>
                  <Option value="结节/大结节">结节/大结节</Option>
                  <Option value="肿块（大于 30mm）">肿块（大于 30mm）</Option>
                </Select>
              </div>
            </div>
          </div>

          <div className="box-wrap">
            <div className="list-title">外观特征</div>

            <div className={`mark-box flex mb ${props.noduleInfo.chiefNodeMark.split(',').includes('shape') ? 'active' : ''}`}>
              <div className="mark-title">
                {props.noduleInfo.paging !== props.noduleInfo.pagingOrigin ? (
                  <Tooltip placement="topLeft" title={'该值进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                形态分叶
              </div>
              <div className="mark-content">
                <Select
                  // disabled={isMiniNode || difficultyLevel}
                  size="small"
                  style={{ width: 110, fontSize: 12 }}
                  placeholder="请选择形态分叶"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'paging', props.index, props.user)}
                  value={props.noduleInfo.paging}
                  dropdownStyle={{
                    zoom: 0.9
                  }}
                >
                  <Option value="无分叶">无分叶</Option>
                  <Option value="浅分叶">浅分叶</Option>
                  <Option value="中度分叶">中度分叶</Option>
                  <Option value="明显分叶">明显分叶</Option>
                  <Option value="深度分叶">深度分叶</Option>
                </Select>
              </div>
            </div>
            <div className={`mark-box flex mb ${props.noduleInfo.chiefNodeMark.split(',').includes('spherical') ? 'active' : ''}`}>
              <div className="mark-title">
                {props.noduleInfo.sphere !== props.noduleInfo.sphereOrigin ? (
                  <Tooltip placement="topLeft" title={'该值进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                形状
              </div>
              <div className="mark-content">
                <Select
                  size="small"
                  style={{ width: 110, fontSize: 12 }}
                  placeholder="请选择形状"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'sphere', props.index, props.user)}
                  value={props.noduleInfo.sphere}
                  dropdownStyle={{
                    zoom: 0.9
                  }}
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
            <div className={`mark-box flex mb ${props.noduleInfo.chiefNodeMark.split(',').includes('edge') ? 'active' : ''}`}>
              <div className="mark-title">
                {props.noduleInfo.rag !== props.noduleInfo.ragOrigin ? (
                  <Tooltip placement="topLeft" title={'该值进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                边缘/毛刺
              </div>
              <div className="mark-content">
                <Select
                  size="small"
                  allowClear
                  style={{ width: 110, fontSize: 12 }}
                  placeholder="请选择边缘/毛刺"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'rag', props.index, props.user)}
                  value={props.noduleInfo.rag}
                  dropdownStyle={{
                    zoom: 0.9
                  }}
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

            <div className={`mark-box left flex mb ${props.noduleInfo.chiefNodeMark.split(',').includes('edge0') ? 'active' : ''}`}>
              <div className="mark-title">
                {props.noduleInfo.rag0 !== props.noduleInfo.rag0Origin ? (
                  <Tooltip placement="topLeft" title={'该值进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                晕征
              </div>
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

            <div className={`mark-box left flex mb ${props.noduleInfo.chiefNodeMark.split(',').includes('burr') ? 'active' : ''}`}>
              <div className="mark-title">
                {props.noduleInfo.spinous !== props.noduleInfo.spinousOrigin ? (
                  <Tooltip placement="topLeft" title={'该值进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                棘突
                <br />
                (分级)
              </div>
              <div className="mark-content">
                <Radio.Group
                  options={[
                    { label: '非常微妙', value: '非常微妙' },
                    { label: '适度微妙', value: '适度微妙' },
                    { label: '微妙', value: '微妙' },
                    { label: '中度明显', value: '中度明显' },
                    { label: '显而易见', value: '显而易见' },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e.target.value, 'spinous', props.index, props.user)}
                  value={props.noduleInfo.spinous}
                />
              </div>
            </div>
          </div>

          <div className="box-wrap">
            <div className="list-title">内部特征</div>
            <div className={`mark-box flex left mb ${props.noduleInfo.chiefNodeMark.split(',').includes('relation') ? 'active' : ''}`}>
              <div className="mark-title">
                {props.noduleInfo.structuralRelation.sort().join(',') !== props.noduleInfo.structuralRelationOrigin.sort().join(',') ? (
                  <Tooltip placement="topLeft" title={'该值进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                结构关系
              </div>
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
