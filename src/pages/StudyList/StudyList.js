import React, { useState } from 'react'
import './StudyList.scss'
import { useHistory } from 'react-router-dom'
import { Table, Input, Button, Space } from 'antd'

const StudyList = () => {
  const [dataSource, setDataSource] = useState([
    {
      id: 1,
      key: '1',
      name: '张三',
      age: 32,
      day: '2020-02-02',
      date: '08:45:14',
      mm: '1.5',
      fps: '100',
    },
    {
      id: 2,
      key: '2',
      name: '李四',
      age: 32,
      day: '2020-02-02',
      date: '08:45:14',
      mm: '1.5',
      fps: '100',
    },
  ])

  const columns = [
    {
      title: '受检者编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '检查日期',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: '检查时间',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '层厚（mm）',
      dataIndex: 'mm',
      key: 'mm',
    },
    {
      title: '图像帧数',
      dataIndex: 'fps',
      key: 'fps',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleShowDetail(record)}>查看详情</a>
        </Space>
      ),
    },
  ]

  const history = useHistory()

  const handleShowDetail = record => {
    history.push(`/viewer/${record.id}`)
  }

  return (
    <div className="study-list-container">
      <div className="search-box-wrap">
        <div className="header">
          <Button type="primary">搜索</Button>
          <Button type="primary" style={{ marginLeft: 15 }}>
            重置
          </Button>
        </div>
        <div className="search-box">
          <Input style={{ width: 200 }} placeholder="请输入姓名" />
          <Input style={{ width: 200 }} placeholder="请输入身份证号" />
          <Input style={{ width: 200 }} placeholder="请输入年龄" />
        </div>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        onRow={record => {
          return {
            onDoubleClick: event => {
              console.log(event)
            },
          }
        }}
      />
    </div>
  )
}

export default StudyList
