import React, { useState, useEffect } from 'react'
import './StudyList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Input, Button, Space, Popconfirm, message, Menu } from 'antd'
import { LogoutOutlined  } from '@ant-design/icons'
import { getDefaultList } from '../../api/api'

const StudyList = () => {
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
      title: '订单创建日期',
      dataIndex: 'orderCreateTime',
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
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

  // 初始化病人信息
  useEffect(() => {
    fetchList()
  }, [])

  const handleShowDetail = record => {
    history.push(`/viewer?dicomId=${record.dicomId}&orderId=${record.orderId}`)
  }

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  }

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

  return (
    <div className="study-list-box">
      <header>
        <div className="logo">
          <img src="https://ai.feipankang.com/img/logo-white.6ffe78fe.png" alt="logo" />
          <h1>泰莱生物商检系统</h1>
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
      </header>
      <div className="study-list-container-wrap">
        <div className='meau-box'>
        <Menu defaultSelectedKeys={['1']} onClick={e => handleChangeMenu(e)}>
          <Menu.Item key="1">默认列表</Menu.Item>
          <Menu.Item key="2">分配列表</Menu.Item>
        </Menu>
        </div>
        <div className="study-list-container">
          <div className="search-box-wrap">
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
    </div>
  )
}

export default StudyList
