import React, { useState, useEffect } from 'react'
import './AllotList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Modal, Button, Select, Popconfirm, message, Menu, Avatar } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { getAssignList, assignList, getAssignUsersList, addAssignResult } from '../../api/api'

const AllotList = () => {
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
  ]

  const history = useHistory()

  // 用户角色
  const [userInfo, setUserInfo] = useState('')

  // 分配医生列表
  const [selectOptions, setSelectOptions] = useState([])

  // 请求筛选结果列表数据
  const fetchList = async () => {
    const result = await getAssignList()
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      localStorage.setItem('info', '')
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
    message.success(`退出成功`)
    history.push('/login')
  }

  // 菜单切换
  const handleChangeMenu = e => {
    if (e.key === '1') {
      history.push('/studyList')
    } else if (e.key === '2') {
      history.push('/allotList')
    }
  }

  // 任务分配
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedList, setSelectedList] = useState([])
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
      fetchList()
      setSelectedList([])
    } else if (result.data.code === 500) {
      message.error(result.data.msg ? result.data.msg : `任务分配失败，请重新尝试`)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const rowSelection = {
    selectedRowKeys: selectedList,
    onChange: newSelectedRowKeys => {
      setSelectedList(newSelectedRowKeys)
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
            <span className="user-name">{userInfo}</span>
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
          </Menu>
        </div>
        <div className="study-list-container">
          <div className="search-box-wrap">
            <div className="header">
              <Button type="primary" onClick={showModal}>
                分配任务
              </Button>
            </div>
          </div>
          <Table
            rowSelection={rowSelection}
            rowKey={record => record.orderId}
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
