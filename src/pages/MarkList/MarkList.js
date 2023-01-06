import React, { useState, useEffect } from 'react'
import './MarkList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Space, Button, Select, Popconfirm, message, Menu, Avatar, Input } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { getAssignList, getChiefList, getAssignUsersList, addAssignResult } from '../../api/api'

const MarkList = () => {
  const [dataSource, setDataSource] = useState([])

  const columns = [
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
        return record.isKy === 1 ? (
          <span style={{ color: '#73d13d' }}>已选用</span>
        ) : (
          <span style={{ color: '#ff4d4f' }}>未选用</span>
        )
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
          <a onClick={() => handleShowDetail(record)}>查看详情</a>
        </Space>
      ),
    },
  ]

  const history = useHistory()

  // 用户角色
  const [userInfo, setUserInfo] = useState('')

  // 分配医生列表
  const [selectOptions, setSelectOptions] = useState([])

  // 查询
  const [params, setParams] = useState({
    isAssign: 0,
    name: '',
    pcode: '',
  })

  const handleNameSearch = val => {
    const newParams = Object.assign({}, params)
    newParams.name = val
    setParams(newParams)
  }

  const handlePcodeSearch = val => {
    const newParams = Object.assign({}, params)
    newParams.pcode = val
    setParams(newParams)
  }

  const handleIsAssignSearch = val => {
    const newParams = Object.assign({}, params)
    newParams.isAssign = val
    setParams(newParams)
  }

  const handleSearch = () => {
    fetchList()
  }

  const handleReset = async () => {
    const newParams = {
      isAssign: 0,
      name: '',
      pcode: '',
    }
    setParams(newParams)
    const result = await getAssignList(newParams)
    if (result.data.code === 200) {
      setDataSource([])
      setDataSource(result.data.rows)
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
    const result = await getChiefList(0)
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      localStorage.setItem('info', '')
      localStorage.setItem('username', '')
      localStorage.setItem('pagination', '')
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 初始列表数据
  useEffect(() => {
    setUserInfo(localStorage.getItem('info'))
    fetchList()
  }, [])

  // 退出
  const handleLogout = _ => {
    localStorage.setItem('token', '')
    localStorage.setItem('info', '')
    localStorage.setItem('username', '')
    localStorage.setItem('pagination', '')
    message.success(`退出成功`)
    history.push('/login')
  }

  // 菜单切换
  const handleChangeMenu = e => {
    if (e.key === '1') {
      history.push('/studyList')
    } else if (e.key === '2') {
      history.push('/allotList')
    } else if (e.key === '3') {
      history.push('/markList')
    }
  }

  // 查看详情
  const handleShowDetail = record => {
    history.push(`/markViewer?dicomId=${record.dicomId}&orderId=${record.orderId}`)
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
          <Menu defaultSelectedKeys={['3']} onClick={e => handleChangeMenu(e)}>
            <Menu.Item key="1">审核列表</Menu.Item>
            <Menu.Item key="2">分配列表</Menu.Item>
            {/* <Menu.Item key="3">标记列表</Menu.Item> */}
          </Menu>
        </div>
        <div className="study-list-container">
          <div className="search-box-wrap">
            <div className="header">
   
            </div>
            <div className="search-box">
              <Input
                value={params.name}
                onChange={e => handleNameSearch(e.target.value)}
                style={{ width: 200 }}
                placeholder="请输入姓名"
              />
              <Input
                value={params.pcode}
                onChange={e => handlePcodeSearch(e.target.value)}
                style={{ width: 200 }}
                placeholder="请输入病人编号"
              />
              <Select
                value={params.isAssign}
                style={{ width: 200 }}
                onChange={handleIsAssignSearch}
                options={[
                  {
                    value: 0,
                    label: '未分配',
                  },
                  {
                    value: 1,
                    label: '已分配',
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

export default MarkList
