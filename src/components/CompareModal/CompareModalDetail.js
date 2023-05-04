import React, { useState, useEffect } from 'react'
import './CompareModalDetail.scss'
import { Tooltip, Select, Radio, Checkbox } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Option } = Select

const CompareModalDetail = props => {
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
    <div className="compare-modal-box-wrap">
      {props.noduleInfo ? (
        <>
          <div className="box-title">{props.index === 0 ? '李主任' : '医生'}审核结果</div>

          <div className="box-wrap">
            <div className="list-title">结节性质</div>
            <div className={`mark-box flex mb ${props.noduleInfo.chiefNodeMark === 'find' ? 'active' : ''}`}>
              <div className="mark-title" style={{ width: 90 }}>
                {props.noduleInfo.differentKey && props.noduleInfo.differentKey.split(',').includes('Feature') ? (
                  <Tooltip placement="topLeft" title={'该值李主任进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                类型
              </div>
              <div className="mark-content">
                <Select disabled size="small" style={{ width: 130, fontSize: 12 }} placeholder="请选择类型" value={props.noduleInfo.featureLabel}>
                  <Option value="肺内实性">肺内实性</Option>
                  <Option value="部分实性">部分实性</Option>
                  <Option value="磨玻璃">磨玻璃</Option>
                  <Option value="肺内钙化">肺内钙化</Option>
                  <Option value="胸膜实性">胸膜实性</Option>
                  <Option value="胸膜钙化">胸膜钙化</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </div>
            </div>
          </div>

          <div className="box-wrap">
            <div className="list-title">是否结节</div>
            <div className={`mark-box flex mb ${props.noduleInfo.chiefNodeMark === 'find' ? 'active' : ''}`}>
              <div className="mark-title" style={{ width: 400 }}>
                {props.noduleInfo.differentKey && props.noduleInfo.differentKey.split(',').includes('IsNode') ? (
                  <Tooltip placement="topLeft" title={'该值李主任进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                是否为结节
              </div>
              <div className="mark-content">{props.noduleInfo.invisable === 1 ? '否' : '是'}</div>
            </div>
          </div>

          <div className="box-wrap">
            <div className="list-title">良恶性</div>
            <div className={`mark-box flex mb ${props.noduleInfo.chiefNodeMark === 'find' ? 'active' : ''}`}>
              <div className="mark-title" style={{ width: 400 }}>
                {props.noduleInfo.differentKey && props.noduleInfo.differentKey.split(',').includes('Maligant') ? (
                  <Tooltip placement="topLeft" title={'该值李主任进行过调整'}>
                    <InfoCircleOutlined style={{ color: '#f5222d', fontSize: 12 }} />
                  </Tooltip>
                ) : null}
                {props.index === 0 ? '李主任' : '医生'}审核结果
              </div>
              <div className="mark-content">{props.noduleInfo.doctorMaligant}%</div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default CompareModalDetail
