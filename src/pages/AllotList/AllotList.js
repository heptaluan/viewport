import React, { useState, useEffect } from 'react'
import './AllotList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Modal, Button, Select, Popconfirm, message, Menu, Avatar, Input } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { getAssignList, assignList, getAssignUsersList, addAssignResult } from '../../api/api'

const AllotList = () => {
  const [dataSource, setDataSource] = useState([])

  const columns = [
    {
      title: '良性样本Id',
      dataIndex: 'id',
    },
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
      title: '分配状态',
      dataIndex: 'sex',
      render: (_, record) => {
        return record.isAssign === 1 ? (
          <span style={{ color: '#73d13d' }}>已分配</span>
        ) : (
          <span style={{ color: '#ff4d4f' }}>未分配</span>
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
      title: '更新时间',
      dataIndex: 'updateTime',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        const t1 = new Date(a.updateTime).getTime()
        const t2 = new Date(b.updateTime).getTime()
        return t1 - t2
      },
      createTime: ['descend', 'ascend'],
      showSorterTooltip: false,
    },
    {
      title: '订单创建日期',
      dataIndex: 'orderCreateTime',
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
    const result = await getAssignList(params)
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      localStorage.setItem('info', '')
      localStorage.setItem('username', '')
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 请求可分配医生列表
  const fetchAssignUsersList = async () => {
    const result = await getAssignUsersList()
    if (result.data.code === 200) {
      const list = result.data.rows
      const users = []
      for (let i = 0; i < list.length; i++) {
        users.push({
          key: i,
          value: list[i].userName,
          label: list[i].userName,
        })
      }
      setSelectOptions(users)
    }
  }

  // 初始列表数据
  useEffect(() => {
    setUserInfo(localStorage.getItem('info'))
    fetchList()
    fetchAssignUsersList()
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

  // 任务分配
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedList, setSelectedList] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [assignUsers, setAssignUsers] = useState('')

  const showModal = () => {
    if (selectedList.length === 0) {
      message.warning(`请先选择需要进行分配的列表`)
    } else {
      setIsModalOpen(true)
    }
  }

  // 提交分配任务
  const handleOk = async () => {
    if (!assignUsers) {
      message.warning(`请选择医生进行分配`)
      return
    }
    const ids = []
    for (let i = 0; i < selectedList.length; i++) {
      ids.push(selectedList[i].id)
    }
    const postData = {
      users: assignUsers.join(','),
      ids: ids.join(','),
    }
    const result = await addAssignResult(postData)
    if (result.data.code === 200) {
      message.success(`分配成功`)
      setIsModalOpen(false)
      setSelectedList([])
      fetchList()
    } else if (result.data.code === 500) {
      message.error(result.data.msg ? result.data.msg : `任务分配失败，请重新尝试`)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedIds(selectedRowKeys)
      setSelectedList(selectedRows)
    },
  }

  // 选择分配医生
  const handleSelectedChange = value => {
    setAssignUsers(value)
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
          <Menu defaultSelectedKeys={['2']} onClick={e => handleChangeMenu(e)}>
            <Menu.Item key="1">审核列表</Menu.Item>
            <Menu.Item key="2">分配列表</Menu.Item>
            <Menu.Item key="3">标记列表</Menu.Item>
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
          <div className="search-box-wrap">
            <div className="header">
              <Button type="primary" onClick={showModal}>
                分配任务
              </Button>
            </div>
          </div>
          <Table
            scroll={{ x: 'max-content' }}
            rowSelection={rowSelection}
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

      <Modal
        title="任务分配"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="取消"
        okText="确定"
        maskClosable={false}
      >
        <div className="modal-box">
          <p>请选择医生进行分配：</p>
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            onChange={handleSelectedChange}
            options={selectOptions}
            placeholder="请选择需要进行分配的医生"
          />
        </div>
      </Modal>
    </div>
  )
}

export default AllotList
