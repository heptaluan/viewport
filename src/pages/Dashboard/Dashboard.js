import React, { useState, useEffect } from 'react'
import './Dashboard.scss'
// import { useHistory } from 'react-router-dom'
import { Card } from 'antd'
import MenuList from '../../components/MenuList/MenuList'
import HeaderList from '../../components/HeaderList/HeaderList'
import * as echarts from 'echarts/lib/echarts.js'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/grid'

const Dashboard = () => {
  // const history = useHistory()
  const [userInfo, setUserInfo] = useState('')

  // 初始用户数据
  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)
  }, [])

  // 初始化图表
  useEffect(() => {
    var myChart = echarts.init(document.getElementById('chartBox'))

    const chartOptions = {
      title: { text: 'ECharts 入门示例' },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    }

    if (myChart) {
      myChart.setOption(chartOptions)
    }
  }, [])

  return (
    <div className="study-list-box">
      <HeaderList />
      <div className="study-list-container-wrap">
        <MenuList defaultSelectedKeys={'0'} userInfo={userInfo} />
        <div className="study-list-container">
          <Card title="图表" style={{ width: 550 }}>
            <div id="chartBox" className="chart-box"></div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
