import React from 'react'
import './MiddleSidePanel.scss'
// import IconFont from '../common/IconFont/index'
import { Checkbox, Popconfirm } from 'antd'

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
            <Checkbox disabled checked={true}>
              <div className="num">中心帧</div>
            </Checkbox>
            <div className="doc1">医生一</div>
            <div className="doc2">医生二</div>
            <div className="doc3">医生三</div>
            <div className="doc4">医生三</div>
            <div className="doc5">医生三</div>
            <div className="action">操作</div>
          </div>
          <div id="tableIItemBox" className="table-content">
            {props.noduleList?.map((item, index) => (
              <div
                key={item.id}
                className={`table-item ${item.nodeType === 1 ? 'add-item' : ''}`}
                onClick={e => handleListClick(index, item.num)}
              >
                <Checkbox onChange={e => props.onCheckChange(index, item.num)} checked={item.checked}>
                  <div className="num">{props.imagesConfig.length - item.num}</div>
                </Checkbox>
                <div className="doc1">111</div>
                <div className="doc2">222</div>
                <div className="doc3">333</div>
                <div className="doc4">444</div>
                <div className="doc5">555</div>
                <div className="action">
                  <Popconfirm
                    title="确定删除该结节信息？"
                    okText="确定"
                    cancelText="取消"
                    placement="topRight"
                    onConfirm={e => deleteNodeListHandle (e, item)}
                  >
                    删除
                  </Popconfirm>
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
