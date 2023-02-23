import IndexComponent from '../components/index'
import Viewer from '../pages/Viewer/Viewer'
import MarkViewer from '../pages/MarkViewer/MarkViewer'
import BenignNoduleList from '../pages/BenignNoduleList/BenignNoduleList'
import StudyList from '../pages/StudyList/StudyList'
import AllotList from '../pages/AllotList/AllotList'
import MarkList from '../pages/MarkList/MarkList'
import MissionList from '../pages/MissionList/MissionList'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import { Redirect } from 'react-router-dom'

import ThirdStndrdList from '../pages/ThirdStndrdList/ThirdStndrdList'
import ThirdBenignList from '../pages/ThirdBenignList/ThirdBenignList'
import ThirdViewer from '../pages/ThirdViewer/ThirdViewer'

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
        path: '/dashboard',
        component: Dashboard,
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
      {
        path: '/benignNoduleList',
        component: BenignNoduleList,
        routes: [],
      },
      {
        path: '/missionList',
        component: MissionList,
        routes: [],
      },
      {
        path: '/thirdStndrdList',
        component: ThirdStndrdList,
        routes: [],
      },
      {
        path: '/thirdBenignList',
        component: ThirdBenignList,
        routes: [],
      },
      {
        path: '/thirdViewer',
        component: ThirdViewer,
        routes: [],
      },
    ],
  },
]

export default routes
