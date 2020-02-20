
import React, { useRef, useState, useEffect } from 'react'
import { Form, Icon, Input, Button, notification, Spin } from 'antd'
import { withRouter } from 'react-router-dom'

import RegisterForm from './register-form'
import ForgotForm from './forgot-form'

// import css
import './index.scss'
//redux


//server
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

const LOGIN = gql`
mutation login($email: String!, $password: String!) {
  login(loginInput: {email: $email, password: $password}) {
    token
    status
    message
  }
}
`
const openNotification = placement => {
  notification.error({
    message: 'Sai tai khoan hoac mat khau !',
    placement,
  })
}

const Index = (props) => {
  const { history } = props
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [forgotForm, setForgotForm] = useState(false)
  const [login] = useMutation(LOGIN)
  const [loading, setLoading] = useState(false)

  const registerClick = () => {
    const loginForm = window.document.querySelector('.login')
    loginForm.classList.toggle('hide')
    const registerForm = window.document.querySelector('.register')
    registerForm.classList.toggle('show')
    const imgRight = window.document.querySelector('.right-image')
    imgRight.classList.toggle('hide-image')
    const imgLeft = window.document.querySelector('.left-image')
    imgLeft.classList.toggle('change-image')
  }


  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        setLoading(true)
        login({
          variables: {
            email: emailRef.current.state.value,
            password: passwordRef.current.state.value
          }
        }).then(res => {
          setLoading(false)
          const { token } = res.data.login
          if (token) {
            localStorage.setItem('Authorization', `Bearer ${token}`)
            history.push('/newsFeed')
          }
          else {
            openNotification('bottomRight')
          }
        }).catch(err => console.log(err))
      }
    })

  }

  const { getFieldDecorator } = props.form

  return (
    <div className='container'>
      <div className='img'>
        <div style={{ marginLeft: '2em' }}></div>
        <div className='left-image'></div>
        <div className='right-image'></div>
      </div>
      <div className='form-center login'>
        <h1 style={{ display: 'block', textAlign: 'center' }}>Login</h1>
        <Spin spinning={loading}>
          <Form onSubmit={handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your email!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                  ref={emailRef}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <a className="forgotBtn" onClick={() => setForgotForm(true)}>
                Forgot password
                </a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
                  </Button>
              Or <a onClick={() => registerClick()}>register now!</a>
            </Form.Item>
          </Form>
        </Spin>
      </div>
      <div className='form-center register'>
        <h2 style={{ display: 'block', textAlign: 'center' }}>Register</h2>
        <RegisterForm className='form-register' backLogin={() => registerClick()} />
      </div>
      <ForgotForm onCancel={() => setForgotForm(false)} visible={forgotForm} />
    </div>

  )
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Index)
export default withRouter(WrappedNormalLoginForm)
