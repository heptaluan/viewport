import React, { useState, useEffect } from 'react'
import './MarkNoduleInfo.scss'
import { Radio, Select, Button, Input, Segmented, Checkbox } from 'antd'

const { Option } = Select

const MarkNoduleInfo = props => {
  const handleSelectChange = val => {
    props.checkNoduleList(val, 'type')
  }

  // ==================================================
  // ==================================================

  const [showStructuralCheckbox, setShowStructuralCheckbox] = useState(false)
  const [showTypePartSolid, setShowTypePartSolid] = useState(false)
  const [showTypeLungCalcific, setShowTypeLungCalcific] = useState(false)
  const [showTypePleuraCalcific, setShowTypePleuraCalcific] = useState(false)

  // 内部特征-结构成分
  const handleInnerIngredientChange = list => {
    if (list.includes('钙化')) {
      setShowStructuralCheckbox(true)
    } else {
      setShowStructuralCheckbox(false)
    }
  }

  // 结节类型
  const handleNodeTypeChange = val => {
    setShowTypePartSolid(false)
    setShowTypeLungCalcific(false)
    setShowTypePleuraCalcific(false)
    if (val === '部分实性') {
      setShowTypePartSolid(true)
    } else if (val === '肺内钙化') {
      setShowTypeLungCalcific(true)
    } else if (val === '胸膜钙化') {
      setShowTypePleuraCalcific(true)
    }
  }

  return (
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
            style={{ width: 180, fontSize: 13 }}
            onChange={handleSelectChange}
            value={undefined}
            placeholder="请选择位置"
          >
            <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
            <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
            <Option value="右肺下叶（RLL）">右肺下叶（RLL）</Option>
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
            style={{ width: 180, fontSize: 13 }}
            onChange={handleSelectChange}
            value={undefined}
            placeholder="请选择大小"
          >
            <Option value="微小结节">微小结节（＜5mm;≤3mm的结节不测量大小）</Option>
            <Option value="小结节">小结节（≥5mm-＜10mm）</Option>
            <Option value="结节/大结节">结节/大结节（≥10mm-≤30mm）</Option>
            <Option value="肿块">肿块（大于30mm）</Option>
          </Select>
        </div>
        <Button size="small" onClick={props.handleShowAdjustModal}>
          调整
        </Button>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">形态分叶</div>
        <div className="mark-content">
          <Select
            size="small"
            style={{ width: 180, fontSize: 13 }}
            onChange={handleSelectChange}
            value={undefined}
            placeholder="请选择形态分叶"
          >
            <Option value="无分叶">无分叶</Option>
            <Option value="浅分叶">浅分叶</Option>
            <Option value="中度分叶">中度分叶</Option>
            <Option value="明显分叶">明显分叶</Option>
            <Option value="深度分叶">深度分叶</Option>
          </Select>
        </div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">球形</div>
        <div className="mark-content">
          <Select
            size="small"
            style={{ width: 180, fontSize: 13 }}
            onChange={handleSelectChange}
            value={undefined}
            placeholder="请选择球形"
          >
            <Option value="线条形">线条形</Option>
            <Option value="近卵形">近卵形</Option>
            <Option value="卵形">卵形</Option>
            <Option value="近球形">近球形</Option>
            <Option value="球形">球形</Option>
          </Select>
        </div>
      </div>
      <div className="mark-box flex">
        <div className="mark-title">边缘/毛刺</div>
        <div className="mark-content">
          <Select
            size="small"
            style={{ width: 180, fontSize: 13 }}
            onChange={handleSelectChange}
            value={undefined}
            placeholder="请选择边缘/毛刺"
            options={[
              {
                label: '光整（无毛刺）',
                options: [{ label: '光整（无毛刺）', value: '光整（无毛刺）' }],
              },
              {
                label: '毛刺',
                options: [
                  { label: '不明显的毛刺', value: '不明显的毛刺' },
                  { label: '有毛刺', value: '有毛刺' },
                  { label: '较明显有毛刺', value: '较明显有毛刺' },
                  { label: '明显毛刺', value: '明显毛刺' },
                ],
              },
            ]}
          ></Select>
        </div>
      </div>
      <div className="mark-box">
        <div className="mark-title w250">棘突（分级）</div>
        <div className="mark-content">
          <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
        </div>
      </div>
      <div className="mark-box">
        <div className="mark-title w250">结节-肺界面（清晰度分级）</div>
        <div className="mark-content">
          <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
        </div>
      </div>
      <div className="mark-box flex left">
        <div className="mark-title">临近关系</div>
        <div className="mark-content">
          <Checkbox.Group
            options={[
              { label: '胸膜凹陷', value: '1' },
              { label: '血管纠集', value: '2' },
              { label: '推挤', value: '3' },
              { label: '胸膜牵拉', value: '32' },
              { label: '无特殊', value: '31' },
            ]}
          />
        </div>
      </div>

      <hr />

      <div className="list-title">内部特征</div>
      <div className="mark-box flex left">
        <div className="mark-title">结构成分</div>
        <div className="mark-content">
          <Checkbox.Group
            options={[
              { label: '软组织', value: '软组织' },
              { label: '液体', value: '液体' },
              { label: '脂肪', value: '脂肪' },
              { label: '空气', value: '空气' },
              { label: '磨玻璃', value: '磨玻璃' },
              { label: '钙化', value: '钙化' },
            ]}
            onChange={handleInnerIngredientChange}
          />
        </div>
      </div>
      {showStructuralCheckbox ? (
        <div className="mark-box flex left">
          <div className="mark-title">结构成分（钙化）</div>
          <div className="mark-content">
            <Checkbox.Group
              options={[
                { label: '爆米花样', value: '1' },
                { label: '层状', value: '2' },
                { label: '非中心', value: '3' },
                { label: '完全钙化', value: '32' },
                { label: '环状钙化', value: '31' },
                { label: '中心点状钙化', value: '33' },
              ]}
              defaultValue={['Apple']}
            />
          </div>
        </div>
      ) : null}
      <div className="mark-box flex left">
        <div className="mark-title">结构关系</div>
        <div className="mark-content">
          <Checkbox.Group
            options={[
              { label: '侵犯血管', value: '1' },
              { label: '内有血管穿行', value: '2' },
              { label: '内有支气管穿行', value: '3' },
              { label: '支气管壁增厚', value: '32' },
              { label: '血管局部增粗', value: '31' },
              { label: '血管贴边', value: '33' },
              { label: '无特殊', value: '34' },
            ]}
            defaultValue={['Apple']}
          />
        </div>
      </div>

      <hr />

      <div className="list-title">结节类型</div>
      <div className="mark-box flex">
        <div className="mark-content">
          <Select
            size="small"
            style={{ width: 180, fontSize: 13 }}
            onChange={handleNodeTypeChange}
            value={undefined}
            placeholder="请选择结节类型"
          >
            <Option value="肺内实性">肺内实性</Option>
            <Option value="部分实性">部分实性</Option>
            <Option value="磨玻璃">磨玻璃</Option>
            <Option value="肺内钙化">肺内钙化</Option>
            <Option value="胸膜钙化">胸膜钙化</Option>
            <Option value="胸膜实性">胸膜实性</Option>
            <Option value="其他">其他</Option>
          </Select>
        </div>
      </div>

      {showTypePartSolid ? (
        <div className="mark-box">
          <div className="mark-title w250">部分实性（分级，实性成分比例）</div>
          <div className="mark-content">
            <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
          </div>
        </div>
      ) : null}
      {showTypeLungCalcific ? (
        <div className="mark-box">
          <div className="mark-title w250">肺内钙化（钙化程度分级）</div>
          <div className="mark-content">
            <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
          </div>
        </div>
      ) : null}
      {showTypePleuraCalcific ? (
        <div className="mark-box">
          <div className="mark-title w250">胸膜钙化（钙化程度分级）</div>
          <div className="mark-content">
            <Segmented size="small" options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']} />
          </div>
        </div>
      ) : null}

      <hr />

      <div className="list-title">良恶性</div>
      <div className="mark-box">
        <div className="mark-title w250">危险程度（分级）</div>
        <div className="mark-content">
          <Segmented size="small" options={['良性', '考虑良性', '不除外恶性', '恶性可能', '考虑恶性']} />
        </div>
      </div>
      <div className="tips">
        良性，对应概率：0
        <br />
        考虑良性，对应概率：非常低（小于5%）
        <br />
        不除外恶性，对应概率：低（5-40%）
        <br />
        恶性可能，对应概率：中等（40-65%）
        <br />
        考虑恶性，对应概率：高度（大于65%）
      </div>
    </div>
  )
}

export default MarkNoduleInfo
