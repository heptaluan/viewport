import React from 'react'
import './CompareMatchList.scss'
import { Checkbox } from 'antd'
import { getURLParameters, formatNodeStyle } from '../../../util/index'

const CompareMatchList = props => {
  return (
    <div className="compare-match-box">
      <div className="nodule-list-box">
        <div className="title">
          <span>匹配列表（{props.noduleList.length}）</span>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompareMatchList
