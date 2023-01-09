import React, { useState, useEffect } from 'react'
import './MarkNoduleInfo.scss'
import { Slider, Select, Button, Tooltip, Segmented, Checkbox } from 'antd'
import { formatNodeSize, formatDanger } from '../../../util/index'

const { Option } = Select

const MarkNoduleInfo = props => {
  const handleSelectChange = val => {}

  // ==================================================
  // ==================================================

  const [showStructuralCheckbox, setShowStructuralCheckbox] = useState(false)

  // 内部特征-结构成分
  const handleInnerIngredientChange = list => {
    props.handleUpdateNoduleInfo(list, 'structuralConstitution')
    if (list.includes('钙化')) {
      setShowStructuralCheckbox(true)
    } else {
      setShowStructuralCheckbox(false)
    }
  }

  // 格式化标题
  const formatNodeTypeTitle = val => {
    if (val === '部分实性') {
      return '部分实性（分级，实性成分比例）'
    } else if (val === '肺内钙化') {
      return '肺内钙化（钙化程度分级）'
    } else if (val === '胸膜钙化') {
      return '胸膜钙化（钙化程度分级）'
    }
  }

  return (
    <div className="mark-box-wrap">
      {props.noduleInfo ? (
        <>
          <div className="box-title">肺结节标注标签</div>

          <div className="list-title">发现</div>
          <div className="mark-box">
            <div className="mark-title">检测难易度</div>
            <div className="mark-content">
              <Segmented
                onChange={e => props.handleUpdateNoduleInfo(e, 'difficultyLevel')}
                value={props.noduleInfo.difficultyLevel}
                size="small"
                options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']}
              />
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
                placeholder="请选择位置"
                onChange={e => props.handleUpdateNoduleInfo(e, 'position')}
                value={props.noduleInfo.position}
              >
                <Option value="右肺上叶（RUL）">右肺上叶（RUL）</Option>
                <Option value="右肺中叶（RML）">右肺中叶（RML）</Option>
                <Option value="右肺下叶（RLL）">右肺下叶（RLL）</Option>
                <Option value="左肺上叶（LUL）">左肺上叶（LUL）</Option>
                <Option value="左肺下叶（LLL）">左肺下叶（LLL）</Option>
              </Select>
            </div>
          </div>
          <div className="mark-box flex" style={{ height: 24 }}>
            <div className="mark-title" style={{ width: 160 }}>
              大小（原）
            </div>
            <div className="mark-content">
              <span>{props.noduleInfo.sizeBefore}</span>
            </div>
            <Button size="small" onClick={props.handleShowMarkModal} style={{ right: 55 }}>
              标记微小结节
            </Button>
            <Button size="small" onClick={props.handleShowAdjustModal}>
              调整
            </Button>
          </div>
          <div className="mark-box flex" style={{ height: 24, marginBottom: 0 }}>
            <div className="mark-title" style={{ width: 160 }}>
              大小（测量后）
            </div>
            <div className="mark-content">
              <span>
                {props.noduleInfo.sizeAfter}
                {props.noduleInfo.sizeAfter ? (
                  <>
                    （<span style={{ fontSize: 12 }}>{formatNodeSize(props.noduleInfo.size)}</span>）
                  </>
                ) : null}
              </span>
            </div>
          </div>

          <div className="mark-box flex">
            <div className="mark-content">
              <Slider
                max={30}
                min={1}
                marks={{
                  5: {
                    label: (
                      <Tooltip
                        placement="bottom"
                        color="#fff"
                        overlayClassName="resize-box"
                        title="微小结节（＜5mm;≤3mm的结节不测量大小）"
                      >
                        <span>微小结节</span>
                      </Tooltip>
                    ),
                  },
                  10: {
                    label: (
                      <Tooltip
                        placement="bottom"
                        color="#fff"
                        overlayClassName="resize-box"
                        title="小结节（≥5mm-＜10mm）"
                      >
                        <span>小结节</span>
                      </Tooltip>
                    ),
                  },
                  20: {
                    label: (
                      <Tooltip
                        placement="bottom"
                        color="#fff"
                        overlayClassName="resize-box"
                        title="结节/大结节（≥10mm-≤30mm）"
                      >
                        <span>结节/大结节</span>
                      </Tooltip>
                    ),
                  },
                  30: {
                    label: (
                      <Tooltip placement="bottom" color="#fff" overlayClassName="resize-box" title="肿块（大于30mm）">
                        <span>肿块</span>
                      </Tooltip>
                    ),
                  },
                }}
                included={false}
                onChange={e => props.handleUpdateNoduleInfo(e, 'size')}
                value={props.noduleInfo.size}
              />
            </div>
          </div>

          <div className="mark-box flex">
            <div className="mark-title">形态分叶</div>
            <div className="mark-content">
              <Select
                size="small"
                style={{ width: 180, fontSize: 13 }}
                placeholder="请选择形态分叶"
                onChange={e => props.handleUpdateNoduleInfo(e, 'paging')}
                value={props.noduleInfo.paging}
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
                placeholder="请选择球形"
                onChange={e => props.handleUpdateNoduleInfo(e, 'sphere')}
                value={props.noduleInfo.sphere}
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
                placeholder="请选择边缘/毛刺"
                onChange={e => props.handleUpdateNoduleInfo(e, 'rag')}
                value={props.noduleInfo.rag}
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
              <Segmented
                onChange={e => props.handleUpdateNoduleInfo(e, 'spinous')}
                value={props.noduleInfo.spinous}
                size="small"
                options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']}
              />
            </div>
          </div>
          <div className="mark-box">
            <div className="mark-title w250">结节-肺界面（清晰度分级）</div>
            <div className="mark-content">
              <Segmented
                onChange={e => props.handleUpdateNoduleInfo(e, 'lungInterface')}
                value={props.noduleInfo.lungInterface}
                size="small"
                options={['显而易见', '中度明显', '微妙', '适度微妙', '非常微妙']}
              />
            </div>
          </div>
          <div className="mark-box flex left">
            <div className="mark-title">临近关系</div>
            <div className="mark-content">
              <Checkbox.Group
                options={[
                  { label: '胸膜凹陷', value: '胸膜凹陷' },
                  { label: '血管纠集', value: '血管纠集' },
                  { label: '推挤', value: '推挤' },
                  { label: '胸膜牵拉', value: '胸膜牵拉' },
                  { label: '无特殊', value: '无特殊' },
                ]}
                onChange={e => props.handleUpdateNoduleInfo(e, 'proximityRelation')}
                value={props.noduleInfo.proximityRelation}
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
                value={props.noduleInfo.structuralConstitution}
              />
            </div>
          </div>
          {showStructuralCheckbox ? (
            <div className="mark-box flex left">
              <div className="mark-title">结构成分（钙化）</div>
              <div className="mark-content">
                <Checkbox.Group
                  options={[
                    { label: '爆米花样', value: '爆米花样' },
                    { label: '层状', value: '层状' },
                    { label: '非中心', value: '非中心' },
                    { label: '完全钙化', value: '完全钙化' },
                    { label: '环状钙化', value: '环状钙化' },
                    { label: '中心点状钙化', value: '中心点状钙化' },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'structuralConstitutionCalcific')}
                  value={props.noduleInfo.structuralConstitutionCalcific}
                />
              </div>
            </div>
          ) : null}
          <div className="mark-box flex left">
            <div className="mark-title">结构关系</div>
            <div className="mark-content">
              <Checkbox.Group
                options={[
                  { label: '侵犯血管', value: '侵犯血管' },
                  { label: '内有血管穿行', value: '内有血管穿行' },
                  { label: '内有支气管穿行', value: '内有支气管穿行' },
                  { label: '支气管壁增厚', value: '支气管壁增厚' },
                  { label: '血管局部增粗', value: '血管局部增粗' },
                  { label: '血管贴边', value: '血管贴边' },
                  { label: '无特殊', value: '无特殊' },
                ]}
                onChange={e => props.handleUpdateNoduleInfo(e, 'structuralRelation')}
                value={props.noduleInfo.structuralRelation}
              />
            </div>
          </div>

          <hr />

          <div className="list-title">结节类型</div>
          <div className="mark-box flex">
            <div className="mark-content">
              <Select
                size="small"
                style={{ width: 180, fontSize: 13, marginBottom: 5 }}
                onChange={e => props.handleUpdateNoduleInfo(e, 'nodeType')}
                value={props.noduleInfo.nodeType}
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

          {props.noduleInfo.nodeType === '部分实性' ||
          props.noduleInfo.nodeType === '肺内钙化' ||
          props.noduleInfo.nodeType === '胸膜钙化' ? (
            <div className="mark-box">
              <div className="mark-title w250">{formatNodeTypeTitle(props.noduleInfo.nodeType)}</div>
              <div className="mark-content slider">
                <Slider
                  marks={{
                    10: '显而易见',
                    30: '中度明显',
                    50: '微妙',
                    70: '适度微妙',
                    90: '非常微妙',
                  }}
                  included={false}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'nodeTypeRemark')}
                  value={props.noduleInfo.nodeTypeRemark}
                />
              </div>
            </div>
          ) : null}

          <hr />

          <div className="list-title">良恶性</div>
          <div className="mark-box">
            <div className="mark-title" style={{ width: 300 }}>
              危险程度（分级），目前所选程度：{formatDanger(Number(props.noduleInfo.danger))}
            </div>
            <div className="mark-content slider">
              <Slider
                max={100}
                included={false}
                onChange={e => props.handleUpdateNoduleInfo(e, 'danger')}
                value={props.noduleInfo.danger}
              />
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

          <div className="mark-box">
            <div className="mark-title w250"></div>
            <div className="mark-content">
              <Button disabled={props.noduleInfo.state} size="small" onClick={props.updateSingleNodeResult}>
                提交当前结节
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default MarkNoduleInfo
