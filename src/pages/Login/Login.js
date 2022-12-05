import React, { useState, useEffect } from 'react'
import './Login.scss'
import { useHistory } from 'react-router-dom'
import { LockOutlined, UserOutlined, BellOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import { getCodeImg } from '../../api/api'

const Login = () => {
  const history = useHistory()

  const [imgSrc, setImgSrc] = useState('')

  useEffect(() => {
    const time = new Date().getTime().toString()
    const fetchData = async () => {
      const result = await getCodeImg(time)
      if (result.data.code === 0 && result.data.result) {
        setImgSrc(result.data.result)
      }
    }
    fetchData()
  }, [])

  const onFinish = values => {
    console.log('Success:', values)
    history.push(`/studyList`)
  }

  const handleChangeImg = async () => {
    const time = new Date().getTime().toString()
    const result = await getCodeImg(time)
    if (result.data.code === 0 && result.data.result) {
      setImgSrc(result.data.result)
    }
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
