import React, { useState, useEffect } from 'react'
import './StudyList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Input, Button, Space, Popconfirm, message, Menu, Avatar } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { getChiefList, getDoctorList } from '../../api/api'

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
      title: '审阅人',
      dataIndex: 'createBy',
    },
    {
      title: '审阅时间',
      dataIndex: 'createTime',
    },
    {
      title: '是否完成',
      dataIndex: 'isFinish',
      render: (_, record) => {
        return record.isFinish === 1 ? <span style={{color: '#73d13d'}}>完成</span> : <span style={{color: '#ff4d4f'}}>未完成</span>
      },
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

  // 获取总医生列表数据
  const fetchChiefList = async () => {
    const result = await getChiefList()
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      localStorage.setItem('info', '')
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 获取普通医生列表数据
  const fetchDoctorList = async () => {
    const result = await getDoctorList()
    if (result.data.code === 200) {
      setDataSource(result.data.rows)
    } else if (result.data.code === 401) {
      localStorage.setItem('token', '')
      localStorage.setItem('info', '')
      message.warning(`登录已失效，请重新登录`)
      history.push('/login')
    }
  }

  // 初始列表数据
  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)

    if (info === 'chief') {
      fetchChiefList()
    } else if (info === 'doctor') {
      fetchDoctorList()
    }
  }, [])

  // 总医生详情
  const handleShowChiefDetail = record => {
    localStorage.setItem('record', JSON.stringify(record))
    history.push(`/viewer?dicomId=${record.dicomId}&orderId=${record.orderId}`)
  }

  // 普通医生详情
  const handleShowDoctorDetail = record => {
    localStorage.setItem('record', JSON.stringify(record))
    history.push(`/viewer?id=${record.id}`)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }

  const handleLogout = _ => {
    localStorage.setItem('token', '')
    localStorage.setItem('info', '')
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
          <Menu defaultSelectedKeys={['1']} onClick={e => handleChangeMenu(e)}>
            <Menu.Item key="1">审核列表</Menu.Item>
            {userInfo === 'chief' ? <Menu.Item key="2">分配列表</Menu.Item> : ''}
          </Menu>
        </div>
        <div className="study-list-container">
          {/* <div className="search-box-wrap">
            <div className="header">
              <Button type="primary">搜索</Button>
              <Button type="primary" style={{ marginLeft: 15 }}>
                重置
              </Button>
            </div>
            <div className="search-box">
              <Input style={{ width: 200 }} placeholder="请输入姓名" />
              <Input style={{ width: 200 }} placeholder="请输入身份证号" />
              <Input style={{ width: 200 }} placeholder="请输入年龄" />
            </div>
          </div> */}
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            rowKey={record => userInfo === 'chief' ? record.orderId : record.id}
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
