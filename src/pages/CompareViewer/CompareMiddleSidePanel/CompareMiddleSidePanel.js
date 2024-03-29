import React from 'react'
import './CompareMiddleSidePanel.scss'
import { Checkbox } from 'antd'
import { getURLParameters, formatNodeStyle } from '../../../util/index'

const CompareMiddleSidePanel = props => {
  return (
    <div className="compare-middle-side-panel-box">
      <div className="nodule-list-box">
        <div className="title">
          <span>结节列表（{props.noduleList.length}）</span>
        </div>
        <div className="table-box">
          <div className="table-title">
            <Checkbox disabled checked={true}>
              <div className="index">序号</div>
            </Checkbox>
            <div className="num">中心帧</div>
            <div className="soak">肺</div>
            <div className="soak">肺叶</div>
            <div className="risk">风险</div>
            <div className="action">状态</div>
          </div>
          <div id="tableIItemBox" className="table-content">
            {props.noduleList?.map((item, index) => (
              <div
                key={item.id}
                className={`table-item ${item.nodeType === 1 ? 'add-item' : ''} ${formatNodeStyle(item)}`}
                onClick={e => props.onCheckChange(index, item.num)}
              >
                <Checkbox onChange={e => props.onCheckChange(index, item.num)} checked={item.checked}>
                  <div className="index">{index + 1}</div>
                </Checkbox>
                <div className="num">{props.imagesConfig.length - item.num}</div>
                <div className="soak">{item.lung}</div>
                <div className="soak">{item.lobe}</div>
                <div className={`risk ${item.risk && Number(item.scrynMaligant) !== Number(item.risk) ? 'edit' : ''}`}>
                  {Number(item.scrynMaligant) !== Number(item.risk) ? item.scrynMaligant : item.risk}%
                </div>
                <div className="action review-state">
                  {getURLParameters(window.location.href).user === 'chief_lwx' ? (
                    <span className={item.chiefReview ? 'review' : null}>
                      {item.chiefReview === true ? '已复核' : '未复核'}
                    </span>
                  ) : (
                    <span className={item.review ? 'review' : null}>{item.review === true ? '已检阅' : '未检阅'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompareMiddleSidePanel
