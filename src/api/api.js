import axios from 'axios'
// import { getURLParameters } from '../util/index'

// const basicUrl = `http://192.168.11.99:18080/dev-api`
const basicUrl = `http://192.168.11.53:16880`
// const basicUrl = `http://ky.feipankang.com/api`
// const basicUrl = `http://192.168.1.64:16880`
// const basicUrl = `http://192.168.11.99:16880`

axios.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 7-20 临时添加，复制的第三批数据审核

// ===========================================================================

// ===========================================================================

// ===========================================================================

// ===========================================================================

// 新增结节
export const newResult = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(`${basicUrl}/research/newResult`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

// 获取详情
export const getFiveResearchDetail = id => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/research/detail/${id}`)
}

// 获取对应的影像列表
export const getFiveViewerImageList = pcode => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`http://192.168.1.107:19001/sortlist/${pcode}/`)
}

// 获取良性结节列表
export const getFiveBenignList = (isFinish, searchId) => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/research/list?isFinish=${isFinish}&kyPrimaryId=${searchId || ''}&project=4`)
}

// 暂存二筛结果
export const researchUpdateResult = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(`${basicUrl}/research/updateResult`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

// 最新的，第三批数据审核，只有良恶选项

// ===========================================================================

// ===========================================================================

// ===========================================================================

// ===========================================================================

// 获取对应的影像列表
export const getFourViewerImageList = pcode => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`http://192.168.1.107:19000/sortlist/--3000_158--${pcode}/`)
}

// 获取良性结节列表
export const getFourBenignList = (isFinish, searchId) => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/secondprimary/list?isFinish=${isFinish}&kyPrimaryId=${searchId || ''}&project=3`)
}

// ===========================================================================

// ===========================================================================

// ===========================================================================

// ===========================================================================

// 获取验证码
export const getCodeImg = _ => {
  axios.defaults.headers.common['Authorization'] = ''
  return axios.get(`${basicUrl}/captchaImage`)
}

// 登录
export const userLogin = params =>
  axios.post(`${basicUrl}/login`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })

// 获取用户角色
export const getInfo = _ => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/getInfo`)
}

// 获取总医生列表
export const getChiefList = isFinish => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/primary/missionList?isFinish=${isFinish}`)
}

// 获取普通医生列表
export const getDoctorList = (isFinish, searchId) => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/secondprimary/list?isFinish=${isFinish}&kyPrimaryId=${searchId || ''}&project=1`)
}

// 多组学结节列表（复用之前杨医生的列表）
export const getMissionList = (isFinish, searchId) => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/secondprimary/list?isFinish=${isFinish}&kyPrimaryId=${searchId || ''}&project=2`)
}

// 获取分配列表
export const getAssignList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/primary/primaryList?isAssign=${params.isAssign}&name=${params.name}&pcode=${params.pcode}`
  )
}

// 获取可分配医生列表
export const getAssignUsersList = _ => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/primary/assignUsers`)
}

// 提交分配结果
export const addAssignResult = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(`${basicUrl}/primary/assign?users=${params.users}&ids=${params.ids}`)
}

// 获取结节列表
export const getNodeList = orderId => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/primary/node/${orderId}`)
}

// 获取影像列表
export const getImageList = dicomId => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/primary/image/${dicomId}`)
}

// 获取二次筛选详情
export const getSecondprimaryDetail = id => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/secondprimary/detail/${id}`)
}

// 新增初筛结果
export const addNewResult = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(`${basicUrl}/primary/add`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

// 提交二筛结果
export const addSecondprimaryResult = id => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(
    `${basicUrl}/secondprimary/updateList/${id}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
  )
}

// 暂存二筛结果
export const saveSecondprimaryResult = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(`${basicUrl}/secondprimary/updateResult`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

// 分配任务
export const assignList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(`${basicUrl}/assign`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

// ===========================================================================

// ===========================================================================

// ===========================================================================

// ===========================================================================

// 金标准列表（李主任）
export const getSecondChiefStndrdList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/thirdMark/chiefList?type=2&imageCode=${params.imageCode}&isFinish=${params.isFinish}&batchId=1`
  )
}

// 良性结节列表（李主任）
export const getSecondChiefBenignList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/thirdMark/chiefList?type=1&kyPrimaryId=${params.kyPrimaryId || ''}&isFinish=${
      params.isFinish
    }&batchId=1`
  )
}

// 获取金标准列表（医生）
export const getMarkList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/thirdMark/getTaskList?type=2&imageCode=${params.imageCode}&isFinish=${params.isFinish}&batchId=1`
  )
}

// 获取良性结节列表（医生）
export const getBenignNoduleList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/thirdMark/getTaskList?type=1&kyPrimaryId=${params.kyPrimaryId || ''}&isFinish=${
      params.isFinish
    }&batchId=1`
  )
}

// 新的结节详情（金标准）
export const getNewNodeList = id => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/thirdMark/detail/${id}`)
}

// 新的结节详情（良性结节）
export const getBenignNodeList = id => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/thirdMark/detail1/${id}`)
}

// 新的影像列表
export const getNewImageList = url => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`http://192.168.1.107:19000/sortlist/${url}/`)
}

// 完成软标签详细结果
export const updateResult = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(`${basicUrl}/thirdMark/updateResult`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

// 完成软标签（检阅完成后提交最终结果）
export const updateList = id => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(
    `${basicUrl}/thirdMark/updateList/${id}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
  )
}

// ===========================================================================

// ===========================================================================

// ===========================================================================

// ===========================================================================

// 获取三千软标签统计数据
export const getThirdStatisticData = type => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/statistics/getByType/${type || 2}/2`)
}

// 结节筛选列表
export const getAllNoduleList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/thirdMark/selectNode/${params.nid}?batchId=2`)
}

// 三千金标准列表（李主任）
export const getThirdChiefStndrdList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/thirdMark/chiefList?type=2&imageCode=${params.imageCode}&isFinish=${params.isFinish}&staffCount=${params.staffCount}&batchId=2`
  )
}

// 获取良性结节列表（李主任）
export const getThirdChiefBenignList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/thirdMark/chiefList?type=1&kyPrimaryId=${params.kyPrimaryId || ''}&isFinish=${
      params.isFinish
    }&staffCount=${params.staffCount}&batchId=2`
  )
}

// 三千金标准列表（医生）
export const getThirdStndrdList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/thirdMark/getTaskList?type=2&imageCode=${params.imageCode}&isFinish=${params.isFinish}&batchId=2`
  )
}

// 获取良性结节列表（医生）
export const getThirdBenignList = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(
    `${basicUrl}/thirdMark/getTaskList?type=1&kyPrimaryId=${params.kyPrimaryId || ''}&isFinish=${
      params.isFinish
    }&batchId=2`
  )
}

// 三千金标准详情（李主任用，医生还是走之前的二筛流程）
export const getThirdStndrdDetail = imageCode => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/thirdMark/chiefDetail/${imageCode}`)
}

// 三千良性结节详情（李主任用，医生还是走之前的二筛流程）
export const getThirdBenignDetail = kyPrimaryId => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.get(`${basicUrl}/thirdMark/chiefDetail1/${kyPrimaryId}`)
}

// 完成三千软标签（右上角提交最终结果）
export const chiefFinish = id => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(
    `${basicUrl}/thirdMark/chiefFinish/${id}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
  )
}

// 暂存三千修改结果
export const saveChiefReviseResult = params => {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
  return axios.post(`${basicUrl}/thirdMark/chiefReviseResult`, params, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
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
