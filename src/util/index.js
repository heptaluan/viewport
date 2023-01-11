/* eslint-disable no-sequences */
export const getURLParameters = url =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),
    {}
  )

// 格式化中心直径
export const formatDiameter = diameter => {
  if (diameter) {
    return Math.max(...diameter.replace('*', '').split('mm'))
  } else {
    return ''
  }
}

// 根据结节类型调整背景颜色
export const formatNodeStyle = item => {
  const maxSize = Number(localStorage.getItem('diameterSize'))
  const diameterSize = formatDiameter(item.diameter)
  const newDiameterSize = formatDiameter(item.newDiameter)
  if (newDiameterSize) {
    if (diameterSize <= maxSize && newDiameterSize >= maxSize) {
      return 'blue-item'
    } else if (diameterSize <= maxSize && newDiameterSize <= maxSize) {
      return 'green-item'
    } else if (diameterSize >= maxSize && newDiameterSize <= maxSize) {
      return 'red-item'
    }
  } else {
    if (diameterSize <= maxSize) {
      return 'green-item'
    }
  }
}

// 计算微小结节个数
export const formatMiniNodule = list => {
  const maxSize = Number(localStorage.getItem('diameterSize'))
  const target = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].diameterSize <= maxSize) {
      target.push(list[i])
    }
  }
  return target.length
}

// 计算结节大小平均值
export const formatSizeMean = val => {
  if (val) {
    const list = val
      .replace('*', '')
      .split('mm')
      .filter(n => n)
    const max = Math.max(...list) > 35 ? 35 : Math.max(...list)
    const min = Math.min(...list) > 35 ? 35 : Math.min(...list)
    return ((max + min) / 2).toFixed()
  } else {
    return ''
  }
}

// 格式化 size 属性
export const formatNodeSize = size => {
  if (size) {
    if (size < 5) {
      return `微小结节`
    } else if (size >= 5 && size < 10) {
      return `小结节`
    } else if (size >= 10 && size <= 30) {
      return `结节/大结节`
    } else if (size > 30) {
      return `肿块`
    }
  } else {
    return ''
  }
}

// 格式化结节类型
export const formatNodeType = checkItme => {
  if (checkItme.nodeType === '部分实性') {
    return checkItme.nodeTypePartSolid
  } else if (checkItme.nodeType === '肺内钙化') {
    return checkItme.nodeTypeLungCalcific
  } else if (checkItme.nodeType === '胸膜钙化') {
    return checkItme.nodeTypePleuraCalcific
  } else {
    return 0
  }
}

// 格式化良恶性
export const formatDanger = val => {
  if (val === 0) {
    return '良性'
  } else if (val > 0 && val < 5) {
    return '考虑良性'
  } else if (val >= 5 && val <= 40) {
    return '不除外恶性'
  } else if (val > 40 && val <= 65) {
    return '恶性可能'
  } else if (val > 65) {
    return '考虑恶性'
  }
}

// 格式化结节类型所选值
export const formatNodeTypeRemark = val => {
  if (val >= 0 && val < 25) {
    return '非常微妙'
  } else if (val >= 25 && val < 50) {
    return '适度微妙'
  } else if (val >= 50 && val < 75) {
    return '微妙'
  } else if (val >= 75 && val < 100) {
    return '中度明显'
  } else if (val === 100) {
    return '显而易见'
  }
}