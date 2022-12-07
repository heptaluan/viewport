import axios from 'axios'
import { getURLParameters } from '../util/index'

const basicUrl = `http://192.168.11.99:18080/dev-api`

axios.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})

// 获取验证码
export const getCodeImg = _ => axios.get(`${basicUrl}/captchaImage`)

// 登录
export const userLogin = params =>
  axios.post(`${basicUrl}/login`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })

// 获取默认列表
export const getDefaultList = _ => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/primary/missionList`
  )
}

// 获取结节列表
export const getNodeList = orderId =>{
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/primary/node/${orderId}`
  )
}

// 获取影像列表
export const getImageList = dicomId => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/primary/image/${dicomId}`
  )
}


// const basicUrl = getURLParameters(window.location.href).url
// axios.defaults.headers.common['X-Access-Token'] = getURLParameters(window.location.href).token

// http://localhost:3000/ct/viewer/1?&url=/api&type=undefined&id=1503929871832645633&orderId=1503628225604390914&user=doctor&resource=1503913389228199938&state=undefined&taskId=1503929871832645633&doctorId=1503929871832645633&backId=undefined&backType=check&page=review&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTYyNjg4MTQsInVzZXJuYW1lIjoiZG9jdG9yX3Rlc3QifQ.w-8bVodwtdCgOUCTPKa-nWVeYFvTjICQxmUDl3pnGEA
// // const basicUrl = 'http://139.196.114.118:9999'
// const basicUrl = 'https://yyds.ananpan.com/api'
// const basicUrl = 'http://192.168.1.204/api'
// const basicUrl = 'https://ai.feipankang.com/api'
// axios.defaults.headers.common['X-Access-Token'] =
  // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzAyNTE1NzYsInVzZXJuYW1lIjoiZG9jdG9yX3Rlc3QifQ.o5OQ2LyvlCwHtGhqGczU5ZrhJUTjHplfhBIA6RVpVho'

// 获取影像列表
// export const getImageList = resource =>
//   axios.get(
//     `${basicUrl}/tailai-multiomics/multiomics/medicalImage/instance/list?column=z_position&order=asc&archiveTaskId=${resource}`
//   )

// 查看临床影像
export const getClinicalFiles = orderId =>
  axios.get(`${basicUrl}/tailai-multiomics/multiomics/bizAppendix/findCtDiagnoseByOrder/${orderId}`)

// 获取病人信息
export const getPatientsList = id =>
  axios.get(`${basicUrl}/tailai-multiomics/multiomics/medicalImage/taskMedicalCaseView/list?id=${id}`)

// 获取结节列表（医生）
export const getDoctorTask = id => axios.get(`${basicUrl}/report/doctorTask/task?id=${id}`)

// 保存结果
export const saveDnResult = params =>
  axios.post(`${basicUrl}/report/doctorTask/saveTask`, params, {
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

// 提交审核结果（总医生）
export const updateSuperDoctorResult = params =>
  axios.post(`${basicUrl}/report/image/updateSuperDoctorResult`, params, {
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

// 下载文件
export const downloadZip = (orderId, resource) =>
  axios.get(`${basicUrl}/multiomics/medicalImage/getPreSignedUrl?orderId=${orderId}&taskId=${resource}`)
