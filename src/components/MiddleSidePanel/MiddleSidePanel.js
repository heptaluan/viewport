import React from 'react'
import './MiddleSidePanel.scss'
import IconFont from '../common/IconFont/index'
import { Popover, Checkbox } from 'antd'
import { Button } from 'antd'

const MiddleSidePanel = props => {
  return (
    <div className="middle-side-panel-box">
      <div className="nodule-list-box">
        <div className="title">结点列表（{props.noduleList.length}）</div>
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
            <div className="size">大小</div>
            <div className="type">类型</div>
            <div className="risk">风险</div>
            <div className="soak">结节</div>
            <div className="action">状态</div>
          </div>
          <div id="tableIItemBox" className="table-content">
            {props.noduleList?.map((item, index) => (
              <div
                key={item.id}
                className={`table-item ${item.active ? 'item-active' : ''}`}
                onClick={e => props.handleCheckedListClick(item.num)}
              >
                {/* <div className="icon">{item.id}</div> */}
                <Checkbox onChange={e => props.onCheckChange(e, index)} checked={item.checked}>
                  <div className="num">{item.num}</div>
                </Checkbox>
                <div className="size">{item.size}</div>
                <div className="type">{item.type}</div>
                <div className="risk">{item.risk}</div>
                <div className="soak">
                  <span>
                    {
                      item.state === undefined ? '-' : (item.state ? '是' : '否')
                    }
                  </span>
                </div>
                <div className="action review-state">
                  <span className={item.review ? 'review' : null}>{item.review ? '已检阅' : '未检阅'}</span>
                </div>
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
                    {item.text}
                  </div>
                ) : null
              })}
            </div>
          </div>
          <div className="suggest-box">
            <div className="title">影像建议</div>
            <div className="suggest-content">
              <div className="suggest-content-wrap">
                <div className="suggest-item">建议</div>
              </div>
              <div className="save">
                <Button type="primary" size="small">
                  保存
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MiddleSidePanel
