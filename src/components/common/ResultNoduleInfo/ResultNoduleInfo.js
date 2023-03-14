import React from 'react'
import './ResultNoduleInfo.scss'
import { Select, Radio, Checkbox, Segmented } from 'antd'

const { Option } = Select

const ResultNoduleInfo = props => {
  const { noduleInfo } = props
  return (
    <div className="result-nodule-info">
      {noduleInfo?.length === 1 ? (
        <>
          <div className="box-wrap">
            <div className="list-title">发现</div>
            <div className="mark-box flex mb">
              <div className="mark-title">检测难易度</div>
              <div className="mark-content">
                {noduleInfo[0].amendFindpercent ? (
                  <Segmented
                    disabled
                    value={noduleInfo[0].amendFindpercent}
                    size="small"
                    options={['非常微妙', '适度微妙', '微妙', '中度明显', '显而易见']}
                    style={{ fontSize: 12 }}
                  />
                ) : (
                  '暂无修改'
                )}
              </div>
            </div>

            <div className="mark-box flex">
              <div className="mark-title">结节大小</div>
              <div className="mark-content">
                {noduleInfo[0].amendSize ? (
                  <Select
                    disabled
                    size="small"
                    style={{ width: 110, fontSize: 12 }}
                    placeholder="请选择形态分叶"
                    value={noduleInfo[0].amendSize}
                  >
                    <Option value="微小结节">微小结节</Option>
                    <Option value="小结节">小结节</Option>
                    <Option value="结节/大结节">结节/大结节</Option>
                    <Option value="肿块（大于 30mm）">肿块（大于 30mm）</Option>
                  </Select>
                ) : (
                  '暂无修改'
                )}
              </div>
            </div>
          </div>

          <div className="box-wrap">
            <div className="list-title">外观特征</div>
            <div className="mark-box flex mb">
              <div className="mark-title">形态分叶</div>
              <div className="mark-content">
                {noduleInfo[0].amendShape ? (
                  <Select
                    disabled
                    size="small"
                    style={{ width: 110, fontSize: 12 }}
                    placeholder="请选择形态分叶"
                    value={noduleInfo[0].amendShape}
                  >
                    <Option value="无分叶">无分叶</Option>
                    <Option value="浅分叶">浅分叶</Option>
                    <Option value="中度分叶">中度分叶</Option>
                    <Option value="明显分叶">明显分叶</Option>
                    <Option value="深度分叶">深度分叶</Option>
                  </Select>
                ) : (
                  '暂无修改'
                )}
              </div>
            </div>

            <div className="mark-box flex mb">
              <div className="mark-title">形状</div>
              <div className="mark-content">
                {noduleInfo[0].amendSpherical ? (
                  <Select
                    disabled
                    size="small"
                    style={{ width: 110, fontSize: 12 }}
                    placeholder="请选择形状"
                    value={noduleInfo[0].amendSpherical}
                  >
                    <Option value="长条形">长条形</Option>
                    <Option value="不规则形">不规则形</Option>
                    <Option value="近卵形">近卵形</Option>
                    <Option value="卵形">卵形</Option>
                    <Option value="近球形">近球形</Option>
                    <Option value="球形">球形</Option>
                  </Select>
                ) : (
                  '暂无修改'
                )}
              </div>
            </div>

            <div className="mark-box flex mb">
              <div className="mark-title">边缘/毛刺</div>
              <div className="mark-content">
                {noduleInfo[0].amendEdge ? (
                  <Select
                    disabled
                    size="small"
                    allowClear
                    style={{ width: 110, fontSize: 12 }}
                    placeholder="请选择边缘/毛刺"
                    value={noduleInfo[0].amendEdge}
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
                ) : (
                  '暂无修改'
                )}
              </div>
            </div>

            <div className="mark-box left flex mb">
              <div className="mark-title">晕征</div>
              <div className="mark-content">
                {noduleInfo[0].amendEdge0 ? (
                  <Radio.Group
                    disabled
                    options={[
                      { label: '无晕征', value: '无晕征' },
                      { label: '有晕征', value: '有晕征' },
                      { label: '反晕征', value: '反晕征' },
                    ]}
                    value={noduleInfo[0].amendEdge0}
                  />
                ) : (
                  '暂无修改'
                )}
              </div>
            </div>

            <div className="mark-box left flex">
              <div className="mark-title">棘突（分级）</div>
              <div className="mark-content">
                {noduleInfo[0].amendBurr ? (
                  <Segmented
                    disabled
                    value={noduleInfo[0].amendBurr}
                    size="small"
                    options={['非常微妙', '适度微妙', '微妙', '中度明显', '显而易见']}
                    style={{ fontSize: 12 }}
                  />
                ) : (
                  '暂无修改'
                )}
              </div>
            </div>
          </div>

          <div className="box-wrap">
            <div className="list-title">内部特征</div>
            <div className="mark-box flex left">
              <div className="mark-title">结构关系</div>
              <div className="mark-content">
                {noduleInfo[0].amendRelation ? (
                  <Checkbox.Group
                    disabled
                    options={[
                      { label: '侵犯血管', value: '侵犯血管' },
                      { label: '内有血管进入或穿行', value: '内有血管进入或穿行' },
                      { label: '内有支气管进入或穿行', value: '内有支气管进入或穿行' },
                      { label: '支气管壁增厚', value: '支气管壁增厚' },
                      { label: '血管局部增粗', value: '血管局部增粗' },
                      { label: '血管贴边', value: '血管贴边' },
                      { label: '无特殊', value: '无特殊' },
                    ]}
                    value={noduleInfo[0].amendRelation}
                  />
                ) : (
                  '暂无修改'
                )}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default ResultNoduleInfo
