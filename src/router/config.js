import IndexComponent from '../components/index'
import Viewer from '../pages/Viewer/Viewer'
import MarkViewer from '../pages/MarkViewer/MarkViewer'
import StudyList from '../pages/StudyList/StudyList'
import AllotList from '../pages/AllotList/AllotList'
import MarkList from '../pages/MarkList/MarkList'
import Login from '../pages/Login/Login'
import { Redirect } from 'react-router-dom'

const routes = [
  {
    path: '/',
    component: IndexComponent,
    routes: [
      {
        path: '/login',
        component: Login,
        routes: [],
      },
      {
        path: '/studyList',
        component: StudyList,
        routes: [],
        // render: () => <Redirect to={'/viewer/1'} />,
      },
      {
        path: '/markList',
        component: MarkList,
        routes: [],
        // render: () => <Redirect to={'/viewer/1'} />,
      },
      {
        path: '/allotList',
        component: AllotList,
        routes: [],
        // render: () => <Redirect to={'/viewer/1'} />,
      },
      {
        path: '/viewer',
        component: Viewer,
        routes: [],
      },
      {
        path: '/markViewer',
        component: MarkViewer,
        routes: [],
      },
    ],
  },
]

export default routes
