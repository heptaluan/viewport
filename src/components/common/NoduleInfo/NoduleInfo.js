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
          <Descriptions title="医生一（hbfyxia）" size={size} className="hbfyxia">
            <Descriptions.Item label="肺">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'hbfyxia')?.lungLocation}
            </Descriptions.Item>
            <Descriptions.Item label="肺叶">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'hbfyxia')?.lobeLocation}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'hbfyxia')?.featureLabel}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生二（doctor_lwx）" size={size} className="doctor_lwx">
            <Descriptions.Item label="肺">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_lwx')?.lungLocation}
            </Descriptions.Item>
            <Descriptions.Item label="肺叶">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_lwx')?.lobeLocation}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_lwx')?.featureLabel}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生三（doctor_diannei）" size={size} className="doctor_diannei">
            <Descriptions.Item label="肺">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_diannei')?.lungLocation}
            </Descriptions.Item>
            <Descriptions.Item label="肺叶">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_diannei')?.lobeLocation}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_diannei')?.featureLabel}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="医准结果" size={size} className="yz">
            <Descriptions.Item label="肺">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'yz')?.lungLocation}
            </Descriptions.Item>
            <Descriptions.Item label="肺叶">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'yz')?.lobeLocation}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'yz')?.featureLabel}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="点内结果" size={size} className="dn">
            <Descriptions.Item label="肺">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'dn')?.lungLocation}
            </Descriptions.Item>
            <Descriptions.Item label="肺叶">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'dn')?.lobeLocation}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'dn')?.featureLabel}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="金标准结果" size={size} className="doctor_test">
            <Descriptions.Item label="肺">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_test')?.lungLocation}
            </Descriptions.Item>
            <Descriptions.Item label="肺叶">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_test')?.lobeLocation}
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {formatNoduleInfo(props.noduleInfo.nodelist, 'doctor_test')?.featureLabel}
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : null}
    </div>
  )
}

export default NoduleInfo
