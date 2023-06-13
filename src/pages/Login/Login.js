import React, { useState, useEffect } from 'react'
import './Login.scss'
import { useHistory } from 'react-router-dom'
import { LockOutlined, UserOutlined, BellOutlined } from '@ant-design/icons'
import { Button, message, Form, Input } from 'antd'
import { getCodeImg, userLogin, getInfo } from '../../api/api'

const Login = () => {
  const history = useHistory()

  const [imgSrc, setImgSrc] = useState('')
  const [uuid, setUuid] = useState('')

  const fetchCodeImg = async () => {
    const result = await getCodeImg()
    if (result.data.code === 200 && result.data.img) {
      setImgSrc('data:image/gif;base64,' + result.data.img)
      setUuid(result.data.uuid)
    }
  }

  useEffect(() => {
    handleClearLocalStorage()
    fetchCodeImg()
  }, [])

  const onFinish = async values => {
    const params = {
      uuid: uuid,
      ...values,
    }
    const result = await userLogin(params)
    if (result.data.code === 500) {
      message.warning(result.data.msg)
      fetchCodeImg()
    } else if (result.data.code === 200) {
      localStorage.setItem('token', result.data.token)
      const info = await getInfo()
      if (info.data.code === 200) {
        localStorage.setItem('info', info.data.roles[0])
        localStorage.setItem('username', info.data.user.nickName)
        message.success(`登录成功`)
        history.push(`/fourBenignList`)
      } else if (info.data.code === 500) {
        handleClearLocalStorage()
        message.warning(`获取用户角色失败，请重新登录`)
        fetchCodeImg()
      }
    }
  }

  const handleChangeImg = async () => {
    fetchCodeImg()
  }
  
  const handleClearLocalStorage = () => {
    localStorage.setItem('token', '')
    localStorage.setItem('info', '')
    localStorage.setItem('username', '')
    localStorage.setItem('pagination', '')

    localStorage.setItem('MissionList', '')
    localStorage.setItem('StudyList', '')
    localStorage.setItem('SecondBenignList', '')
    localStorage.setItem('SecondStndrdList', '')
    localStorage.setItem('SecondChiefBenignList', '')
    localStorage.setItem('SecondChiefStndrdList', '')
    localStorage.setItem('ThirdBenignList', '')
    localStorage.setItem('ThirdStndrdList', '')
    localStorage.setItem('ThirdChiefBenignList', '')
    localStorage.setItem('ThirdChiefStndrdList', '')
  }

  return (
    <div className="login-box-wrap">
      <div className="login-box">
        <div class="top">
          <div class="header">
            <a href="/">
              <img src="https://ai.feipankang.com/img/logo.02944b67.png" alt="logo" class="logo" />
            </a>
          </div>
          <div class="desc">
            <p>泰莱生物多组学商检管理系统</p>
            <p>TaiLai Biological Multi-OMics Laboratory</p>
          </div>
        </div>

        <div className="router-container">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input
                size="large"
                prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <div
              className="code-box"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}
            >
              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码',
                  },
                ]}
                style={{ width: '60%' }}
              >
                <Input
                  size="large"
                  prefix={<BellOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />}
                  type="code"
                  placeholder="验证码"
                />
              </Form.Item>
              <img className="code-img" onClick={handleChangeImg} src={imgSrc} alt="code" />
            </div>

            <Form.Item>
              <Button size="large" type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login
