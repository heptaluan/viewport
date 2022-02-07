import axios from 'axios'
import { getURLParameters } from '../util/index'

// const basicUrl = getURLParameters(window.location.href).url
// axios.defaults.headers.common['X-Access-Token'] = getURLParameters(window.location.href).token

const basicUrl = 'http://139.196.114.118:9999'
axios.defaults.headers.common['X-Access-Token'] =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDQxNjc1MDcsInVzZXJuYW1lIjoiYWRtaW4ifQ.KR4In3ccz6zgW3glFzczzB9qL_DSiUYFcX-l901OKrk'

// 获取序列列表（0-详情，1-订单跳转）
export const getMedicalList = (id, type) =>
  axios.get(`${basicUrl}/tailai-multiomics/multiomics/medicalImage/series/list?resource=${id}&type=${type}`)

// 获取图片详情
export const getImageList = id =>
  axios.get(
    `${basicUrl}/tailai-multiomics/multiomics/medicalImage/instance/list?seriesInstanceUid=${id}&column=instanceNumber&order=asc`
  )

// 获取病人信息
export const getPatientsList = (id, type) =>
  axios.get(`${basicUrl}/tailai-multiomics/multiomics/medicalImage/patients/list?resource=${id}&type=${type}`)
