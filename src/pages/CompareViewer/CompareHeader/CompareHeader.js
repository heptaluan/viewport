import React, { useState, useImperativeHandle } from 'react'
import './CompareHeader.scss'
import { Button } from 'antd'

const CompareHeader = React.forwardRef( (props, ref) => {
  const [sync, setSync] = useState(false)

  useImperativeHandle(ref, () => ({
    sync
  }))

  return (
    <div className="header-box">
      <Button onClick={e => setSync(!sync)}>{sync ? '取消同步' : '开启同步'}</Button>
    </div>
  )
})

export default CompareHeader
