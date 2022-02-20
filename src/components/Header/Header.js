import React from 'react'
import './Header.scss'
import { Button } from 'antd'

const Header = props => {
  return (
    <div className="header-box">
      <div className="user-content">
        {props.data?.length === 0 ? null : (
          <span>
            姓名：{props.data.patientName} 患者编号：{props.data.archiveJobId_dictText} 性别：
            {props.data.patientSex_dictText} 年龄：{props.data.patientAge} 检查日期：{props.data.studyTime}{' '}
          </span>
        )}
      </div>
      {props.pageType === 'review' ? (
        <div className="export">
          <Button type="primary" onClick={props.handleShowModal}>
            提交审核结果
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default Header
