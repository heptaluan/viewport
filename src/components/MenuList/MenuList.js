import React from 'react'
import './MenuList.scss'
import { useHistory } from 'react-router-dom'
import { Menu } from 'antd'

const { SubMenu } = Menu

const MenuList = props => {
  const history = useHistory()

  // 菜单切换
  const handleChangeMenu = e => {
    if (e.key === '1') {
      history.push('/studyList')
    } else if (e.key === '2') {
      history.push('/allotList')
    } else if (e.key === '3') {
      history.push('/missionList')
    }

    if (e.key === '2-0') {
      history.push('/secondDashboard')
    } else if (e.key === '2-1') {
      history.push('/secondChiefStndrdList')
    } else if (e.key === '2-2') {
      history.push('/secondChiefBenignList')
    } else if (e.key === '2-3') {
      history.push('/secondStndrdList')
    } else if (e.key === '2-4') {
      history.push('/secondBenignList')
    }

    if (e.key === '3-0') {
      history.push('/thirdDashboard')
    } else if (e.key === '3-1') {
      history.push('/thirdChiefStndrdList')
    } else if (e.key === '3-2') {
      history.push('/thirdChiefBenignList')
    } else if (e.key === '3-3') {
      history.push('/thirdStndrdList')
    } else if (e.key === '3-4') {
      history.push('/thirdBenignList')
    } else if (e.key === '3-5') {
      history.push('/allNoduleList')
    }

    if (e.key === '4-0') {
      history.push('/fourBenignList')
    }

    if (e.key === '5-0') {
      history.push('/fiveBenignList')
    }
  }

  return (
    <div className="meau-box">
      <Menu defaultSelectedKeys={[props.defaultSelectedKeys]} onClick={e => handleChangeMenu(e)}>
        {/* <Menu.Item key="1">{props.userInfo === 'chief' ? '商检结节列表' : '良性结节二筛列表'}</Menu.Item> */}
        {props.userInfo === 'chief' ? <Menu.Item key="2">分配列表</Menu.Item> : ''}
        <Menu.Item key="3">多组学结节列表</Menu.Item>

        <Menu.ItemGroup title="第一批软标签">
          {props.userInfo === 'chief' ? (
            <>
              {/* <Menu.Item key="2-0">统计页</Menu.Item> */}
              <Menu.Item key="2-1">金标准审核列表</Menu.Item>
              <Menu.Item key="2-2">良性结节审核列表</Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="2-3">金标准列表</Menu.Item>
              <Menu.Item key="2-4">良性结节列表</Menu.Item>
            </>
          )}
        </Menu.ItemGroup>

        <Menu.ItemGroup title="第二批软标签">
          {props.userInfo === 'chief' ? (
            <>
              <Menu.Item key="3-0">统计页</Menu.Item>
              <Menu.Item key="3-5">结节筛选页</Menu.Item>
              <Menu.Item key="3-1">金标准审核列表</Menu.Item>
              <Menu.Item key="3-2">良性结节审核列表</Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="3-3">金标准列表</Menu.Item>
              <Menu.Item key="3-4">良性结节列表</Menu.Item>
            </>
          )}
        </Menu.ItemGroup>

        <Menu.ItemGroup title="第三批软标签">
          <Menu.Item key="4-0">良性结节列表</Menu.Item>
        </Menu.ItemGroup>

        <Menu.ItemGroup title="第四批软标签">
          <Menu.Item key="5-0">良性结节列表</Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </div>
  )
}

export default MenuList
