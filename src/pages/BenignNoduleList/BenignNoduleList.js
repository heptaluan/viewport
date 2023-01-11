import React, { useState, useEffect } from 'react'
import './BenignNoduleList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Space, Button, Select, Popconfirm, message, Menu, Avatar, Input } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { getBenignNoduleList } from '../../api/api'

const BenignNoduleList = () => {
  const [dataSource, setDataSource] = useState([])

  const columns = [
    {
      title: '审阅人',
      dataIndex: 'createBy',
    },
    {
      title: '编号',
      dataIndex: 'kyPrimaryId',
    },
    {
      title: '完成状态',
      dataIndex: 'isFinish',
      render: (_, record) => {
        return record.isFinish === 1 ? (
          <span style={{ color: '#73d13d' }}>已完成</span>
        ) : (
          <span style={{ color: '#ff4d4f' }}>未完成</span>
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
    let page = localStorage.getItem('benignListPagination') ? JSON.parse(localStorage.getItem('benignListPagination')) : ''
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
    kyPrimaryId: '',
  })

  const handleKyPrimaryIdSearch = val => {
    const newParams = Object.assign({}, params)
    newParams.kyPrimaryId = val
    setParams(newParams)
  }

  const handleIsFinishSearch = val => {
    const newParams = Object.assign({}, params)
    newParams.isFinish = val
    setParams(newParams)
  }

  const handleSearch = () => {
    localStorage.setItem('benignListPagination', '')
    fetchList()
  }

  const handleReset = async () => {
    const newParams = {
      isFinish: 0,
      kyPrimaryId: '',
    }
    setParams(newParams)
    localStorage.setItem('benignListPagination', '')
    const result = await getBenignNoduleList(newParams)
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

  // 请求筛选结果列表数据
  const fetchList = async () => {
    let page = localStorage.getItem('benignListPagination') ? JSON.parse(localStorage.getItem('benignListPagination')) : ''
    const newParams = Object.assign({}, params)
    if (page !== '') {
      newParams.kyPrimaryId = page.kyPrimaryId
      newParams.isFinish = page.isFinish
      setParams(newParams)
    }

    const result = await getBenignNoduleList(newParams)
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
      initPagination(result)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      localStorage.setItem('info', '')
      localStorage.setItem('username', '')
      localStorage.setItem('pagination', '')
      localStorage.setItem('markListPagination', '')
      localStorage.setItem('benignListPagination', '')
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 退出
  const handleLogout = _ => {
    localStorage.setItem('pagination', '')
    localStorage.setItem('markListPagination', '')
    localStorage.setItem('benignListPagination', '')
    localStorage.setItem('token', '')
    localStorage.setItem('info', '')
    localStorage.setItem('username', '')
    localStorage.setItem('pagination', '')
    message.success(`退出成功`)
    history.push('/login')
  }

  // 菜单切换
  const handleChangeMenu = e => {
    localStorage.setItem('pagination', '')
    localStorage.setItem('markListPagination', '')
    localStorage.setItem('benignListPagination', '')
    if (e.key === '1') {
      history.push('/studyList')
    } else if (e.key === '2') {
      history.push('/allotList')
    } else if (e.key === '3') {
      history.push('/markList')
    } else if (e.key === '4') {
      history.push('/benignNoduleList')
    }
  }

  // 查看详情（金标准 type 2）
  const handleShowDetail = record => {
    const newPagination = Object.assign({}, pagination)
    newPagination.isFinish = params.isFinish
    newPagination.kyPrimaryId = params.kyPrimaryId
    localStorage.setItem('benignListPagination', JSON.stringify(newPagination))
    history.push(`/markViewer?id=${record.id}&kyPrimaryId=${record.kyPrimaryId}&isFinish=${record.isFinish}&type=1`)
  }

  return (
    <div className="study-list-box">
      <header>
        <div className="logo">
          <img src="https://ai.feipankang.com/img/logo-white.6ffe78fe.png" alt="logo" />
          <h1>泰莱生物商检系统</h1>
        </div>
        <div className="logout-box">
          <div className="user-box">
            <Avatar size={26} icon={<UserOutlined />} />
            <span className="user-name">{localStorage.getItem('username')}</span>
          </div>
          <Popconfirm
            placement="bottomRight"
            title="是否退出登录？"
            onConfirm={handleLogout}
            okText="确定"
            cancelText="取消"
            className="logout"
          >
            <Button type="text" icon={<LogoutOutlined />}>
              退出登录
            </Button>
          </Popconfirm>
        </div>
      </header>
      <div className="study-list-container-wrap">
        <div className="meau-box">
          <Menu defaultSelectedKeys={['4']} onClick={e => handleChangeMenu(e)}>
            <Menu.Item key="1">审核列表</Menu.Item>
            {userInfo === 'chief' ? <Menu.Item key="2">分配列表</Menu.Item> : ''}
            <Menu.Item key="3">金标准列表</Menu.Item>
            <Menu.Item key="4">良性结节列表</Menu.Item>
          </Menu>
        </div>
        <div className="study-list-container">
          <div className="search-box-wrap">
            <div className="header"></div>
            <div className="search-box">
              <Input
                value={params.kyPrimaryId}
                onChange={e => handleKyPrimaryIdSearch(e.target.value)}
                style={{ width: 200 }}
                placeholder="请输入编号"
              />
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
          />
        </div>
      </div>
    </div>
  )
}

export default BenignNoduleList
