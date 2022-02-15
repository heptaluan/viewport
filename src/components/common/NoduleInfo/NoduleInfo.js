import React from 'react'
import './NoduleInfo.scss'

const NoduleInfo = props => {
  return <div className="nodule-info-box">{props.noduleInfo ? <div className="nodule-detail">
    <span><em>影像层：</em>{props.noduleInfo.num}</span>
    <span><em>肺：</em>{props.noduleInfo.lung}</span>
    <span><em>肺叶：</em>{props.noduleInfo.lobe}</span>
    <span><em>大小：</em>{props.noduleInfo.size}</span>
    <span><em>体积：</em>{props.noduleInfo.noduleSize} mm³</span>
    <span><em>形态类型：</em>{props.noduleInfo.type}</span>
  </div> : null}</div>
}

export default NoduleInfo
