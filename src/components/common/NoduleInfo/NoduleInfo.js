import React, { useState, useEffect } from 'react'
import './NoduleInfo.scss'
import { Radio, Select, Button, Input, Segmented, Checkbox } from 'antd'

const { TextArea } = Input

const { Option } = Select

const NoduleInfo = props => {
  const [btnGroup, setBtnGroup] = useState([
    {
      id: 0,
      val: 0,
      checked: true,
    },
    {
      id: 1,
      val: 1,
      checked: false,
    },
    {
      id: 2,
      val: 2,
      checked: false,
    },
    {
      id: 3,
      val: 3,
      checked: false,
    },
    {
      id: 4,
      val: 4,
      checked: false,
    },
    {
      id: 5,
      val: 5,
      checked: false,
    },
    {
      id: 6,
      val: 6,
      checked: false,
    },
    {
      id: 7,
      val: 7,
      checked: false,
    },
    {
      id: 8,
      val: 8,
      checked: false,
    },
    {
      id: 9,
      val: 9,
      checked: false,
    },
  ])

  const [riskData, setRiskData] = useState(0)

  useEffect(() => {
    if (props.noduleInfo) {
      setRiskData(parseInt(props.noduleInfo.scrynMaligant))
    }
  }, [props.noduleInfo])

  useEffect(() => {
    if (props.noduleInfo?.scrynMaligant) {
      let num = 0
      const risk = parseInt(props.noduleInfo.scrynMaligant)
      if (risk < 10) {
        num = 0
      } else {
        num = parseInt(risk / 10)
      }
      handleSetButtonActive(num)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.noduleInfo])

  const onLungChange = e => {
    props.checkNoduleList(e.target.value, 'lung')
    if (e.target.value === '左肺' && props.noduleInfo.lobe === '中叶') {
      props.checkNoduleList('上叶', 'lobe')
    }
  }

  const onLobeChange = e => {
    props.checkNoduleList(e.target.value, 'lobe')
  }

  const handleSelectChange = val => {
    props.checkNoduleList(val, 'type')
  }

  const handleSoakChange = val => {
    props.checkNoduleList(val, 'soak')
  }

  // 风险值输入框事件
  const handleRiskInputChange = val => {
    handleSetButtonActive(parseInt(Number(val / 10)))
    setRiskData(val)
    props.handleUpdateRisk(val, 'inputChange')
  }

  const handleRishInputBlur = e => {
    handleSetButtonActive(parseInt(Number(e.target.value / 10)))
    props.handleUpdateRisk(Number(e.target.value))
  }

  // 设置当中按钮选中
  const handleSetButtonActive = num => {
    if (isNaN(num)) {
      return false
    }
    if (num > 9 || num < 0) {
      return false
    }
    btnGroup.map(item => (item.checked = false))
    const item = btnGroup.find(item => item.id === num)
    item.checked = true
    setBtnGroup([...btnGroup])
  }

  const handleRishButtonClick = val => {
    handleSetButtonActive(val)
    const curRisk = val * 10 + Math.floor(Math.random() * 10)
    setRiskData(curRisk)
    props.handleUpdateRisk(Number(curRisk))
  }

  // ==================================================
  // ==================================================

  const options = [
    { label: 'Apple', value: '1' },
    { label: 'Pear', value: '2' },
    { label: 'Orange', value: '3' },
    { label: 'Orange1', value: '32' },
    { label: 'Orange2', value: '31' },
  ]

  return (
    // <div className="nodule-info-box">
    //   {/* {props.noduleInfo ? (
    //     <div className="nodule-info">
    //       <div className="list">
    //         <div className="list-title">类型：</div>
    //         <Select
    //           size="small"
    //           value={props.noduleInfo.type}
    //           style={{ width: 185, fontSize: 13 }}
    //           onChange={handleSelectChange}
    //           disabled={props.noduleInfo.state === false || props.noduleInfo.state === undefined}
    //         >
    //           <Option value="肺内实性">肺内实性</Option>
    //           <Option value="部分实性">部分实性</Option>
    //           <Option value="磨玻璃">磨玻璃</Option>
    //           <Option value="肺内钙化">肺内钙化</Option>
    //           <Option value="胸膜实性">胸膜实性</Option>
    //           <Option value="胸膜钙化">胸膜钙化</Option>
    //           <Option value="其它（包括不可分辨）">其它（包括不可分辨）</Option>
    //         </Select>
    //       </div>

    //       <div className="check-group">
    //         <div className="group-wrap">
    //           <span>是否标注为良性样本</span>
    //           <div className="group">
    //             <Button
    //               type={props.noduleInfo.state === false ? 'primary' : null}
    //               style={{ marginRight: '15px' }}
    //               size="small"
    //               onClick={e => props.updateNoduleList(false)}
    //             >
    //               否
    //             </Button>
    //             <Button
    //               type={props.noduleInfo.state === true ? 'primary' : null}
    //               size="small"
    //               onClick={e => props.updateNoduleList(true)}
    //             >
    //               是
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ) : null} */}

    //   {/*
    //   {props.noduleInfo ? (
    //     <div className="nodule-detail">
    //       <div className="list">
    //         <span className="list-title">肺：</span>
    //         <Radio.Group onChange={onLungChange} value={props.noduleInfo.lung}>
    //           <Radio value={'右肺'}>右肺</Radio>
    //           <Radio value={'左肺'}>左肺</Radio>
    //         </Radio.Group>
    //       </div>

    //       <div className="list">
    //         <div className="list-title">肺叶：</div>
    //         <Radio.Group onChange={onLobeChange} value={props.noduleInfo.lobe}>
    //           <Radio value={'上叶'}>上叶</Radio>
    //           {props.noduleInfo.lung === '左肺' ? null : <Radio value={'中叶'}>中叶</Radio>}
    //           <Radio value={'下叶'}>下叶</Radio>
    //         </Radio.Group>
    //       </div>

    //       <div className="list">
    //         <div className="list-title">类型：</div>
    //         <Select
    //           size="small"
    //           value={props.noduleInfo.type}
    //           style={{ width: 185, fontSize: 13 }}
    //           onChange={handleSelectChange}
    //         >
    //           <Option value="肺内实性">肺内实性</Option>
    //           <Option value="部分实性">部分实性</Option>
    //           <Option value="磨玻璃">磨玻璃</Option>
    //           <Option value="肺内钙化">肺内钙化</Option>
    //           <Option value="胸膜实性">胸膜实性</Option>
    //           <Option value="胸膜钙化">胸膜钙化</Option>
    //           <Option value="其他">其他</Option>
    //         </Select>
    //       </div>

    //       {props.noduleInfo.newSoak ? (
    //         <div className="list" style={{ marginTop: 3 }}>
    //           <div className="list-title">浸润类型：</div>
    //           <Select
    //             disabled="disabled"
    //             size="small"
    //             value={props.noduleInfo.newSoak}
    //             style={{ width: 185, fontSize: 13 }}
    //             onChange={handleSoakChange}
    //           >
    //             <Option value="AAH">AAH（非典型腺瘤样增生）</Option>
    //             <Option value="AIS">AIS（原位腺癌）</Option>
    //             <Option value="MIA">MIA（微浸润性腺癌）</Option>
    //             <Option value="IA">IA（浸润性腺癌）</Option>
    //             <Option value="OTHER">OTHER（其他）</Option>
    //           </Select>
    //         </div>
    //       ) : null}

    //       <div className="list">
    //         <em>大小：</em>
    //         {props.noduleInfo.diameter ? props.noduleInfo.diameter : '-'}
    //       </div>

    //       {props.noduleInfo.newDiameter ? (
    //         <div className="list">
    //           <em>大小调整后：</em>
    //           {props.noduleInfo.nodeType === 1 ? (
    //             <span style={{ color: '#ff4d4f' }}>{props.noduleInfo.diameter ? props.noduleInfo.diameter : '-'}</span>
    //           ) : (
    //             <span style={{ color: '#ff4d4f' }}>
    //               {props.noduleInfo.newDiameter ? props.noduleInfo.newDiameter : '-'}
    //             </span>
    //           )}
    //         </div>
    //       ) : null}

    //       <div className="list">
    //         <em>体积：</em>
    //         {props.noduleInfo.noduleSize ? props.noduleInfo.noduleSize : '-'} mm³
    //       </div>

    //       {props.noduleInfo.newNoduleSize ? (
    //         <div className="list">
    //           <em>体积调整后：</em>
    //           {props.noduleInfo.nodeType === 1 ? (
    //             <span style={{ color: '#ff4d4f' }}>
    //               {props.noduleInfo.noduleSize ? props.noduleInfo.noduleSize : '-'} mm³
    //             </span>
    //           ) : (
    //             <span style={{ color: '#ff4d4f' }}>
    //               {props.noduleInfo.newNoduleSize ? props.noduleInfo.newNoduleSize : '-'} mm³
    //             </span>
    //           )}
    //         </div>
    //       ) : null}

    //       <div className="list adjust">
    //         <Button size="small" onClick={props.handleShowAdjustModal}>
    //           调整
    //         </Button>

    //         <Button
    //           size="small"
    //           style={{ marginLeft: 10 }}
    //           onClick={props.handleShowMarkModal}
    //         >
    //           标记微小结节
    //         </Button>
    //       </div>

    //       <div className="list">
    //         <em>恶性风险：</em>
    //         {props.noduleInfo.risk ? `${props.noduleInfo.risk}%` : '-'}
    //         <InputNumber
    //           addonAfter="%"
    //           placeholder="请输入风险值"
    //           size="small"
    //           style={{ width: 110, height: 24, marginTop: 2, marginLeft: 18, fontSize: 13 }}
    //           onChange={val => handleRiskInputChange(val)}
    //           onBlur={e => handleRishInputBlur(e)}
    //           value={riskData}
    //           min={1}
    //           max={99}
    //         />
    //       </div>

    //       <div className="list list-btn-box">
    //         {btnGroup.map((item, index) => (
    //           <div className="list-btn-group" key={item.id}>
    //             <Button
    //               type={item.checked === true ? 'primary' : null}
    //               size="small"
    //               onClick={e => handleRishButtonClick(item.val)}
    //             >
    //               {item.val}
    //             </Button>
    //           </div>
    //         ))}
    //       </div>

    //       <div className="list" style={{ marginBottom: 8, height: 'auto' }}>
    //         <em>备注：</em>
    //         <TextArea
    //           rows={4}
    //           placeholder="请输入结节备注信息"
    //           size="small"
    //           style={{ width: 205, marginTop: 2, fontSize: 13, resize: 'none', minHeight: 85 }}
    //           onChange={props.handleTextareaOnChange}
    //           onBlur={props.handleInputBlur}
    //           value={props.noduleInfo?.suggest}
    //         />
    //       </div>
    //     </div>
    //   ) : null}

    //   {props.noduleInfo ? (
    //     <div className="check-group">
    //       <div className="group-wrap">
    //         <span>是否为结节</span>
    //         <div className="group">
    //           <Button
    //             type={props.noduleInfo.state === false ? 'primary' : null}
    //             style={{ marginRight: '15px' }}
    //             size="small"
    //             onClick={e => props.updateNoduleList(false)}
    //           >
    //             否
    //           </Button>
    //           <Button
    //             type={props.noduleInfo.state === true ? 'primary' : null}
    //             size="small"
    //             onClick={e => props.updateNoduleList(true)}
    //           >
    //             是
    //           </Button>
    //         </div>
    //       </div>
    //     </div>
    //   ) : null} */}
    // </div>

    <div className="mark-box-wrap">
      <div className="box-title">肺结节标注标签</div>

      <div className="list-title">发现</div>
      <div className="mark-box">
        <div className="mark-title">检测难易度</div>
        <div className="mark-content">
          <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
        </div>
      </div>

      <hr />

      <div className="list-title">外观特征</div>
      <div className="mark-box flex">
        <div className="mark-title">位置</div>
        <div className="mark-content">
          <Select
            size="small"
            value={'右肺上叶（RUL）'}
            style={{ width: 160, fontSize: 13 }}
            onChange={handleSelectChange}
          >
            <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
            <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
            <Option value="右肺下页叶（RLL）">右肺下页叶（RLL）</Option>
            <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
            <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
          </Select>
        </div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">大小</div>
        <div className="mark-content">
          <Select
            size="small"
            value={'右肺上叶（RUL）'}
            style={{ width: 160, fontSize: 13 }}
            onChange={handleSelectChange}
          >
            <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
            <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
            <Option value="右肺下页叶（RLL）">右肺下页叶（RLL）</Option>
            <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
            <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
          </Select>
        </div>
        <Button size="small" onClick={props.handleShowAdjustModal}>
          调整
        </Button>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">形态分页</div>
        <div className="mark-content">
          <Select
            size="small"
            value={'右肺上叶（RUL）'}
            style={{ width: 160, fontSize: 13 }}
            onChange={handleSelectChange}
          >
            <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
            <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
            <Option value="右肺下页叶（RLL）">右肺下页叶（RLL）</Option>
            <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
            <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
          </Select>
        </div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">球形</div>
        <div className="mark-content">
          <Select
            size="small"
            value={'右肺上叶（RUL）'}
            style={{ width: 160, fontSize: 13 }}
            onChange={handleSelectChange}
          >
            <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
            <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
            <Option value="右肺下页叶（RLL）">右肺下页叶（RLL）</Option>
            <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
            <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
          </Select>
        </div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">边缘/毛刺</div>
        <div className="mark-content">
          <Select
            size="small"
            value={'右肺上叶（RUL）'}
            style={{ width: 160, fontSize: 13 }}
            onChange={handleSelectChange}
          >
            <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
            <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
            <Option value="右肺下页叶（RLL）">右肺下页叶（RLL）</Option>
            <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
            <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
          </Select>
        </div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">棘突</div>
        <div className="mark-content">123</div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">结节-肺界面</div>
        <div className="mark-content">
          <Select
            size="small"
            value={'右肺上叶（RUL）'}
            style={{ width: 160, fontSize: 13 }}
            onChange={handleSelectChange}
          >
            <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
            <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
            <Option value="右肺下页叶（RLL）">右肺下页叶（RLL）</Option>
            <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
            <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
          </Select>
        </div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">临近关系</div>
        <div className="mark-content">
          <Checkbox.Group options={options} defaultValue={['Apple']} />
        </div>
      </div>

      <hr />

      <div className="list-title">内部特征</div>
      <div className="mark-box flex">
        <div className="mark-title">结构成分</div>
        <div className="mark-content">
          <Checkbox.Group options={options} defaultValue={['Apple']} />
        </div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">结构关系</div>
        <div className="mark-content">
          <Checkbox.Group options={options} defaultValue={['Apple']} />
        </div>
      </div>

      <hr />

      <div className="list-title">结节类型</div>
      <div className="mark-box flex">
        <div className="mark-content">
          <Select
            size="small"
            value={'右肺上叶（RUL）'}
            style={{ width: 160, fontSize: 13 }}
            onChange={handleSelectChange}
          >
            <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
            <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
            <Option value="右肺下页叶（RLL）">右肺下页叶（RLL）</Option>
            <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
            <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
          </Select>
        </div>
      </div>

      {/* <div className="mark-box">
        <div className="mark-title">部分实性</div>
        <div className="mark-content">
          <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
        </div>
      </div>
      <div className="mark-box">
        <div className="mark-title">肺内钙化</div>
        <div className="mark-content">
          <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
        </div>
      </div>
      <div className="mark-box">
        <div className="mark-title">胸膜钙化</div>
        <div className="mark-content">
          <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
        </div>
      </div> */}

      <hr />

      <div className="list-title">良恶性</div>
      <div className="mark-box">
        <div className="mark-title">危险程度</div>
        <div className="mark-content">
          <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
        </div>
      </div>
    </div>
  )
}

export default NoduleInfo
