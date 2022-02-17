import React, { useState } from 'react'
import './NoduleInfo.scss'
import { Radio, Select } from 'antd'

const { Option } = Select

const NoduleInfo = props => {
  const [lung, setLung] = useState('右肺')
  const [lobe, setLobe] = useState('中叶')

  const onLungChange = e => {
    setLung(e.target.value)
    props.checkNoduleList(e.target.value, 'lung')
  }

  const onLobeChange = e => {
    setLobe(e.target.value)
    props.checkNoduleList(e.target.value, 'lobe')
  }

  const handleSelectChange = e => {
    console.log(e)
  }

  return (
    <div className="nodule-info-box">
      {props.noduleInfo ? <div></div> : null}

      <div className="nodule-detail">
        <div className="list">
          <em>影像层：</em>
          {/* {props.noduleInfo.num} */}
        </div>
        {/* <span><em>肺：</em>{props.noduleInfo.lung}</span> */}
        <div className="list">
          <span className="list-title">肺：</span>
          <Radio.Group onChange={onLungChange} value={lung}>
            <Radio value={'左肺'}>左肺</Radio>
            <Radio value={'右肺'}>右肺</Radio>
          </Radio.Group>
        </div>
        <div className="list">
          <div className="list-title">肺叶：</div>
          {/* {props.noduleInfo.lobe} */}
          <Radio.Group onChange={onLobeChange} value={lobe}>
            <Radio value={'上叶'}>上叶</Radio>
            {lung === '左肺' ? null : <Radio value={'中叶'}>中叶</Radio>}
            <Radio value={'下叶'}>下叶</Radio>
          </Radio.Group>
        </div>
        <div className="list">
          <div className="list-title">类型：</div>
          <Select defaultValue="磨玻璃" style={{ width: 170 }} onChange={handleSelectChange}>
            <Option value="磨玻璃">磨玻璃</Option>
            <Option value="磨玻璃">磨玻璃</Option>
            <Option value="磨玻璃">磨玻璃</Option>
          </Select>
        </div>
        {/* <div  className="list">
            <em>大小：</em>
            {props.noduleInfo.size}
          </div>
          <div  className="list">
            <em>体积：</em>
            {props.noduleInfo.noduleSize} mm³
          </div>
          <div  className="list">
            <em>形态类型：</em>
            {props.noduleInfo.type}
          </div> */}
      </div>
    </div>
  )
}

export default NoduleInfo
