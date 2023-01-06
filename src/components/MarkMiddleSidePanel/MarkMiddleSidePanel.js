import React, { useState, useEffect } from 'react'
import './MarkMiddleSidePanel.scss'
// import IconFont from '../common/IconFont/index'
import { Checkbox, Tag, Tooltip } from 'antd'
import { formatNodeStyle, formatMiniNodule } from '../../util/index'
import { QuestionCircleOutlined } from '@ant-design/icons'

const MarkMiddleSidePanel = props => {
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


  return (
    <div className="middle-side-panel-box">
      <div className="nodule-list-box">
        <div className="title">
          <span>
            结节列表（{props.noduleList.length}）
          </span>
        </div>
        <div className="table-box">
          <div className="table-title">
            <Checkbox disabled checked={true}>
              <div className="index">序号</div>
            </Checkbox>
            <div className="num">中心帧</div>
            <div className="type">检测难易度</div>
            <div className="type">位置</div>
            <div className="action">状态</div>
          </div>
          <div id="tableIItemBox" className="table-content">
            {props.noduleList?.map((item, index) => (
              <div
                key={item.id}
                className={`table-item ${item.nodeType === 1 ? 'add-item' : ''} `}
                onClick={e => handleListClick(index, item.num)}
              >
                <Checkbox onChange={e => props.onCheckChange(index, item.num)} checked={item.checked}>
                  <div className="index">{index + 1}</div>
                </Checkbox>
                <div className="num">{props.imagesConfig.length - item.num}</div>
                <div className="type">{item.difficultyLevel}</div>
                <div className="type">{item.position}</div>
                <div className="action review-state">
                  <span className={item.review ? 'review' : null}>{item.review === true ? '已检阅' : '未检阅'}</span>
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
              {userInfo === 'chief' &&
                props.noduleList?.map((item, index) => {
                  return item.checked ? (
                    <div
                      key={item.id}
                      className={`viewer-item ${item.active ? 'item-active' : ''}`}
                      onClick={e => props.handleCheckedListClick(item.num)}
                    >
                      
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

export default MarkMiddleSidePanel
