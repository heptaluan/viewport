import React from 'react'
import { renderRoutes } from 'react-router-config'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import routes from './config'

const Router = () => {
  return (
    <>
      <BrowserRouter basename='/'>{renderRoutes(routes)}</BrowserRouter>
    </>
  )
}

export default Router
