import React, { useState, useEffect } from 'react'
import './ThirdNoduleInfo.scss'
import { Slider, Select, Button, Radio, Segmented, Checkbox, Cascader } from 'antd'
import { formatNodeSize, formatDanger, formatNodeTypeRemark } from '../../../util/index'

const { Option } = Select

const ThirdNoduleInfo = props => {
  // ==================================================
  // ==================================================

  // 格式化标题
  const formatNodeTypeTitle = val => {
    if (val === '部分实性') {
      return '实性成分比例'
    } else if (val === '肺内钙化') {
      return '肺内钙化程度分级'
    } else if (val === '胸膜钙化') {
      return '胸膜钙化程度分级'
    }
  }

  // 微小结节
  const [isMiniNode, setIsMiniNode] = useState(false)

  // 发现难易度
  const [difficultyLevel, setDifficultyLevel] = useState(false)

  // 微小结节处理
  // useEffect(() => {
  //   if (formatNodeSize(props.noduleInfo?.size) === '微小结节') {
  //     setIsMiniNode(true)
  //     props.handleResetMiniNode(props.index)
  //   } else {
  //     setIsMiniNode(false)
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.noduleInfo?.size])

  // 发现难易度处理
  // useEffect(() => {
  //   if (props.noduleInfo?.difficultyLevel === '非常微妙') {
  //     setDifficultyLevel(true)
  //     props.handleResetDifficultyLevel(props.index)
  //   } else {
  //     setDifficultyLevel(false)
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.noduleInfo?.difficultyLevel])

  return (
    <div className="third-mark-box-wrap">
      {props.noduleInfo ? (
        <>
          <div className="box-title">{props.user}审核结果</div>

          {/* <div className="box-wrap">
            <div className="list-title">发现</div>
            <div className="mark-box">
              <div className="mark-title mb">检测难易度</div>
              <div className="mark-content">
                <Segmented
                  onChange={e => props.handleUpdateNoduleInfo(e, 'difficultyLevel', props.index)}
                  value={props.noduleInfo.difficultyLevel}
                  size="small"
                  options={['非常微妙', '适度微妙', '微妙', '中度明显', '显而易见']}
                  style={{ fontSize: 12 }}
                />
              </div>
            </div>
          </div> */}

          <div className="box-wrap">
            <div className="list-title">外观特征</div>

            {/* <div className="mark-box flex mb" style={{ height: 24 }}>
              <div className="mark-title" style={{ width: 160 }}>
                大小
              </div>
              <div className="mark-content">
                <span>{props.noduleInfo.sizeBefore}</span>
              </div>
              <Button size="small" onClick={props.handleShowMarkModal} style={{ right: 55, fontSize: 12 }}>
                标记微小结节
              </Button>
              <Button size="small" onClick={props.handleShowAdjustModal} style={{ fontSize: 12 }}>
                调整
              </Button>
            </div>

            <div className="mark-box flex" style={{ height: 24 }}>
              <div className="mark-title" style={{ width: 180 }}>
                大小（测量后）
              </div>
              <div className="mark-content">
                <span>
                  {props.noduleInfo.sizeAfter}
                  {props.noduleInfo.sizeAfter ? (
                    <>
                      <span style={{ fontSize: 12, color: '#ff4d4f' }}>
                        （{formatNodeSize(props.noduleInfo.size)}）
                      </span>
                    </>
                  ) : null}
                </span>
              </div>
            </div>

            <div className="mark-box flex">
              <div className="mark-content" style={{ width: 310 }}>
                <Slider
                  max={35}
                  min={1}
                  marks={{
                    3: 3,
                    5: 5,
                    10: 10,
                    30: 30,
                  }}
                  included={false}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'size', props.index)}
                  value={props.noduleInfo.size}
                />
              </div>
            </div>

            <div className="tips" style={{ marginBottom: 5 }}>
              <span className={`${props.noduleInfo.sizeAfter && props.noduleInfo.size < 5 ? 'active' : ''}`}>
                微小结节（＜5mm，≤3mm 的结节不测量大小）
              </span>
              <br />
              <span className={`${props.noduleInfo.size >= 5 && props.noduleInfo.size < 10 ? 'active' : ''}`}>
                小结节（≥5mm -＜10mm）
              </span>
              <br />
              <span className={`${props.noduleInfo.size >= 10 && props.noduleInfo.size <= 30 ? 'active' : ''}`}>
                结节/大结节（≥10mm - ≤30mm）
              </span>
              <br />
              <span className={`${props.noduleInfo.size > 30 ? 'active' : ''}`}>肿块（大于 30mm）</span>
            </div>

            <div className="mark-box flex mb">
              <div className="mark-title">位置</div>
              <div className="mark-content">
                <Cascader
                  size="small"
                  style={{ width: 198, fontSize: 12 }}
                  options={[
                    {
                      value: '右肺上叶（RUL）',
                      label: '右肺上叶（RUL）',
                      children: [
                        {
                          value: '肺内',
                          label: '肺内',
                        },
                        {
                          value: '胸膜',
                          label: '胸膜',
                        },
                        {
                          value: '贴近胸膜',
                          label: '贴近胸膜',
                        },
                        {
                          value: '肺门区',
                          label: '肺门区',
                        },
                      ],
                    },
                    {
                      value: '右肺中叶（RML）',
                      label: '右肺中叶（RML）',
                      children: [
                        {
                          value: '肺内',
                          label: '肺内',
                        },
                        {
                          value: '胸膜',
                          label: '胸膜',
                        },
                        {
                          value: '贴近胸膜',
                          label: '贴近胸膜',
                        },
                        {
                          value: '肺门区',
                          label: '肺门区',
                        },
                      ],
                    },
                    {
                      value: '右肺下叶（RLL）',
                      label: '右肺下叶（RLL）',
                      children: [
                        {
                          value: '肺内',
                          label: '肺内',
                        },
                        {
                          value: '胸膜',
                          label: '胸膜',
                        },
                        {
                          value: '贴近胸膜',
                          label: '贴近胸膜',
                        },
                        {
                          value: '肺门区',
                          label: '肺门区',
                        },
                      ],
                    },
                    {
                      value: '左肺上叶（LUL）',
                      label: '左肺上叶（LUL）',
                      children: [
                        {
                          value: '肺内',
                          label: '肺内',
                        },
                        {
                          value: '胸膜',
                          label: '胸膜',
                        },
                        {
                          value: '贴近胸膜',
                          label: '贴近胸膜',
                        },
                        {
                          value: '肺门区',
                          label: '肺门区',
                        },
                      ],
                    },
                    {
                      value: '左肺下叶（LLL）',
                      label: '左肺下叶（LLL）',
                      children: [
                        {
                          value: '肺内',
                          label: '肺内',
                        },
                        {
                          value: '胸膜',
                          label: '胸膜',
                        },
                        {
                          value: '贴近胸膜',
                          label: '贴近胸膜',
                        },
                        {
                          value: '肺门区',
                          label: '肺门区',
                        },
                      ],
                    },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'position', props.index)}
                  placeholder="请选择位置"
                  value={props.noduleInfo.position}
                />
              </div>
            </div> */}

            <div className="mark-box flex mb">
              <div className="mark-title">形态分叶</div>
              <div className="mark-content">
                <Select
                  // disabled={isMiniNode || difficultyLevel}
                  size="small"
                  style={{ width: 198, fontSize: 12 }}
                  placeholder="请选择形态分叶"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'paging', props.index)}
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
            <div className="mark-box flex mb">
              <div className="mark-title">形状</div>
              <div className="mark-content">
                <Select
                  // disabled={isMiniNode}
                  size="small"
                  style={{ width: 198, fontSize: 12 }}
                  placeholder="请选择形状"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'sphere', props.index)}
                  value={props.noduleInfo.sphere}
                >
                  <Option value="长条形">长条形</Option>
                  <Option value="不规则形">不规则形</Option>
                  <Option value="近卵形">近卵形</Option>
                  <Option value="卵形">卵形</Option>
                  <Option value="近球形">近球形</Option>
                  <Option value="球形">球形</Option>
                </Select>
              </div>
            </div>
            <div className="mark-box flex mb">
              <div className="mark-title">边缘/毛刺</div>
              <div className="mark-content">
                <Select
                  // disabled={difficultyLevel}
                  size="small"
                  allowClear
                  style={{ width: 198, fontSize: 12 }}
                  placeholder="请选择边缘/毛刺"
                  onChange={e => props.handleUpdateNoduleInfo(e, 'rag', props.index)}
                  value={props.noduleInfo.rag}
                  options={[
                    {
                      label: '光整（无毛刺）',
                      options: [{ label: '光整（无毛刺）', value: '光整（无毛刺）' }],
                    },
                    {
                      label: '短毛刺',
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
            {/* <div className="mark-box flex left mb">
              <div className="mark-title">长毛刺</div>
              <div className="mark-content">
                <Radio.Group
                  disabled={difficultyLevel}
                  options={[
                    { label: '有', value: '有' },
                    { label: '无', value: '无' },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e.target.value, 'rag1', props.index)}
                  value={props.noduleInfo.rag1}
                />
              </div>
            </div> */}
            {/* <div className="mark-box flex left mb">
              <div className="mark-title">晕征</div>
              <div className="mark-content">
                <Radio.Group
                  disabled={difficultyLevel}
                  options={[
                    { label: '无晕征', value: '无晕征' },
                    { label: '有晕征', value: '有晕征' },
                    { label: '反晕征', value: '反晕征' },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e.target.value, 'rag0', props.index)}
                  value={props.noduleInfo.rag0}
                />
              </div>
            </div> */}
            <div className="mark-box mb">
              <div className="mark-title w250 mb">棘突（分级）</div>
              <div className="mark-content">
                <Segmented
                  // disabled={isMiniNode}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'spinous', props.index)}
                  value={props.noduleInfo.spinous}
                  size="small"
                  options={['非常微妙', '适度微妙', '微妙', '中度明显', '显而易见']}
                  style={{ fontSize: 12 }}
                />
              </div>
            </div>
            {/* <div className="mark-box mb">
              <div className="mark-title w250 mb">结节-肺界面（清晰度分级）</div>
              <div className="mark-content">
                <Segmented
                  onChange={e => props.handleUpdateNoduleInfo(e, 'lungInterface', props.index)}
                  value={props.noduleInfo.lungInterface}
                  size="small"
                  options={['非常微妙', '适度微妙', '微妙', '中度明显', '显而易见']}
                  style={{ fontSize: 12 }}
                />
              </div>
            </div> */}
            {/* <div className="mark-box flex left">
              <div className="mark-title">临近关系</div>
              <div className="mark-content">
                <Checkbox.Group
                  options={[
                    { label: '胸膜凹陷', value: '胸膜凹陷' },
                    { label: '血管纠集', value: '血管纠集' },
                    { label: '推挤', value: '推挤' },
                    { label: '胸膜牵拉', value: '胸膜牵拉' },
                    { label: '侧旁气体潴留', value: '侧旁气体潴留' },
                    { label: '无特殊', value: '无特殊' },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'proximityRelation', props.index)}
                  value={props.noduleInfo.proximityRelation}
                />
              </div>
            </div> */}
          </div>

          {/* <div className="box-wrap">
            <div className="list-title">内部特征</div>
            <div className="mark-box flex left mb">
              <div className="mark-title">结构成分</div>
              <div className="mark-content">
                <Checkbox.Group
                  disabled={isMiniNode}
                  options={[
                    { label: '软组织', value: '软组织' },
                    { label: '液体', value: '液体' },
                    { label: '脂肪', value: '脂肪' },
                    { label: '空泡', value: '空泡' },
                    { label: '空洞', value: '空洞' },
                    { label: '磨玻璃', value: '磨玻璃' },
                    { label: '钙化', value: '钙化' },
                  ]}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'structuralConstitution', props.index)}
                  value={props.noduleInfo.structuralConstitution}
                />
              </div>
            </div>
            {props.noduleInfo.structuralConstitution.includes('空洞') ? (
              <div className="mark-box flex left mb">
                <div className="mark-title">结构成分（空洞）</div>
                <div className="mark-content">
                  <Radio.Group
                    options={[
                      { label: '内壁光滑', value: '内壁光滑' },
                      { label: '内壁不完整', value: '内壁不完整' },
                    ]}
                    onChange={e => props.handleUpdateNoduleInfo(e.target.value, 'structuralConstitutionVoid', props.index)}
                    value={props.noduleInfo.structuralConstitutionVoid}
                    style={{ fontSize: 12 }}
                  />
                </div>
              </div>
            ) : null}
            {props.noduleInfo.structuralConstitution.includes('钙化') ? (
              <div className="mark-box flex left mb">
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
                    onChange={e => props.handleUpdateNoduleInfo(e, 'structuralConstitutionCalcific', props.index)}
                    value={props.noduleInfo.structuralConstitutionCalcific}
                    style={{ fontSize: 12 }}
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
                  onChange={e => props.handleUpdateNoduleInfo(e, 'structuralRelation', props.index)}
                  value={props.noduleInfo.structuralRelation}
                />
              </div>
            </div>
          </div> */}

          <div className="box-wrap">
            <div className="list-title" style={{ marginBottom: 5 }}>
              结节类型
            </div>
            <div className="mark-box flex">
              <div className="mark-content">
                <Select
                  size="small"
                  style={{ width: 198, fontSize: 12 }}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'nodeType', props.index)}
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
                <div className="mark-title" style={{ width: 320, marginTop: 8 }}>
                  {formatNodeTypeTitle(props.noduleInfo.nodeType)}，目前所选分级：
                    {formatNodeTypeRemark(Number(props.noduleInfo.nodeTypeRemark))}
                </div>
                <div className="mark-content" style={{ width: 310 }}>
                  <Slider
                    marks={{
                      0: 0,
                      25: 25,
                      50: 50,
                      75: 75,
                      100: 100,
                    }}
                    included={false}
                    onChange={e => props.handleUpdateNoduleInfo(e, 'nodeTypeRemark', props.index)}
                    value={props.noduleInfo.nodeTypeRemark}
                  />
                </div>
                <div className="tips">
                  <span
                    className={`${
                      props.noduleInfo.nodeTypeRemark >= 0 && props.noduleInfo.nodeTypeRemark < 25 ? 'active' : ''
                    }`}
                  >
                    非常微妙（0 - 24）
                  </span>
                  <br />
                  <span
                    className={`${
                      props.noduleInfo.nodeTypeRemark >= 25 && props.noduleInfo.nodeTypeRemark < 50 ? 'active' : ''
                    }`}
                  >
                    适度微妙（25 - 49）
                  </span>
                  <br />
                  <span
                    className={`${
                      props.noduleInfo.nodeTypeRemark >= 50 && props.noduleInfo.nodeTypeRemark < 75 ? 'active' : ''
                    }`}
                  >
                    微妙（50 - 74）
                  </span>
                  <br />
                  <span
                    className={`${
                      props.noduleInfo.nodeTypeRemark >= 75 && props.noduleInfo.nodeTypeRemark < 100 ? 'active' : ''
                    }`}
                  >
                    中度明显（75 - 99）
                  </span>
                  <br />
                  <span className={`${props.noduleInfo.nodeTypeRemark >= 100 ? 'active' : ''}`}>显而易见（100）</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* <div className="box-wrap">
            <div className="list-title" style={{ marginBottom: 5 }}>
              良恶性
            </div>
            <div className="mark-box">
              <div className="mark-title" style={{ width: 300 }}>
                危险程度（分级），目前所选分级：
                  {formatDanger(Number(props.noduleInfo.danger))}
              </div>
              <div className="mark-content" style={{ width: 310 }}>
                <Slider
                  max={100}
                  marks={{
                    0: 0,
                    20: 20,
                    40: 40,
                    65: 65,
                  }}
                  included={false}
                  onChange={e => props.handleUpdateNoduleInfo(e, 'danger', props.index)}
                  value={props.noduleInfo.danger}
                />
              </div>
            </div>
            <div className="tips">
              <span className={`${props.noduleInfo.danger === 0 ? 'active' : ''}`}>良性，对应概率：0</span>
              <br />
              <span className={`${props.noduleInfo.danger > 0 && props.noduleInfo.danger <= 20 ? 'active' : ''}`}>
                考虑良性，对应概率：非常低（1-20%）
              </span>
              <br />
              <span className={`${props.noduleInfo.danger > 20 && props.noduleInfo.danger <= 40 ? 'active' : ''}`}>
                不除外恶性，对应概率：低（21-40%）
              </span>
              <br />
              <span className={`${props.noduleInfo.danger > 40 && props.noduleInfo.danger <= 65 ? 'active' : ''}`}>
                恶性可能，对应概率：中等（41-65%）
              </span>
              <br />
              <span className={`${props.noduleInfo.danger > 65 ? 'active' : ''}`}>
                考虑恶性，对应概率：高度（＞65%）
              </span>
            </div>
          </div> */}

          {/* <div className="mark-box">
            <div className="mark-title w250"></div>
            <div className="mark-content">
              <Button
                style={{ fontSize: 12 }}
                // disabled={props.noduleInfo.state}
                size="small"
                onClick={e => props.updateSingleNodeResult(props.index)}
              >
                修改{props.user}结果
              </Button>
            </div>
          </div> */}
        </>
      ) : null}
    </div>
  )
}

export default ThirdNoduleInfo
