import React, { useState, useEffect } from 'react'
import './MissionList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Select, Button, Space, message, Input } from 'antd'
import { getMissionList } from '../../api/api'
import MenuList from '../../components/MenuList/MenuList'
import HeaderList from '../../components/HeaderList/HeaderList'

const MissionList = () => {
  const [dataSource, setDataSource] = useState([])

  const doctorColumns = [
    {
      title: '良性样本Id',
      dataIndex: 'kyPrimaryId',
    },
    {
      title: '审阅人',
      dataIndex: 'createBy',
    },
    {
      title: '是否完成',
      dataIndex: 'isFinish',
      render: (_, record) => {
        return record.isFinish === 1 ? (
          <span style={{ color: '#73d13d' }}>完成</span>
        ) : (
          <span style={{ color: '#ff4d4f' }}>未完成</span>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        const t1 = new Date(a.createTime).getTime()
        const t2 = new Date(b.createTime).getTime()
        return t1 - t2
      },
      createTime: ['descend', 'ascend'],
      showSorterTooltip: false,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleShowDoctorDetail(record)}>查看详情</a>
        </Space>
      ),
    },
  ]

  const history = useHistory()
  const [userInfo, setUserInfo] = useState('')

  const initPagination = result => {
    let page = localStorage.getItem('pagination') ? JSON.parse(localStorage.getItem('pagination')) : ''
    const newPagination = Object.assign({}, pagination)
    if (page) {
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

  // 获取列表数据
  const fetchMissionList = async () => {
    const result = await getMissionList(isFinish, searchId)
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      localStorage.setItem('info', '')
      localStorage.setItem('username', '')
      localStorage.setItem('pagination', '')
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 初始用户数据
  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)

    fetchMissionList()
  }, [])

  // 分页设置
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const onPageChange = e => {
    const newPagination = Object.assign({}, pagination)
    newPagination.current = e.current
    newPagination.pageSize = e.pageSize
    newPagination.total = e.total
    localStorage.setItem('pagination', JSON.stringify(newPagination))
    setPagination(newPagination)
  }

  // 查询
  const [isFinish, setIsFinish] = useState(0)
  const [searchId, setSearchId] = useState('')

  const handleIsFinishSearch = val => {
    setIsFinish(val)
  }

  const handleDoctorIdSearch = val => {
    setSearchId(val)
  }

  const handleSearch = () => {
    localStorage.setItem('pagination', '')
    fetchMissionList()
  }

  const handleReset = async () => {
    const isFinish = 0
    setIsFinish(isFinish)
    setSearchId('')
    localStorage.setItem('pagination', '')
    const result = await getMissionList(isFinish, '')
    if (result.data.code === 200) {
      setDataSource([])
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      localStorage.setItem('info', '')
      localStorage.setItem('username', '')
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 普通医生详情
  const handleShowDoctorDetail = record => {
    localStorage.setItem('record', JSON.stringify(record))
    localStorage.setItem('pagination', JSON.stringify(pagination))
    history.push(`/viewer?id=${record.id}&type=mission`)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }

  return (
    <div className="study-list-box">
      <HeaderList />
      <div className="study-list-container-wrap">
        <MenuList defaultSelectedKeys={'5'} userInfo={userInfo} />
        <div className="study-list-container">
          <div className="search-box-wrap">
            <div className="header"></div>
            <div className="search-box">
              <Select
                value={isFinish}
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
              <Input
                value={searchId}
                onChange={e => handleDoctorIdSearch(e.target.value)}
                style={{ width: 200, marginLeft: 15 }}
                placeholder="请输入良性样本Id"
              />
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
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            onChange={onPageChange}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
            }}
            rowKey={record => (userInfo === 'chief' ? record.orderId : record.id)}
            dataSource={dataSource}
            columns={doctorColumns}
            onRow={record => {
              return {
                onDoubleClick: event => {
                  console.log(event)
                },
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MissionList
