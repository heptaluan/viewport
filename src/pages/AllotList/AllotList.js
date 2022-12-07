import React, { useState, useEffect } from 'react'
import './AllotList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Modal, Button, Space, Popconfirm, message, Menu, Avatar } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { getAssignList, assignList, getDefaultList } from '../../api/api'

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

  // 请求列表数据
  const fetchList = async () => {
    const result = await getDefaultList()
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 初始列表数据
  useEffect(() => {
    fetchList()
  }, [])

  const handleLogout = _ => {
    localStorage.setItem('token', '')
    message.success(`退出成功`)
    history.push('/login')
  }

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

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    console.log(selectedList)
    const result = await assignList()
    debugger
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
    }
    // setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedList(selectedRows)
    }
  }

  return (
    <div className="study-list-box">
      <header>
        <div className="logo">
          <img src="https://ai.feipankang.com/img/logo-white.6ffe78fe.png" alt="logo" />
          <h1>泰莱生物商检系统</h1>
        </div>
        <div className='logout-box'>
          <div className='user-box'>
            <Avatar size={26} icon={<UserOutlined />} />
            <span className='user-name'>用户123</span>
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
            <Menu.Item key="1">默认列表</Menu.Item>
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
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
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
      >
        <p>是否将所选列表进行分配</p>
      </Modal>
    </div>
  )
}

export default AllotList
