import React, { useState, useEffect } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input, Button } from 'antd'


import './index.scss'


import Swal from 'sweetalert2'

function Index(props) {
  const { checkAccount } = props
  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = props.form
  // Only show error after a field is touched.
  const usernameError = isFieldTouched('username') && getFieldError('username')
  const passwordError = isFieldTouched('password') && getFieldError('password')

  const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some(field => fieldsError[field])
  }

  useEffect(() => {
    let mounted = true
    if (mounted) {
      props.form.validateFields()
    }
    return () => { mounted = false }
  }, [])


  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      // if (!err) {

      // }
    })
  }


  return <>
    <div className='form_login_admin'>
      <h1>Login to Admin's page</h1>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Log in
        </Button>
        </Form.Item>
      </Form>
    </div>
  </>
}
const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(Index)
export default WrappedHorizontalLoginForm