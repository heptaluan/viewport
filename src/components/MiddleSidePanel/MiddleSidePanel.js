import React from 'react'
import './MiddleSidePanel.scss'
// import IconFont from '../common/IconFont/index'
import { Checkbox, Tag } from 'antd'

const MiddleSidePanel = props => {
  const handleListClick = (index, num) => {
    props.onCheckChange(index, num)
  }

  const deleteNodeListHandle = (e, item) => {
    e.stopPropagation()
    props.showDeleteConfirm(item)
  }

  return (
    <div className="middle-side-panel-box">
      <div className="nodule-list-box">
        <div className="title">结节列表（{props.noduleList.length}）</div>
        <div className="table-box">
          <div className="table-title">
            {/* <div className="icon">
              <IconFont style={{ fontSize: '16px' }} type="icon-leimupinleifenleileibie" />
            </div> */}
            {/* <Checkbox disabled indeterminate={props.indeterminate} onChange={props.onCheckAllChange} checked={props.checkAll}>
              <div className="num">中心帧</div>
            </Checkbox> */}
            <Checkbox disabled checked={true}>
              <div className="num">中心帧</div>
            </Checkbox>
            <div className="soak">肺</div>
            <div className="soak">肺叶</div>
            <div className="type">类型</div>
            <div className="risk">风险</div>
            {/* <div className="suggest">建议</div> */}
            <div className="soak">结节</div>
            <div className="action">状态</div>
          </div>
          <div id="tableIItemBox" className="table-content">
            {props.noduleList?.map((item, index) => (
              <div
                key={item.id}
                className={`table-item ${item.nodeType === 1 ? 'add-item' : ''} ${item.diameterSize < Number(localStorage.getItem('diameterSize')) ? 'auto-item' : ''}`}
                onClick={e => handleListClick(index, item.num)}
              >
                {/* <div className="icon">{item.id}</div> */}
                <Checkbox onChange={e => props.onCheckChange(index, item.num)} checked={item.checked}>
                  <div className="num">{props.imagesConfig.length - item.num}</div>
                </Checkbox>
                <div className="soak">{item.lung}</div>
                <div className="soak">{item.lobe}</div>
                <div className="type">{item.type}</div>
                <div className={`risk ${item.risk && Number(item.scrynMaligant) !== Number(item.risk) ? 'edit' : ''}`}>
                  {Number(item.scrynMaligant) !== Number(item.risk) ? item.scrynMaligant : item.risk}%
                </div>
                {/* <div className="suggest">{item.suggest}</div> */}
                <div className="soak">
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
              {props.noduleList?.map((item, index) => {
                return item.checked ? (
                  <div
                    key={item.id}
                    className={`viewer-item ${item.active ? 'item-active' : ''}`}
                    onClick={e => props.handleCheckedListClick(item.num)}
                  >
                    于 <span>{item.lung}</span> <span>{item.lobe}</span> 可见一 <span>{item.featureLabelG}</span>{' '}
                    结节，类型为 <span>{item.type}</span>，大小约 <span>{item.diameter}</span>，体积约{' '}
                    <span>{item.noduleSize} mm³</span>。 结节恶性风险为 <span>{item.risk}</span> %。
                  </div>
                ) : null
              })}
            </div>
          </div>
          {/* <div className="suggest-box">
            <div className="title">影像建议</div>
            <div className="suggest-content">
              <div className="suggest-content-wrap">
                <TextArea
                  placeholder="请输入建议"
                  bordered={false}
                  rows={6}
                  maxLength={150}
                  style={{
                    width: '100%',
                    resize: 'none',
                  }}
                  value={props.noduleInfo?.suggest}
                  onChange={props.handleTextareaOnChange}
                />
              </div>
              <div className="save">
                <Button type="primary" size="small">
                  保存
                </Button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default MiddleSidePanel
