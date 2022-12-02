import React, { useState, useEffect } from 'react'
import './Login.scss'
import { useHistory } from 'react-router-dom'
import { LockOutlined, UserOutlined, FrownOutlined } from '@ant-design/icons'
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
    // history.push(`/studyList`)
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
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
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
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
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
              style={{ width: '80%' }}
            >
              <Input prefix={<FrownOutlined />} type="code" placeholder="验证码" />
            </Form.Item>
            <img className="code-img" onClick={handleChangeImg} src={imgSrc} alt="code" />
          </div>

          <Form.Item
            wrapperCol={{
              offset: 22,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
