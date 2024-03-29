import React, { useState, useEffect } from 'react'
import './StudyList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Select, Button, Space, message, Input } from 'antd'
import { getChiefList, getDoctorList } from '../../api/api'
import MenuList from '../../components/MenuList/MenuList'
import HeaderList from '../../components/HeaderList/HeaderList'

const StudyList = () => {
  const [dataSource, setDataSource] = useState([])

  const chiefColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (_, record) => {
        return record.sex === '1' ? '男' : '女'
      },
    },
    {
      title: '选用状态',
      dataIndex: 'isKy',
      render: (_, record) => {
        return record.isKy === 1 ? <span style={{ color: '#73d13d' }}>已选用</span> : <span style={{ color: '#ff4d4f' }}>未选用</span>
      },
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
    },
    {
      title: '病例编号',
      dataIndex: 'code',
    },
    {
      title: '病人编号',
      dataIndex: 'pcode',
    },
    {
      title: '影像来源医院',
      dataIndex: 'source',
    },
    {
      title: '订单创建日期',
      dataIndex: 'orderCreateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleShowChiefDetail(record)}>查看详情</a>
        </Space>
      ),
    },
  ]

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
        return record.isFinish === 1 ? <span style={{ color: '#73d13d' }}>完成</span> : <span style={{ color: '#ff4d4f' }}>未完成</span>
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
    let page = localStorage.getItem('StudyList') ? JSON.parse(localStorage.getItem('StudyList')) : ''
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

  // 获取总医生列表数据
  const fetchChiefList = async () => {
    const result = await getChiefList(isChiefFinish)
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 获取普通医生列表数据
  const fetchDoctorList = async () => {
    const result = await getDoctorList(isFinish, searchId)
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 初始用户数据
  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)

    if (info === 'chief') {
      fetchChiefList()
    } else if (info === 'doctor') {
      fetchDoctorList()
    }
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
    localStorage.setItem('StudyList', JSON.stringify(newPagination))
    setPagination(newPagination)
  }

  // 医生查询
  const [isFinish, setIsFinish] = useState(0)
  const [searchId, setSearchId] = useState('')

  const handleIsFinishSearch = val => {
    setIsFinish(val)
  }

  const handleDoctorIdSearch = val => {
    setSearchId(val)
  }

  const handleSearch = () => {
    localStorage.setItem('StudyList', '')
    fetchDoctorList()
  }

  const handleReset = async () => {
    const isFinish = 0
    setIsFinish(isFinish)
    setSearchId('')
    localStorage.setItem('StudyList', '')
    const result = await getDoctorList(isFinish, searchId)
    if (result.data.code === 200) {
      setDataSource([])
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 主任医师查询
  const [isChiefFinish, setIsChiefFinish] = useState(0)

  const handleIsChiefFinishSearch = val => {
    setIsChiefFinish(val)
  }

  const handleChiefSearch = () => {
    localStorage.setItem('StudyList', '')
    fetchChiefList()
  }

  const handleChiefReset = async () => {
    const isChiefFinish = 0
    setIsChiefFinish(isChiefFinish)
    localStorage.setItem('StudyList', '')
    const result = await getChiefList(isChiefFinish)
    if (result.data.code === 200) {
      setDataSource([])
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 总医生详情
  const handleShowChiefDetail = record => {
    localStorage.setItem('record', JSON.stringify(record))
    localStorage.setItem('StudyList', JSON.stringify(pagination))
    history.push(`/viewer?dicomId=${record.dicomId}&orderId=${record.orderId}&from=${history.location.pathname}`)
  }

  // 普通医生详情
  const handleShowDoctorDetail = record => {
    localStorage.setItem('record', JSON.stringify(record))
    localStorage.setItem('StudyList', JSON.stringify(pagination))
    history.push(`/viewer?id=${record.id}&from=${history.location.pathname}`)
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
        <MenuList defaultSelectedKeys={'1'} userInfo={userInfo} />
        <div className="study-list-container">
          {userInfo === 'doctor' ? (
            <div className="search-box-wrap">
              <div className="header"></div>
              <div className="search-box">
                <div className="srarch-label">
                  <div>良性样本编号：</div>
                  <Input
                    value={searchId}
                    onChange={e => handleDoctorIdSearch(e.target.value)}
                    style={{ width: 200, marginLeft: 15 }}
                    placeholder="请输入良性样本Id"
                  />
                </div>

                <div className="srarch-label">
                  <div>完成状态：</div>
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
                </div>

                <Button style={{ marginLeft: 20 }} onClick={handleSearch} type="primary">
                  搜索
                </Button>
                <Button onClick={handleReset} type="primary" style={{ marginLeft: 15 }}>
                  重置
                </Button>
              </div>
            </div>
          ) : (
            <div className="search-box-wrap">
              <div className="header"></div>
              <div className="search-box">
                <div className="srarch-label">
                  <div>选用状态：</div>
                  <Select
                    value={isChiefFinish}
                    style={{ width: 200 }}
                    onChange={handleIsChiefFinishSearch}
                    options={[
                      {
                        value: 0,
                        label: '未选用',
                      },
                      {
                        value: 1,
                        label: '已选用',
                      },
                    ]}
                  />
                </div>

                <Button style={{ marginLeft: 20 }} onClick={handleChiefSearch} type="primary">
                  搜索
                </Button>
                <Button onClick={handleChiefReset} type="primary" style={{ marginLeft: 15 }}>
                  重置
                </Button>
              </div>
            </div>
          )}
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
            columns={userInfo === 'chief' ? chiefColumns : doctorColumns}
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

export default StudyList
