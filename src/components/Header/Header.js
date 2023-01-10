import React, { useState, useEffect } from 'react'
import './Header.scss'
import { Button, Image, Space, Alert, Popconfirm } from 'antd'
import { getClinicalFiles, downloadZip } from '../../api/api'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'

const Header = props => {
  const [visible, setVisible] = useState(false)
  const [fileData, setFileData] = useState([])
  const [remark, setRemark] = useState('')

  const params = qs.parse(useLocation().search)

  const handleDownLoad = () => {
    downloadZip(params.orderId, params.taskId).then(res => {
      const { result, success, message } = res.data
      if (success) {
        window.open(result, '_blank')
      } else {
        message.warning(message)
      }
    })
  }

  useEffect(() => {
    // const fetchData = async () => {
    //   const result = await getClinicalFiles(params.orderId)
    //   if (result.data.code === 500) {
    //     setFileData([])
    //   } else if (result.data.code === 200) {
    //     setFileData(result.data.result.appendix)
    //     setRemark(result.data.result.remark)
    //   }
    // }
    // fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="header-box">
      <div className="export-box">
        {remark && remark !== '' ? (
          <div className="tips-box">
            <Alert
              message={`补充说明：${remark}`}
              type="warning"
              action={
                <Space>
                  {remark.length > 20 ? (
                    <Popconfirm
                      title={
                        <>
                          <div>补充说明</div>
                          <span className="remark-content">{remark}</span>
                        </>
                      }
                      okText="确定"
                    >
                      <Button size="small" type="ghost">
                        显示全部
                      </Button>
                    </Popconfirm>
                  ) : null}
                </Space>
              }
            />
          </div>
        ) : null}
        {/* <Button disabled={fileData.length === 0} onClick={handleViewClinicalImages} style={{ marginRight: 10 }}>
          {fileData.length === 0 ? `暂无临床影像` : `查看临床影像（共${fileData.length}页）`}
        </Button> */}
        {/* <Button onClick={handleDownLoad} style={{ marginRight: 10 }}>
          影像下载
        </Button> */}
        <Button onClick={props.handleGoBackList}>返回列表</Button>
        <Button type="primary" onClick={props.handleShowModal} disabled={params.isFinish === '1'}>
          提交结果
        </Button>
      </div>

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
