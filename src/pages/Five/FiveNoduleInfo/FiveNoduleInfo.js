import React, { useState, useEffect } from 'react'
import './FiveNoduleInfo.scss'
import { Select, Button } from 'antd'

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

  const handlePositionSelectChange = val => {
    props.checkNoduleList(val, 'position')
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
          {/* <div className="list">
            <div className="list-title">结节位置：</div>
            <Select
              size="small"
              value={props.noduleInfo.remark}
              style={{ width: 185, fontSize: 13 }}
              onChange={handlePositionSelectChange}
              placeholder="请选择结节位置"
            >
              <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
              <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
              <Option value="右肺下叶（RLL）">右肺下叶（RLL）</Option>
              <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
              <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
            </Select>
          </div> */}

          <div className="list">
            <div className="list-title">类型：</div>
            <Select
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

          {/* 默认是 0， 不是结节的话，1 ， 良是2，恶是3 */}
          <div className="check-group">
            <div className="group-wrap">
              <span>是否是结节</span>
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
                <span>良恶性</span>
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
