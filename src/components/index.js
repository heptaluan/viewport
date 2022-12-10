import React, { memo } from 'react'
import { renderRoutes } from 'react-router-config'
import { withRouter } from 'react-router-dom'

export default memo(
  withRouter(function IndexComponent(props) {
    try {
      if (props.location.pathname === '/') {
        props.history.push('/login')
      }

      if (props.location.pathname === '/login') {
        if (localStorage.getItem('token') && localStorage.getItem('token') !== '') {
          props.history.push('/studyList')
        }
      }

      if (props.location.pathname === '/studyList') {
        if (!localStorage.getItem('token')) {
          props.history.push('/login')
        }
      }
    } catch (error) {
      console.log(error)
    }

    return (
      <>
        <div className="content">{renderRoutes(props.route.routes)}</div>
      </>
    )
  })
)
