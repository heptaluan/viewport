import React, { memo } from 'react'
import { renderRoutes } from 'react-router-config'
import { withRouter } from 'react-router-dom'

export default memo(
  withRouter(function IndexComponent(props) {
    if (props.location.pathname === '/') {
      props.history.push('/login')
    }

    if (props.location.pathname === '/login') {
      if (localStorage.getItem('token') !== '') {
        props.history.push('/studyList')
      }
    }
    return (
      <>
        <div className="content">{renderRoutes(props.route.routes)}</div>
      </>
    )
  })
)
