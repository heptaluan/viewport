import React, { useState, useEffect } from 'react'
import './Dashboard.scss'
// import { useHistory } from 'react-router-dom'
import { Card } from 'antd'
import MenuList from '../../components/MenuList/MenuList'
import HeaderList from '../../components/HeaderList/HeaderList'
import * as echarts from 'echarts/lib/echarts.js'
import 'echarts'

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
    var myChart1 = echarts.init(document.getElementById('chartBox1'))
    var myChart2 = echarts.init(document.getElementById('chartBox2'))
    var myChart3 = echarts.init(document.getElementById('chartBox3'))
    var myChart4 = echarts.init(document.getElementById('chartBox4'))
    var myChart5 = echarts.init(document.getElementById('chartBox5'))
    var myChart6 = echarts.init(document.getElementById('chartBox6'))

    const chartOptions1 = {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '70%',
          data: [
            {
              value: 1048,
              name: 'Search Engine',
            },
            {
              value: 735,
              name: 'Direct',
            },
            {
              value: 580,
              name: 'Email',
            },
            {
              value: 484,
              name: 'Union Ads',
            },
            {
              value: 300,
              name: 'Video Ads',
            },
          ],
          center: ['50%', '50%'],
          label: {
            normal: {
              show: true,
              position: 'inner',
              formatter: '{d}%',
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }

    const chartOptions2 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    }

    const chartOptions3 = {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '70%',
          data: [
            {
              value: 1048,
              name: 'Search Engine',
            },
            {
              value: 735,
              name: 'Direct',
            },
            {
              value: 580,
              name: 'Email',
            },
            {
              value: 484,
              name: 'Union Ads',
            },
            {
              value: 300,
              name: 'Video Ads',
            },
          ],
          center: ['50%', '50%'],
          label: {
            normal: {
              show: true,
              position: 'inner',
              formatter: '{d}%',
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }

    const chartOptions4 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    }

    const chartOptions5 = {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '70%',
          data: [
            {
              value: 1048,
              name: 'Search Engine',
            },
            {
              value: 735,
              name: 'Direct',
            },
            {
              value: 580,
              name: 'Email',
            },
            {
              value: 484,
              name: 'Union Ads',
            },
            {
              value: 300,
              name: 'Video Ads',
            },
          ],
          center: ['50%', '50%'],
          label: {
            normal: {
              show: true,
              position: 'inner',
              formatter: '{d}%',
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }

    const chartOptions6 = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    }

    if (myChart1) {
      myChart1.setOption(chartOptions1)
      myChart2.setOption(chartOptions2)
      myChart3.setOption(chartOptions3)
      myChart4.setOption(chartOptions4)
      myChart5.setOption(chartOptions5)
      myChart6.setOption(chartOptions6)
    }

    window.addEventListener('resize', function () {
      myChart1.resize()
      myChart2.resize()
      myChart3.resize()
      myChart4.resize()
      myChart5.resize()
      myChart6.resize()
    })
  }, [])

  return (
    <div className="dashboard-list-box">
      <HeaderList />
      <div className="dashboard-list-container-wrap">
        <MenuList defaultSelectedKeys={'0'} userInfo={userInfo} />
        <div className="dashboard-list-container">
          <div className="box">
            <div className="chart-box-wrap">
              <div className="title">医生一统计数据</div>
              <div id="chartBox1" className="chart-box"></div>
            </div>
            <div className="chart-box-wrap">
              <div className="title">医生一每日勾画数据</div>
              <div id="chartBox2" className="chart-box"></div>
            </div>
          </div>

          <div className="box">
            <div className="chart-box-wrap">
              <div className="title">医生二统计数据</div>
              <div id="chartBox3" className="chart-box"></div>
            </div>
            <div className="chart-box-wrap">
              <div className="title">医生二每日勾画数据</div>
              <div id="chartBox4" className="chart-box"></div>
            </div>
          </div>

          <div className="box">
            <div className="chart-box-wrap">
              <div className="title">医生三统计数据</div>
              <div id="chartBox5" className="chart-box"></div>
            </div>
            <div className="chart-box-wrap">
              <div className="title">医生三每日勾画数据</div>
              <div id="chartBox6" className="chart-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
