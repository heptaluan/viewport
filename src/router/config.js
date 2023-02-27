import IndexComponent from '../components/index'
import Login from '../pages/Login/Login'
import Viewer from '../pages/Viewer/Viewer'
import StudyList from '../pages/StudyList/StudyList'
import AllotList from '../pages/AllotList/AllotList'
import MissionList from '../pages/MissionList/MissionList'

// 第一批软标签
import SecondDashboard from '../pages/Second/SecondDashboard/SecondDashboard'
import SecondViewer from '../pages/Second/SecondViewer/SecondViewer'
import SecondBenignList from '../pages/Second/SecondBenignList/SecondBenignList'
import SecondChiefBenignList from '../pages/Second/SecondChiefBenignList/SecondChiefBenignList'
import SecondStndrdList from '../pages/Second/SecondStndrdList/SecondStndrdList'
import SecondChiefStndrdList from '../pages/Second/SecondChiefStndrdList/SecondChiefStndrdList'

// 第二批软标签（三千结节）
import ThirdDashboard from '../pages/Third/ThirdDashboard/ThirdDashboard'
import ThirdViewer from '../pages/Third/ThirdViewer/ThirdViewer'
import ThirdBenignList from '../pages/Third/ThirdBenignList/ThirdBenignList'
import ThirdChiefBenignList from '../pages/Third/ThirdChiefBenignList/ThirdChiefBenignList'
import ThirdStndrdList from '../pages/Third/ThirdStndrdList/ThirdStndrdList'
import ThirdChiefStndrdList from '../pages/Third/ThirdChiefStndrdList/ThirdChiefStndrdList'
import AllNoduleList from '../pages/Third/AllNoduleList/AllNoduleList'

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
        path: '/viewer',
        component: Viewer,
        routes: [],
      },
      {
        path: '/studyList',
        component: StudyList,
        routes: [],
      },
      {
        path: '/allotList',
        component: AllotList,
        routes: [],
      },
      {
        path: '/missionList',
        component: MissionList,
        routes: [],
      },
      // 第二批软标签（三千结节）
      {
        path: '/thirdDashboard',
        component: ThirdDashboard,
        routes: [],
      },
      {
        path: '/thirdViewer',
        component: ThirdViewer,
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
        path: '/thirdChiefStndrdList',
        component: ThirdChiefStndrdList,
        routes: [],
      },
      {
        path: '/thirdChiefBenignList',
        component: ThirdChiefBenignList,
        routes: [],
      },
      {
        path: '/allNoduleList',
        component: AllNoduleList,
        routes: [],
      },
      // 第二批软标签
      {
        path: '/secondDashboard',
        component: SecondDashboard,
        routes: [],
      },
      {
        path: '/secondViewer',
        component: SecondViewer,
        routes: [],
      },
      {
        path: '/secondStndrdList',
        component: SecondStndrdList,
        routes: [],
      },
      {
        path: '/secondBenignList',
        component: SecondBenignList,
        routes: [],
      },
      {
        path: '/secondChiefStndrdList',
        component: SecondChiefStndrdList,
        routes: [],
      },
      {
        path: '/secondChiefBenignList',
        component: SecondChiefBenignList,
        routes: [],
      },
    ],
  },
]

export default routes
