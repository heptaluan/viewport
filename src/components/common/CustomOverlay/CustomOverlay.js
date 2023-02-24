import React, { useState, useEffect } from 'react'
import './CustomOverlay.scss'
import cornerstone from 'cornerstone-core'
import {
  getNewNodeList,
  getBenignNodeList,
} from '../../../api/api'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import { message } from 'antd'

const dicomDateTimeToLocale = (dateTime, divide) => {
  if (dateTime) {
    const date = new Date(dateTime.substring(0, 4) + '-' + dateTime.substring(4, 6) + '-' + dateTime.substring(6, 8))
    const time = dateTime.substring(9, 11) + ':' + dateTime.substring(11, 13) + ':' + dateTime.substring(13, 15)
    const localeDate = date.toLocaleDateString()
    if (!divide) {
      return `${localeDate} ${time}`
    } else if (divide === 'date') {
      return `${localeDate}`
    } else if (divide === 'time') {
      return `${time}`
    }
  } else {
    return '--'
  }
}

const getBirth = identityNumber => {
  if (!identityNumber) {
    return '**'
  } else {
    var re = /\d{6}([12]\d{3})([01]\d)([0123]\d)\d{4}/
    var id = re.exec(identityNumber)
    return `${id[1]}-${id[2]}-${id[3]}`
  }
}

const CustomOverlay = props => {

  const params = qs.parse(useLocation().search)
  const [data, setData] = useState(null)
  const [patients, setPatients] = useState('')

  useEffect(() => {
    // 金标准数据
    const fetchNodeListData = async () => {
      const result = await getNewNodeList(params.imageCode)
      if (result.data.code === 200) {
        try {
          const data = result.data.data.samlpeDataList
          const patients = {
            age: data[0].patientAge,
            sex: data[0].patientSex === 'F' ? '0' : data[0].patientSex === 'M' ? '1' : '**',
          }
          setPatients(patients)
        } catch (error) {
          console.log(error)
        }
      } else if (result.data.code === 500) {
        message.error(`请求失败，请重新尝试`)
      }
    }

    // 良性结节数据
    const fetchBenignNodeListData = async () => {
      const result = await getBenignNodeList(params.id)
      if (result.data.code === 200) {
        try {
          const data = result.data.data
          const patients = {
            age: data.info.age,
            sex: data.info.sex ? data.info.sex : '**',
          }
          setPatients(patients)
        } catch (error) {
          console.log(error)
        }
      } else if (result.data.code === 500) {
        message.error(`请求失败，请重新尝试`)
      }
    }

    if (Number(params.type) === 2) {
      fetchNodeListData()
    } else if (Number(params.type) === 1) {
      fetchBenignNodeListData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    cornerstone.loadImage(props.imageId).then(image => {
      const data = {
        name: patients.name ? patients.name : '**',
        age: patients.age ? patients.age : '**',
        sex: patients.sex === '1' ? '男' : patients.sex === '0' ? '女' : '**',
        hospital: patients.source ? patients.source : '**',
        birth: '**',

        patientId: image.data.string('x00100020'),
        studyID: image.data.string('x00200010'),

        seriesNo: image.data.string('x00200011'),
        seriesDescription: image.data.string('x0008103e'),

        sliceThickness: image.data.string('x00180050'),
        sliceLocation: image.data.string('x00201041'),

        // day: dicomDateTimeToLocale(image.data.string('x00080022') + '.' + image.data.string('x00080032'), 'date'),
        // time: dicomDateTimeToLocale(image.data.string('x00080022') + '.' + image.data.string('x00080032'), 'time'),

        day: dicomDateTimeToLocale(image.data.string('x00080022') + '.' + image.data.string('x00080032'), 'date'),
        time: dicomDateTimeToLocale(image.data.string('x00080022') + '.' + image.data.string('x00080032'), 'time'),

        Rowsize: image.rows,
        Colsize: image.columns,
      }

      setData(data)
    })
  }, [props.imageId, patients])

  return (
    <ul className="custom-overlay-box">
      <div className="top-box">
        <div>
          <div className="list">
            图像帧：
            <span>
              {props.stackSize - props.imageIndex + 1} / {props.stackSize}（正序：{props.imageIndex - 1} /{' '}
              {props.stackSize}）
            </span>
          </div>
          <div className="list">
            缩放：<span>{props.scale.toFixed(2)}</span>
          </div>
          <div className="list">
            窗口/层级：
            <span>
              {Number(props.windowWidth).toFixed(2)} / {Number(props.windowCenter).toFixed(2)}{' '}
            </span>
          </div>
          <div className="list">
            大小：<span>{`${data?.Rowsize} x ${data?.Colsize}`}</span>
          </div>
          <div className="list">
            层厚：<span>{data?.sliceThickness} mm</span>
          </div>
          <div className="list">
            Patient ID：<span>{data?.patientId}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}></div>
      </div>
      <div className="bottom-box">
        <div>
          <div className="list">
            姓名：<span>{data?.name}</span>
          </div>
          <div className="list">
            性别：<span>{data?.sex}</span>
          </div>
          <div className="list">
            年龄：<span>{data?.age}</span>
          </div>
          <div className="list">
            生日：<span>{data?.birth}</span>
          </div>
          <div className="list">
            医院：<span>{data?.hospital}</span>
          </div>
          <div className="list">
            检测ID：<span>{data?.studyID}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div className="list">
            序列号：<span>{data?.seriesNo}</span>
          </div>
          <div className="list">
            序列描述：<span>{data?.seriesDescription ? data?.seriesDescription : '暂无描述'}</span>
          </div>
          <div className="list">
            位置：<span>{data?.sliceLocation} mm</span>
          </div>
          <div className="list">
            检查日期：<span>{data?.day}</span>
          </div>
          <div className="list">
            检查时间：<span>{data?.time}</span>
          </div>
        </div>
      </div>

      {/* <li>
        当前帧数：<span>{props.stackSize - props.imageIndex + 1}</span>
      </li>
      <li>
        总帧数：<span>{props.stackSize}</span>
      </li>
      <li>
        窗宽：<span>{Number(props.windowWidth).toFixed(2)} HU</span>
      </li>
      <li>
        窗位：<span>{Number(props.windowCenter).toFixed(2)} HU</span>
      </li> */}
    </ul>
  )
}

export default CustomOverlay
