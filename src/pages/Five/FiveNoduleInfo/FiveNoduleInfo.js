import React, { useState, useEffect } from 'react'
import './FiveNoduleInfo.scss'
import { Select, Button } from 'antd'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'

const { Option } = Select

const FiveNoduleInfo = props => {
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

  const params = qs.parse(useLocation().search)

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

  const handleSelectChange = val => {
    props.checkNoduleList(val, 'type')
  }
  
  const handleSoakChange = val => {
    props.checkNoduleList(val, 'soak')
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

  return (
    <div className="nodule-info-box">
      {props.noduleInfo ? (
        <div className="nodule-info">
          {Number(params.isFinish) === 1 ? <div className="disabled-mask"></div> : null}

          <div className="list">
            <div className="list-title">类型：</div>
            <Select
              disabled={Number(params.isFinish) === 1}
              size="small"
              value={props.noduleInfo.type}
              style={{ width: 185, fontSize: 13 }}
              onChange={handleSelectChange}
            >
              <Option value="肺内实性">肺内实性</Option>
              <Option value="部分实性">部分实性</Option>
              <Option value="磨玻璃">磨玻璃</Option>
              <Option value="肺内钙化">肺内钙化</Option>
              <Option value="胸膜实性">胸膜实性</Option>
              <Option value="胸膜钙化">胸膜钙化</Option>
              <Option value="其它（包括不可分辨）">其它（包括不可分辨）</Option>
            </Select>
          </div>

          <div className="list">
            <div className="list-title">肺：</div>
            <Select
              size="small"
              value={props.noduleInfo.lungLocation}
              style={{ width: 185, fontSize: 13 }}
              onChange={val => props.checkNoduleList(val, 'lungLocation')}
              placeholder="请选择肺位置"
            >
              <Option value="左肺">左肺</Option>
              <Option value="右肺">右肺</Option>
            </Select>
          </div>

          <div className="list">
            <div className="list-title">肺叶：</div>
            <Select
              size="small"
              value={props.noduleInfo.lobeLocation}
              style={{ width: 185, fontSize: 13 }}
              onChange={val => props.checkNoduleList(val, 'lobeLocation')}
              placeholder="请选择肺叶位置"
            >
              <Option value="上叶">上叶</Option>
              { props.noduleInfo.lungLocation === '右肺' ? <Option value="中叶">中叶</Option> : null }
              <Option value="下叶">下叶</Option>
            </Select>
          </div>

          <div className="list" style={{ marginTop: 3 }}>
            <div className="list-title">浸润类型：</div>
            <Select
              placeholder={'请选择浸润类型'}
              size="small"
              value={props.noduleInfo.invisionClassify}
              style={{ width: 185, fontSize: 13 }}
              onChange={handleSoakChange}
            >
              <Option value="AAH">AAH（非典型腺瘤样增生）</Option>
              <Option value="AIS">AIS（原位腺癌）</Option>
              <Option value="MIA">MIA（微浸润性腺癌）</Option>
              <Option value="IA">IA（浸润性腺癌）</Option>
              <Option value="OTHER">OTHER（其他）</Option>
            </Select>
          </div>

          {/* 默认是 0， 不是结节的话，1 ， 良是2，恶是3 */}
          <div className="check-group">
            <div className="group-wrap">
              <span>是否是结节：</span>
              <div className="group">
                <Button
                  type={props.noduleInfo.state === 1 ? 'primary' : null}
                  style={{ marginRight: '15px' }}
                  size="small"
                  onClick={e => props.updateNoduleList(1)}
                >
                  否
                </Button>
                <Button
                  type={props.noduleInfo.state === 0 || props.noduleInfo.state > 1 ? 'primary' : null}
                  size="small"
                  onClick={e => props.updateNoduleList(0)}
                >
                  是
                </Button>
              </div>
            </div>

            {props.noduleInfo.state !== 1 ? (
              <div className="group-wrap">
                <span>良恶性：</span>
                <div className="group">
                  <Button
                    type={props.noduleInfo.state === 2 ? 'primary' : null}
                    style={{ marginRight: '15px' }}
                    size="small"
                    onClick={e => props.updateNoduleList(2)}
                  >
                    良
                  </Button>
                  <Button
                    type={props.noduleInfo.state === 3 ? 'primary' : null}
                    size="small"
                    onClick={e => props.updateNoduleList(3)}
                  >
                    恶
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default FiveNoduleInfo
