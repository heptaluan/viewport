import React, { useState, useEffect } from 'react'
import './MiddleSidePanel.scss'
// import IconFont from '../common/IconFont/index'
import { Checkbox, Tag, Tooltip } from 'antd'

const MiddleSidePanel = props => {
  const handleListClick = (index, num) => {
    props.onCheckChange(index, num)
  }

  const deleteNodeListHandle = (e, item) => {
    e.stopPropagation()
    props.showDeleteConfirm(item)
  }

  // 保存用户角色
  const [userInfo, setUserInfo] = useState('')

  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)
  }, [])

  // const tips = (
  //   <div style={{ fontSize: '13px' }}>
  //     <div>当前微小结节的过滤值为：{localStorage.getItem('diameterSize')}mm</div>
  //     <div>
  //       默认 结节 <span style={{ background: '#fff', padding: '0 4px', color: 'rgba(0, 0, 0, 0.85)' }}>白色</span>
  //     </div>
  //     <div>
  //       默认 微小结节 <span style={{ background: '#02b919', padding: '0 4px' }}>绿色</span>
  //     </div>
  //     <div>
  //       新增 结节 <span style={{ background: '#d1d1d1', padding: '0 4px', color: 'rgba(0, 0, 0, 0.85)' }}>灰色</span>
  //     </div>
  //     <div>
  //       由 非微小结节 调整为 微小结节 <span style={{ background: '#34c0ff', padding: '0 4px' }}>蓝色</span>
  //     </div>
  //     <div>
  //       由 微小结节 调整为 非微小结节 <span style={{ background: '#ff0000', padding: '0 4px' }}>红色</span>
  //     </div>
  //     <hr />
  //     注意：只有 <span style={{ background: '#34c0ff', padding: '0 4px' }}>蓝色</span> 与{' '}
  //     <span style={{ background: '#02b919', padding: '0 4px' }}>绿色</span> 为微小结节
  //   </div>
  // )

  return (
    <div className="middle-side-panel-box">
      <div className="nodule-list-box">
        <div className="title">
          <span>
            结节列表（{props.noduleList.length}）
            {/* 结节列表（{props.noduleList.length}）微小结节个数（{formatMiniNodule(props.noduleList)}） */}
          </span>
          {/* <span>
            <Tooltip placement="bottomRight" title={tips}>
              <QuestionCircleOutlined style={{ fontSize: '16px' }} />
            </Tooltip>
          </span> */}
        </div>
        <div className="table-box">
          <div className="table-title">
            {/* <div className="icon">
              <IconFont style={{ fontSize: '16px' }} type="icon-leimupinleifenleileibie" />
            </div> */}
            {/* <Checkbox disabled indeterminate={props.indeterminate} onChange={props.onCheckAllChange} checked={props.checkAll}>
              <div className="num">中心帧</div>
            </Checkbox> */}
            <Checkbox disabled checked={true}>
              <div className="index">序号</div>
            </Checkbox>
            <div className="num">中心帧</div>
            <div className="soak">位置</div>
            {/* {userInfo === 'chief' ? (
              <>
                <div className="soak">肺</div>
                <div className="soak">肺叶</div>
              </>
            ) : null} */}
            <div className="type">类型</div>
            {userInfo === 'chief' ? <div className="risk">风险</div> : null}
            <div className="soak">结节</div>
            <div className="action">状态</div>
          </div>
          <div id="tableIItemBox" className="table-content">
            {props.noduleList?.map((item, index) => (
              <Tooltip placement="top" title={item.error_mark}>
                <div
                  key={item.id}
                  className={`table-item ${item.error === 1 ? 'add-item' : ''} `}
                  onClick={e => handleListClick(index, item.num)}
                >
                  <Checkbox onChange={e => props.onCheckChange(index, item.num)} checked={item.checked}>
                    <div className="index">{index + 1}</div>
                  </Checkbox>
                  <div className="num">{props.imagesConfig.length - item.num}</div>
                  <Tooltip placement="top" title={item.remark}>
                    <div className="soak">{item.remark}</div>
                  </Tooltip>
                  {/* {userInfo === 'chief' ? (
                    <>
                      <div className="soak">{item.lung}</div>
                      <div className="soak">{item.lobe}</div>
                    </>
                  ) : null} */}

                  <div className="type">{item.type}</div>
                  {userInfo === 'chief' ? (
                    <div className={`risk ${item.risk && Number(item.scrynMaligant) !== Number(item.risk) ? 'edit' : ''}`}>
                      {item.risk ? <>{Number(item.scrynMaligant) !== Number(item.risk) ? item.scrynMaligant : item.risk}%</> : ''}
                    </div>
                  ) : null}

                  <div className={`soak ${item.state ? 'yes' : 'no'}`}>
                    <span>{item.state === undefined ? '-' : item.state ? '是' : '否'}</span>
                  </div>
                  <div className="action review-state">
                    <span className={item.review ? 'review' : null}>{item.review === true ? '已检阅' : '未检阅'}</span>
                  </div>
                  {item.nodeType === 1 ? (
                    <div className="del-tips">
                      <Tag color="#f50" onClick={e => deleteNodeListHandle(e, item)}>
                        删除
                      </Tag>
                    </div>
                  ) : null}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
      <div className="image-info-box">
        <div className="title">患者报告</div>
        <div className="info-box">
          <div className="report-box">
            <div className="title">影像所见</div>
            <div id="viewerItemBox" className="report-content">
              {userInfo === 'chief' &&
                props.noduleList?.map((item, index) => {
                  return item.checked ? (
                    <div
                      key={item.id}
                      className={`viewer-item ${item.active ? 'item-active' : ''}`}
                      onClick={e => props.handleCheckedListClick(item.num)}
                    >
                      于 <span>{item.lung}</span> <span>{item.lobe}</span> 可见一 <span>{item.featureLabelG}</span> 结节，类型为{' '}
                      <span>{item.type}</span>，大小约 <span>{item.diameter}</span>，体积约 <span>{item.noduleSize} mm³</span>。
                      结节恶性风险为 <span>{item.risk ? item.risk : item.scrynMaligant}</span> %。
                    </div>
                  ) : null
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiddleSidePanel
