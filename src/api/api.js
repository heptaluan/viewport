import axios from 'axios'
import { getURLParameters } from '../util/index'

// const basicUrl = getURLParameters(window.location.href).url
// axios.defaults.headers.common['X-Access-Token'] = getURLParameters(window.location.href).token

// const basicUrl = 'http://139.196.114.118:9999'
const basicUrl = 'http://192.168.1.204:9999'
axios.defaults.headers.common['X-Access-Token'] =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDU0NTk2MjEsInVzZXJuYW1lIjoiYWRtaW4ifQ.DaSPWO8SDhtJoMBzUS-P4jXrLO28HHxRaXhP2VptODI'

// 获取序列列表（0-详情，1-订单跳转）
export const getMedicalList = (id, type) =>
  axios.get(`${basicUrl}/tailai-multiomics/multiomics/medicalImage/series/list?resource=${id}&type=${type}`)

// 获取影像列表
export const getImageList = id =>
  axios.get(
    `${basicUrl}/tailai-multiomics/multiomics/medicalImage/instance/list?seriesInstanceUid=${id}&column=instanceNumber&order=asc`
  )

// 获取病人信息
export const getPatientsList = id =>
  axios.get(`${basicUrl}/tailai-multiomics/multiomics/medicalImage/taskMedicalCaseView/list?id=${id}`)

// 获取结节列表
export const getNodeList = id => axios.get(`${basicUrl}/tailai-report/report/image/getDnResult?id=${id}`)

// 提交审核结果
export const updateDnResult = params =>
  axios.post(`${basicUrl}/tailai-report/report/image/updateDnResult`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
