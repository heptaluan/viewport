import React from 'react'
import './HeaderList.scss'
import { Button, Popconfirm, message, Avatar } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'

const HeaderList = () => {
  const history = useHistory()

  const handleLogout = _ => {
    message.success(`退出成功`)
    history.push('/login')
  }

  return (
    <header className='header-list-box'>
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
  )
}

export default HeaderList
