import React, { useState, useEffect } from 'react'
import './ThirdMiddleSidePanel.scss'
// import IconFont from '../common/IconFont/index'
import { Checkbox, Tooltip, Tag } from 'antd'

const ThirdMiddleSidePanel = props => {
  const handleListClick = (index, num) => {
    props.onCheckChange(index, num)
  }

  // 保存用户角色
  const [userInfo, setUserInfo] = useState('')

  useEffect(() => {
    const info = localStorage.getItem('info')
    setUserInfo(info)
  }, [])

  const showNoduleDetail = (e, item) => {
    e.stopPropagation()
    props.showNoduleDetail(item)
  }

  return (
    <div className="middle-side-panel-box">
      <div className="nodule-list-box">
        <div className="title">
          <span>结节列表（{props.noduleList.length}）</span>
        </div>
        <div className="table-box">
          <div className="table-title">
            <Checkbox disabled checked={true}>
              <div className="index">序号</div>
            </Checkbox>
            <div className="type">中心帧</div>
            <div className="type">位置</div>
            <div className="type">类型</div>
            <div className="type">检测难易度</div>
            <div className="type">结节状态</div>
          </div>
          <div id="tableIItemBox" className="table-content">
            {props.noduleList?.map((item, index) => (
              <div
                key={item.id}
                className={`table-item ${item.isOpinion === 1 ? 'active-item' : ''} `}
                onClick={e => handleListClick(index, item.num)}
              >
                <Checkbox onChange={e => props.onCheckChange(index, item.num)} checked={item.checked}>
                  <div className="index">{index + 1}</div>
                </Checkbox>
                <div className="type">{props.imagesConfig.length - item.num}</div>

                <Tooltip title={item.position}>
                  <div className="type">{item.position}</div>
                </Tooltip>
                <div className="type">{item.nodeType}</div>
                <div className="type">{item.difficultyLevel}</div>
                <div className={`type ${item.state ? 'yes' : 'no'}`}>{item.state ? '已提交' : '未提交'}</div>
                {item.checked ? (
                  <div className="del-tips">
                    <Tag color="#2db7f5" onClick={e => showNoduleDetail(e, item)}>
                      查看结节
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
              {userInfo === 'chief' &&
                props.noduleList?.map((item, index) => {
                  return item.checked ? (
                    <div
                      key={item.id}
                      className={`viewer-item ${item.active ? 'item-active' : ''}`}
                      onClick={e => props.handleCheckedListClick(item.num)}
                    ></div>
                  ) : null
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThirdMiddleSidePanel