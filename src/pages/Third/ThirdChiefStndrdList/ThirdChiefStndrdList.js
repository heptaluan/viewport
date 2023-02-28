import React, { useState, useEffect } from 'react'
import './ThirdChiefStndrdList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Space, Button, Select, message, Input, Tag } from 'antd'
import { getThirdChiefStndrdList } from '../../../api/api'
import MenuList from '../../../components/MenuList/MenuList'
import HeaderList from '../../../components/HeaderList/HeaderList'

const ThirdChiefStndrdList = () => {
  const [dataSource, setDataSource] = useState([])

  const columns = [
    {
      title: '审阅人',
      dataIndex: 'createBy',
    },
    {
      title: '影像编号',
      dataIndex: 'imageCode',
    },
    {
      title: '完成状态',
      dataIndex: 'isFinish',
      render: (_, record) => {
        return record.isFinish === 1 ? <span style={{ color: '#73d13d' }}>已完成</span> : <span style={{ color: '#ff4d4f' }}>未完成</span>
      },
    },
    {
      title: '完成人员',
      dataIndex: 'staff',
      render: (_, record) => {
        if (!record.staff) return
        const list = record.staff?.split(',').sort()
        const result = []
        for (let i = 0; i < list.length; i++) {
          if (list[i] === '李腾海') {
            result.push(<Tag color="#f50">李腾海</Tag>)
          } else if (list[i] === '杨帆') {
            result.push(<Tag color="#2db7f5">杨帆</Tag>)
          } else if (list[i] === '周坦峰') {
            result.push(<Tag color="#87d068">周坦峰</Tag>)
          }
        }
        return (
          <div className="table-staff">
            {result.map((n, index) => {
              return <span key={index}>{n}</span>
            })}
          </div>
        )
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleShowDetail(record)}>查看详情</a>
        </Space>
      ),
    },
  ]

  const history = useHistory()

  // 用户信息
  const [userInfo, setUserInfo] = useState('')

  const onPageChange = e => {
    const newPagination = Object.assign({}, pagination)
    newPagination.current = e.current
    newPagination.pageSize = e.pageSize
    newPagination.total = e.total
    setPagination(newPagination)
  }

  const initPagination = result => {
    let page = localStorage.getItem('ThirdChiefStndrdList') ? JSON.parse(localStorage.getItem('ThirdChiefStndrdList')) : ''
    const newPagination = Object.assign({}, pagination)
    if (page !== '') {
      newPagination.current = page.current
      newPagination.pageSize = page.pageSize
      newPagination.total = page.total
    } else {
      newPagination.current = 1
      newPagination.pageSize = 10
      newPagination.total = result.data.rows.length
    }

    if (result.data.rows.length === 0) {
      newPagination.current = 1
      newPagination.pageSize = 10
      newPagination.total = 0
    }
    setPagination(newPagination)
  }

  // 初始列表数据
  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)
    fetchList()
  }, [])

  // 分页设置
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // 查询
  const [params, setParams] = useState({
    isFinish: 0,
    imageCode: '',
    staffCount: 3,
  })

  const handleImageCodeSearch = val => {
    const newParams = Object.assign({}, params)
    newParams.imageCode = val
    setParams(newParams)
  }

  const handleIsFinishSearch = val => {
    const newParams = Object.assign({}, params)
    newParams.isFinish = val
    setParams(newParams)
  }

  const handleStaffCountSearch = val => {
    const newParams = Object.assign({}, params)
    newParams.staffCount = val
    setParams(newParams)
  }

  const handleSearch = () => {
    localStorage.setItem('ThirdChiefStndrdList', '')
    fetchList()
  }

  const handleReset = async () => {
    const newParams = {
      isFinish: 0,
      imageCode: '',
      staffCount: '',
    }
    setParams(newParams)
    localStorage.setItem('ThirdChiefStndrdList', '')
    const result = await getThirdChiefStndrdList(newParams)
    if (result.data.code === 200) {
      setDataSource([])
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // ===================================================

  // 请求筛选结果列表数据
  const fetchList = async () => {
    let page = localStorage.getItem('ThirdChiefStndrdList') ? JSON.parse(localStorage.getItem('ThirdChiefStndrdList')) : ''
    const newParams = Object.assign({}, params)
    if (page !== '') {
      newParams.imageCode = page.imageCode
      newParams.isFinish = page.isFinish
      setParams(newParams)
    }

    const result = await getThirdChiefStndrdList(newParams)
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  const handleShowDetail = record => {
    const newPagination = Object.assign({}, pagination)
    newPagination.isFinish = params.isFinish
    newPagination.imageCode = params.imageCode
    localStorage.setItem('ThirdChiefStndrdList', JSON.stringify(newPagination))
    history.push(
      `/thirdViewer?id=${record.id}&imageCode=${record.imageCode}&isFinish=${record.isFinish}&type=2&from=${history.location.pathname}`
    )
  }

  return (
    <div className="study-list-box">
      <HeaderList />
      <div className="study-list-container-wrap">
        <MenuList defaultSelectedKeys={'3-1'} userInfo={userInfo} />
        <div className="study-list-container">
          <div className="search-box-wrap">
            <div className="header"></div>
            <div className="search-box">
              <div className="srarch-label">
                <div>影像编号：</div>
                <Input
                  value={params.imageCode}
                  onChange={e => handleImageCodeSearch(e.target.value)}
                  style={{ width: 200 }}
                  placeholder="请输入影像编号"
                />
              </div>

              <div className="srarch-label">
                <div>完成状态：</div>
                <Select
                  value={params.isFinish}
                  style={{ width: 200 }}
                  onChange={handleIsFinishSearch}
                  options={[
                    {
                      value: 0,
                      label: '未完成',
                    },
                    {
                      value: 1,
                      label: '已完成',
                    },
                  ]}
                />
              </div>

              <div className="srarch-label">
                <div>医生审核结果：</div>
                <Select
                  value={params.staffCount}
                  style={{ width: 200 }}
                  onChange={handleStaffCountSearch}
                  options={[
                    {
                      value: 3,
                      label: '已完成数据',
                    },
                    {
                      value: '',
                      label: '推送数据',
                    },
                  ]}
                />
              </div>

              <Button style={{ marginLeft: 20 }} onClick={handleSearch} type="primary">
                搜索
              </Button>
              <Button onClick={handleReset} type="primary" style={{ marginLeft: 15 }}>
                重置
              </Button>
            </div>
          </div>

          <Table
            scroll={{ x: 'max-content' }}
            rowKey={record => record.id}
            dataSource={dataSource}
            columns={columns}
            onChange={onPageChange}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            onRow={record => {
              return {
                onDoubleClick: event => {
                  console.log(event)
                },
              }
            }}
            rowClassName={(record, index) => {
              return record.isOpinion === 1 && record.isFinish !== 1 ? 'table-active-list' : null
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ThirdChiefStndrdList
