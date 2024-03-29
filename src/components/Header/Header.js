import React, { useState, useEffect } from 'react'
import './Header.scss'
import { Button, Image, Space, Alert, Popconfirm } from 'antd'
// import { getClinicalFiles, downloadZip } from '../../api/api'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import { useHistory } from 'react-router-dom'

const Header = props => {
  const [visible, setVisible] = useState(false)
  const [fileData] = useState([])
  const [remark] = useState('')

  const params = qs.parse(useLocation().search)
  const history = useHistory()

  // 返回列表
  const handleGoBackList = () => {
    localStorage.setItem('record', '')
    if (params.from) {
      history.push(params.from)
    } else {
      history.push('/studyList')
    }
  }

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
        <Button onClick={handleGoBackList}>返回列表</Button>
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
