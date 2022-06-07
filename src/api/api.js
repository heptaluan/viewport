import axios from 'axios'
import { getURLParameters } from '../util/index'

// const basicUrl = getURLParameters(window.location.href).url
// axios.defaults.headers.common['X-Access-Token'] = getURLParameters(window.location.href).token

// // const basicUrl = 'http://139.196.114.118:9999'
const basicUrl = 'https://ct.feipankang.com/api'
// const basicUrl = 'http://192.168.1.204:9999'
axios.defaults.headers.common['X-Access-Token'] =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTQ2MTI3MjgsInVzZXJuYW1lIjoiZG9jdG9yX3Rlc3QifQ.hLc8k53Kl4mrbTwscLUXWgzjH9uz9dsck_ZrljxRnew'

// 获取序列列表（0-详情，1-订单跳转）
export const getMedicalList = (id, type) =>
  axios.get(`${basicUrl}/tailai-multiomics/multiomics/medicalImage/series/list?resource=${id}&type=${type}`)

// 获取影像列表
export const getImageList = resource =>
  axios.get(
    `${basicUrl}/tailai-multiomics/multiomics/medicalImage/instance/list?column=z_position&order=asc&archiveTaskId=${resource}`
  )

// 获取病人信息
export const getPatientsList = id =>
  axios.get(`${basicUrl}/tailai-multiomics/multiomics/medicalImage/taskMedicalCaseView/list?id=${id}`)

// 获取结节列表（管理员）
export const getNodeList = id => axios.get(`${basicUrl}/report/image/getDnResult?id=${id}`)

// 获取结节列表（医生）
export const getDoctorTask = id => axios.get(`${basicUrl}/report/doctorTask/task?id=${id}`)

// 保存结果
export const saveDnResult = params =>
  axios.post(`${basicUrl}/report/doctorTask/saveTask`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })

// 提交审核结果（测试用）
export const updateDnResultTemp = params =>
  axios.post(`${basicUrl}/report/image/updateDnResultTemp`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })

// 提交审核结果
export const updateDnResult = params =>
  axios.post(`${basicUrl}/report/image/updateDnResult`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })

// 新增结节
export const addNewNodeList = params =>
  axios.post(`https://ct.feipankang.com/image/new`, params, {
    headers: {
      'Content-Type': 'application/json',
    },
  })