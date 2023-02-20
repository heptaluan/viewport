import React, { useState, useEffect } from 'react'
import './ComparisonNoduleInfo.scss'
import { Radio, Select, Button, Input, InputNumber, Modal } from 'antd'
import { getURLParameters, formatMiniNode } from '../../../util/index'

const { TextArea } = Input

const { Option } = Select

const ComparisonNoduleInfo = props => {
  return (
    <div className="comparison-nodule-info">
      {props.noduleInfo ? (
        <>
          <div className="list">肺：{props.noduleInfo.lung}</div>
          <div className="list">肺叶：{props.noduleInfo.lobe}</div>
          <div className="list">类型：{props.noduleInfo.type}</div>
          <div className="list">浸润类型：{props.noduleInfo.newSoak}</div>
          <div className="list">大小：{props.noduleInfo.diameter}</div>
          <div className="list">
            恶性风险：
            {props.noduleInfo.risk ? `${props.noduleInfo.risk}%` : '-'}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ComparisonNoduleInfo
