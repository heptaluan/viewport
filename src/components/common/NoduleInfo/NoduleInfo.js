import React from 'react'
import './NoduleInfo.scss'
import { Descriptions } from 'antd'

const size = 'small'

const NoduleInfo = props => {
  return (
    <div className="nodule-info-box">
      {props.noduleInfo ? (
        <>
          <Descriptions title="医生一建议：" column={2} size={size}>
            <Descriptions.Item label="肺">{props.noduleInfo.lung}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{props.noduleInfo.lobe}</Descriptions.Item>
            <Descriptions.Item label="类型">{props.noduleInfo.type}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生二建议：" column={2} size={size}>
            <Descriptions.Item label="肺">{props.noduleInfo.lung}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{props.noduleInfo.lobe}</Descriptions.Item>
            <Descriptions.Item label="类型">{props.noduleInfo.type}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生三建议：" column={2} size={size}>
            <Descriptions.Item label="肺">{props.noduleInfo.lung}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{props.noduleInfo.lobe}</Descriptions.Item>
            <Descriptions.Item label="类型">{props.noduleInfo.type}</Descriptions.Item>
          </Descriptions>
        </>
      ) : null}
    </div>
  )
}

export default NoduleInfo
