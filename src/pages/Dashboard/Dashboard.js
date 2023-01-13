import React, { useState, useEffect } from 'react'
import './Dashboard.scss'
import { useHistory } from 'react-router-dom'
import { Card , Button, Popconfirm, message, Menu, Avatar } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { getChiefList, getDoctorList } from '../../api/api'

const Dashboard = () => {

  const history = useHistory()
  const [userInfo, setUserInfo] = useState('')

  // 初始用户数据
  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)
  }, [])

  const handleLogout = _ => {
    localStorage.setItem('token', '')
    localStorage.setItem('info', '')
    localStorage.setItem('username', '')
    localStorage.setItem('pagination', '')
    message.success(`退出成功`)
    history.push('/login')
  }

  const handleChangeMenu = e => {
    if (e.key === '0') {
      history.push('/dashboard')
    } else if (e.key === '1') {
      history.push('/studyList')
    } else if (e.key === '2') {
      history.push('/allotList')
    } else if (e.key === '3') {
      history.push('/markList')
    } else if (e.key === '4') {
      history.push('/benignNoduleList')
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
          <Menu defaultSelectedKeys={['0']} onClick={e => handleChangeMenu(e)}>
            <Menu.Item key="0">分析台</Menu.Item>
            <Menu.Item key="1">审核列表</Menu.Item>
            {userInfo === 'chief' ? <Menu.Item key="2">分配列表</Menu.Item> : ''}
            <Menu.Item key="3">金标准列表</Menu.Item>
            <Menu.Item key="4">良性结节列表</Menu.Item>
          </Menu>
        </div>
        <div className="study-list-container">
          <Card title="图表" style={{ width: 550 }}>
            <div className='chart-box'>
            
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
