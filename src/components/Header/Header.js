import React, { useState, useEffect } from 'react'
import './Header.scss'
import { Button, Image } from 'antd'
import { getURLParameters } from '../../util/index'
import { getClinicalFiles } from '../../api/api'

const Header = props => {
  const [visible, setVisible] = useState(false)
  const [showClinicalFilesButton, setShowClinicalFilesButton] = useState(false)
  const [fileData, setFileData] = useState(null)

  const handleDownLoad = () => {
    const orderId = getURLParameters(window.location.href).orderId
    const domian = getURLParameters(window.location.href).url
    const token = getURLParameters(window.location.href).token
    window.open(
      `${domian}/tailai-multiomics/multiomics/medicalImage/downloadZip?token=${token}&orderId=${orderId}`,
      '_blank'
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getClinicalFiles(getURLParameters(window.location.href).orderId)
      if (result.data.code === 500) {
        setShowClinicalFilesButton(false)
      } else if (result.data.code === 200) {
        setShowClinicalFilesButton(true)
        setFileData([...result.data.result])
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleViewClinicalImages = () => {
    setVisible(true)
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
          {showClinicalFilesButton ? (
            <Button onClick={handleViewClinicalImages} style={{ marginRight: 10 }}>
              查看临床影像
            </Button>
          ) : null}
          <Button onClick={handleDownLoad} style={{ marginRight: 10 }}>
            影像下载
          </Button>
          <Button disabled={props.pageState === 'admin'} type="primary" onClick={props.handleShowModal}>
            提交审核结果
          </Button>
        </div>
      ) : null}

      <div
        style={{
          display: 'none',
        }}
      >
        <Image.PreviewGroup
          preview={{
            visible,
            onVisibleChange: vis => setVisible(vis),
          }}
        >
          {fileData?.map((item, index) => {
            return <Image key={`${index} - ${item.createTime}`} src={item.fileUrl} />
          })}
        </Image.PreviewGroup>
      </div>
    </div>
  )
}

export default Header
