import React from 'react'
import './MenuList.scss'
import { useHistory } from 'react-router-dom'
import { Menu } from 'antd'

const { SubMenu } = Menu;

const MenuList = props => {
  const history = useHistory()

  // 菜单切换
  const handleChangeMenu = e => {
    localStorage.setItem('pagination', '')
    localStorage.setItem('markListPagination', '')
    localStorage.setItem('benignListPagination', '')
    if (e.key === '0') {
      history.push('/dashboard')
    } else if (e.key === '1') {
      history.push('/studyList')
    } else if (e.key === '2') {
      history.push('/allotList')
    } else if (e.key === '3') {
      history.push('/markList')
    } else if (e.key === '4') {
      history.push('/benignNoduleList')
    } else if (e.key === '5') {
      history.push('/missionList')
    } else if (e.key === '6') {
      history.push('/thirdStndrdList')
    } else if (e.key === '7') {
      history.push('/thirdBenignList')
    }
  }

  return (
    <div className="meau-box">
      <Menu defaultSelectedKeys={[props.defaultSelectedKeys]} onClick={e => handleChangeMenu(e)}>
        <Menu.Item key="1">{props.userInfo === 'chief' ? '商检结节列表' : '良性结节二筛列表'}</Menu.Item>
        {props.userInfo === 'chief' ? <Menu.Item key="2">分配列表</Menu.Item> : ''}
        
        <Menu.Item key="5">多组学结节列表</Menu.Item>

        <Menu.ItemGroup title="第一批软标签">
            <Menu.Item key="0">统计页</Menu.Item>
            <Menu.Item key="3">金标准列表</Menu.Item>
              <Menu.Item key="4">良性结节列表</Menu.Item>
          </Menu.ItemGroup>
        
        <Menu.ItemGroup title="第二批软标签">
            <Menu.Item key="0">统计页</Menu.Item>
            <Menu.Item key="6">金标准列表</Menu.Item>
            <Menu.Item key="7">良性结节列表</Menu.Item>
          </Menu.ItemGroup>
      </Menu>
    </div>
  )
}

export default MenuList
