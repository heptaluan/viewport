import React from 'react'
import './NoduleInfo.scss'
import { Descriptions } from 'antd'

const size = 'small'

const NoduleInfo = props => {

  const formatNoduleInfo = (data, type) => {
    const info = data.find(item => item.name === type)
    if (info && info.value) {
      return info.value
    } else {
      return null
    }
  }

  return (
    <div className="nodule-info-box">
      {props.noduleInfo ? (
        <>
          <Descriptions title="医生一" column={2} size={size} className="xx">
            <Descriptions.Item label="肺">{formatNoduleInfo(props.noduleInfo.nodelist, 'xx')?.lungLocation}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{formatNoduleInfo(props.noduleInfo.nodelist, 'xx')?.lobeLocation}</Descriptions.Item>
            <Descriptions.Item label="类型">{formatNoduleInfo(props.noduleInfo.nodelist, 'xx')?.featureLabel}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生二" column={2} size={size} className="lwx">
            <Descriptions.Item label="肺">{formatNoduleInfo(props.noduleInfo.nodelist, 'lwx')?.lungLocation}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{formatNoduleInfo(props.noduleInfo.nodelist, 'lwx')?.lobeLocation}</Descriptions.Item>
            <Descriptions.Item label="类型">{formatNoduleInfo(props.noduleInfo.nodelist, 'lwx')?.featureLabel}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生三" column={2} size={size}>
            <Descriptions.Item label="肺">{props.noduleInfo.lung}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{props.noduleInfo.lobe}</Descriptions.Item>
            <Descriptions.Item label="类型">{props.noduleInfo.type}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生四" column={2} size={size}>
            <Descriptions.Item label="肺">{props.noduleInfo.lung}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{props.noduleInfo.lobe}</Descriptions.Item>
            <Descriptions.Item label="类型">{props.noduleInfo.type}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生五" column={2} size={size}>
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
