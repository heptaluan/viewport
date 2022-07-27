import React from 'react'
import './MiddleSidePanel.scss'
// import IconFont from '../common/IconFont/index'
import { Checkbox, Tooltip, Button } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'

const MiddleSidePanel = props => {
  const handleListClick = (index, num) => {
    props.onCheckChange(index, num)
  }

  const sortNodeList = (e, item) => {
    e.stopPropagation()
    props.showDeleteConfirm(item)
  }

  return (
    <div className="middle-side-panel-box">
      <div className="nodule-list-box">
        <div className="title">
          <span>结节列表（{props.noduleList.length}）</span>
          <span>
            <Button size='small' style={{ marginRight: 10}} onClick={e => props.sortNodeList('index')}>中心帧排序</Button>
            <Button size='small' onClick={e => props.sortNodeList('num')}>标注数排序</Button>
          </span>
        </div>
        <div className="table-box">
          <div className="table-title">
            <Checkbox disabled checked={true}>
              <div className="num">中心帧</div>
            </Checkbox>
            <Tooltip placement="top" title={'hbfyxia'}>
              <div className="doc1" style={{ color: 'red' }}>
                医生一
              </div>
            </Tooltip>
            <Tooltip placement="top" title={'doctor_lwx'}>
              <div className="doc2" style={{ color: '#cfcf22' }}>
                医生二
              </div>
            </Tooltip>
            <Tooltip placement="top" title={'doctor_diannei'}>
              <div className="doc3" style={{ color: '#37cdb1' }}>
                医生三
              </div>
            </Tooltip>
            <Tooltip placement="top" title={'医准结果'}>
              <div className="doc4" style={{ color: '#4d4df9' }}>
                医准
              </div>
            </Tooltip>
            <Tooltip placement="top" title={'点内结果'}>
              <div className="doc5" style={{ color: '#19d319' }}>
                点内
              </div>
            </Tooltip>
            <Tooltip placement="top" title={'金标准'}>
              <div className="doc6" style={{ color: '#ac3dd1' }}>
                金标准
              </div>
            </Tooltip>
            {/* <div className="action">操作</div> */}
          </div>
          <div id="tableIItemBox" className="table-content">
            {props.noduleList?.map((item, index) => (
              <div
                key={item.id}
                className={`table-item ${item.nodeType === 1 ? 'add-item' : ''}`}
                onClick={e => handleListClick(index, item.num)}
              >
                <Checkbox onChange={e => props.onCheckChange(index, item.num)} checked={item.checked}>
                  <div className="num">{item.num}</div>
                </Checkbox>
                <div className="doc1">
                  {item.doctor.find(n => n === 'hbfyxia') ? (
                    <CheckCircleTwoTone twoToneColor="red" style={{ fontSize: 15 }} />
                  ) : (
                    ''
                  )}
                </div>
                <div className="doc2">
                  {item.doctor.find(n => n === 'doctor_lwx') ? (
                    <CheckCircleTwoTone twoToneColor="#cfcf22" style={{ fontSize: 15 }} />
                  ) : (
                    ''
                  )}
                </div>
                <div className="doc3">
                  {item.doctor.find(n => n === 'doctor_diannei') ? (
                    <CheckCircleTwoTone twoToneColor="#37cdb1" style={{ fontSize: 15 }} />
                  ) : (
                    ''
                  )}
                </div>
                <div className="doc4">
                  {item.doctor.find(n => n === 'yz') ? (
                    <CheckCircleTwoTone twoToneColor="#4d4df9" style={{ fontSize: 15 }} />
                  ) : (
                    ''
                  )}
                </div>
                <div className="doc5">
                  {item.doctor.find(n => n === 'dn') ? (
                    <CheckCircleTwoTone twoToneColor="#19d319" style={{ fontSize: 15 }} />
                  ) : (
                    ''
                  )}
                </div>
                <div className="doc6">
                  {item.doctor.find(n => n === 'doctor_test') ? (
                    <CheckCircleTwoTone twoToneColor="#ac3dd1" style={{ fontSize: 15 }} />
                  ) : (
                    ''
                  )}
                </div>
                {/* <div className="action">
                  <Popconfirm
                    title="确定删除该结节信息？"
                    okText="确定"
                    cancelText="取消"
                    placement="topRight"
                    onConfirm={e => deleteNodeListHandle(e, item)}
                  >
                    删除
                  </Popconfirm>
                </div> */}
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
              {/* {props.noduleList?.map((item, index) => {
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
              })} */}
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
