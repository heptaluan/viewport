import React, { useState, useEffect } from 'react'
import './ThirdDashboard.scss'
import { useHistory } from 'react-router-dom'
import { message } from 'antd'
import MenuList from '../../../components/MenuList/MenuList'
import HeaderList from '../../../components/HeaderList/HeaderList'
import * as echarts from 'echarts/lib/echarts.js'
import 'echarts'
import { getThirdStatisticData } from '../../../api/api'

const ThirdDashboard = () => {
  const history = useHistory()
  const [userInfo, setUserInfo] = useState('')

  const [total1, setTotal1] = useState(0)
  const [total2, setTotal2] = useState(0)
  const [total3, setTotal3] = useState(0)

  // 初始用户数据
  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)
  }, [])

  // 初始化图表
  useEffect(() => {
    const fetchData = async () => {
      const result = await getThirdStatisticData()
      if (result.data.code === 200) {
        initChart(result.data.data)
      } else if (result.data.code === 401) {
        message.warning(`登录已失效，请重新登录`)
        history.push('/login')
      }
    }
    fetchData()
  }, [])

  const initChart = data => {
    const totalList = formatTotal(data.finishInfo)
    setTotal1(totalList[0][0].value + totalList[0][1].value)
    setTotal2(totalList[1][0].value + totalList[1][1].value)
    setTotal3(totalList[2][0].value + totalList[2][1].value)

    const dateList = formatDateList(data.finishInfoDate)

    // 0 未完成。1 已经完成

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
      legend: {
        padding: [30, 0, 0, 0],
      },
      series: [
        {
          name: '结节审查进度',
          type: 'pie',
          radius: '70%',
          data: totalList[0],
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
      legend: {
        padding: [15, 0, 0, 0],
        data: ['每日审查数'],
      },
      xAxis: {
        type: 'category',
        data: dateList.doc1.date,
        axisLabel: {
          rotate: dateList.doc1.date.length > 6 ? '30' : 0,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '每日审查数',
          data: dateList.doc1.count,
          type: 'line',
        },
      ],
    }

    const chartOptions3 = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        padding: [30, 0, 0, 0],
      },
      series: [
        {
          name: '结节审查进度',
          type: 'pie',
          radius: '70%',
          data: totalList[1],
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
      legend: {
        padding: [15, 0, 0, 0],
        data: ['每日审查数'],
      },
      xAxis: {
        type: 'category',
        data: dateList.doc2.date,
        axisLabel: {
          rotate: dateList.doc2.date.length > 6 ? '30' : 0,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '每日审查数',
          data: dateList.doc2.count,
          type: 'line',
        },
      ],
    }

    const chartOptions5 = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        padding: [30, 0, 0, 0],
      },
      series: [
        {
          name: '结节审查进度',
          type: 'pie',
          radius: '70%',
          data: totalList[2],
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
      legend: {
        padding: [15, 0, 0, 0],
        data: ['每日审查数'],
      },
      xAxis: {
        type: 'category',
        data: dateList.doc3.date,
        axisLabel: {
          rotate: dateList.doc3.date.length > 6 ? '30' : 0,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '每日审查数',
          data: dateList.doc3.count,
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
  }

  const formatTotal = data => {
    return [
      [
        {
          value: data.filter(item => item.create_by === '杨帆' && item.is_finish === 0)[0]
            ? data.filter(item => item.create_by === '杨帆' && item.is_finish === 0)[0]['count(id)']
            : '',
          name: '未完成',
        },
        {
          value: data.filter(item => item.create_by === '杨帆' && item.is_finish === 1)[0]
            ? data.filter(item => item.create_by === '杨帆' && item.is_finish === 1)[0]['count(id)']
            : '',
          name: '已完成',
        },
      ],
      [
        {
          value: data.filter(item => item.create_by === '李腾海' && item.is_finish === 0)[0]
            ? data.filter(item => item.create_by === '李腾海' && item.is_finish === 0)[0]['count(id)']
            : '',
          name: '未完成',
        },
        {
          value: data.filter(item => item.create_by === '李腾海' && item.is_finish === 1)[0]
            ? data.filter(item => item.create_by === '李腾海' && item.is_finish === 1)[0]['count(id)']
            : '',
          name: '已完成',
        },
      ],
      [
        {
          value: data.filter(item => item.create_by === '周坦峰' && item.is_finish === 0)[0]
            ? data.filter(item => item.create_by === '周坦峰' && item.is_finish === 0)[0]['count(id)']
            : '',
          name: '未完成',
        },
        {
          value: data.filter(item => item.create_by === '周坦峰' && item.is_finish === 1)[0]
            ? data.filter(item => item.create_by === '周坦峰' && item.is_finish === 1)[0]['count(id)']
            : '',
          name: '已完成',
        },
      ],
    ]
  }

  const formatDateList = data => {
    const data1 = data.filter(item => item.create_by === '杨帆')
    const data2 = data.filter(item => item.create_by === '李腾海')
    const data3 = data.filter(item => item.create_by === '周坦峰')

    const data1Data = []
    const data1Value = []

    const data2Data = []
    const data2Value = []

    const data3Data = []
    const data3Value = []

    for (let i = 0; i < data1.length; i++) {
      data1Data.push(data1[i].date)
      data1Value.push(data1[i].count)
    }

    for (let i = 0; i < data2.length; i++) {
      data2Data.push(data2[i].date)
      data2Value.push(data2[i].count)
    }

    for (let i = 0; i < data3.length; i++) {
      data3Data.push(data3[i].date)
      data3Value.push(data3[i].count)
    }

    const dateData = {
      doc1: {
        date: data1Data.reverse(),
        count: data1Value.reverse(),
      },
      doc2: {
        date: data2Data.reverse(),
        count: data2Value.reverse(),
      },
      doc3: {
        date: data3Data.reverse(),
        count: data3Value.reverse(),
      },
    }

    return dateData
  }

  return (
    <div className="dashboard-list-box">
      <HeaderList />
      <div className="dashboard-list-container-wrap">
        <MenuList defaultSelectedKeys={'3-0'} userInfo={userInfo} />
        <div className="dashboard-list-container">
          <div className="box">
            <div className="chart-box-wrap">
              <div className="title">杨帆医生统计数（总计{total1}）</div>
              <div id="chartBox1" className="chart-box"></div>
            </div>
            <div className="chart-box-wrap">
              <div className="title">杨帆医生每日审查数</div>
              <div id="chartBox2" className="chart-box"></div>
            </div>
          </div>

          <div className="box">
            <div className="chart-box-wrap">
              <div className="title">李腾海医生统计数（总计{total2}）</div>
              <div id="chartBox3" className="chart-box"></div>
            </div>
            <div className="chart-box-wrap">
              <div className="title">李腾海医生每日审查数</div>
              <div id="chartBox4" className="chart-box"></div>
            </div>
          </div>

          <div className="box">
            <div className="chart-box-wrap">
              <div className="title">周坦峰医生统计数（总计{total3}）</div>
              <div id="chartBox5" className="chart-box"></div>
            </div>
            <div className="chart-box-wrap">
              <div className="title">周坦峰医生每日审查数</div>
              <div id="chartBox6" className="chart-box"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThirdDashboard
