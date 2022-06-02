import React from 'react'
import './Header.scss'
import { Button } from 'antd'
import { getURLParameters } from '../../util/index'

const Header = props => {
  
  const handleDownLoad = () => {
    const orderId = getURLParameters(window.location.href).orderId
    const domian = getURLParameters(window.location.href).url
    const token = getURLParameters(window.location.href).token
    window.open(`${domian}/tailai-multiomics/multiomics/medicalImage/downloadZip?token=${token}&orderId=${orderId}`, '_blank')
  }

  return (
    <div className="header-box">
      <div className="user-content">
        {props.data?.patientName ? (
          <div className="patient-detail">
            <span>姓名：{props.data.patientName}，</span>
            <span>性别：{props.data.gender_dictText}，</span>
            <span>年龄：{props.data.age}，</span>
            <span>病例编号：{props.data.medicalCaseCode}，</span>
            <span>patientId：{props.data.patientId}，</span>
            <span>检查日期：{props.data.createTime}</span>
          </div>
        ) : null}
      </div>
      {props.pageType === 'review' ? (
        <div className="export">
          <Button onClick={handleDownLoad} style={{'marginRight': 10}}>影像下载</Button>
          <Button disabled={props.pageState === 'admin'} type="primary" onClick={props.handleShowModal}>
            提交审核结果
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default Header
