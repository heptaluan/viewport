import React from 'react'
import './Header.scss'
import { Button } from 'antd'

const Header = props => {
  return (
    <div className="header-box">
      <div className="user-content">
        姓名：{props.data.patientName} 患者编号：{props.data.archiveJobId_dictText} 性别：
        {props.data.patientSex_dictText} 年龄：{props.data.patientAge} 检查日期：{props.data.studyTime}{' '}
      </div>
      <div className="export">
        <Button type="primary" onClick={props.exportImages}>
          导出报告
        </Button>
      </div>
    </div>
  )
}

export default Header
