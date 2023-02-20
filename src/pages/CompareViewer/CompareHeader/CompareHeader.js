import React, { useState, useEffect } from 'react'
import './CompareHeader.scss'
import { Button, Image, Space, Alert, Popconfirm, Tooltip } from 'antd'
import { getURLParameters } from '../../../util/index'
import { getClinicalFiles, downloadZip } from '../../../api/api'
import { RightCircleOutlined, FileDoneOutlined } from '@ant-design/icons'

const CompareHeader = props => {
  const [visible, setVisible] = useState(false)
  const [fileData, setFileData] = useState([])
  const [remark, setRemark] = useState('')

  const handleDownLoad = () => {
    downloadZip(getURLParameters(window.location.href).orderId, getURLParameters(window.location.href).resource).then(
      res => {
        const { result, success, message } = res.data
        if (success) {
          window.open(result, '_blank')
        } else {
          message.warning(message)
        }
      }
    )
  }


  return (
    <div className="header-box">
      <Button>
        提交数据
      </Button>
    </div>
  )
}

export default CompareHeader
