import React from 'react'
import './NoduleInfo.scss'
import { Descriptions } from 'antd'

const size = 'small'

const NoduleInfo = props => {
<<<<<<< HEAD
=======
  const [btnGroup, setBtnGroup] = useState([
    {
      id: 0,
      val: 0,
      checked: true,
    },
    {
      id: 1,
      val: 1,
      checked: false,
    },
    {
      id: 2,
      val: 2,
      checked: false,
    },
    {
      id: 3,
      val: 3,
      checked: false,
    },
    {
      id: 4,
      val: 4,
      checked: false,
    },
    {
      id: 5,
      val: 5,
      checked: false,
    },
    {
      id: 6,
      val: 6,
      checked: false,
    },
    {
      id: 7,
      val: 7,
      checked: false,
    },
    {
      id: 8,
      val: 8,
      checked: false,
    },
    {
      id: 9,
      val: 9,
      checked: false,
    },
  ])

  const [riskData, setRiskData] = useState(0)

  useEffect(() => {
    if (props.noduleInfo) {
      setRiskData(parseInt(props.noduleInfo.scrynMaligant))
    }
  }, [props.noduleInfo])

  useEffect(() => {
    if (props.noduleInfo?.scrynMaligant) {
      let num = 0
      const risk = parseInt(props.noduleInfo.scrynMaligant)
      if (risk < 10) {
        num = 0
      } else {
        num = parseInt(risk / 10)
      }
      handleSetButtonActive(num)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.noduleInfo])

  const onLungChange = e => {
    props.checkNoduleList(e.target.value, 'lung')
    if (e.target.value === '左肺' && props.noduleInfo.lobe === '中叶') {
      props.checkNoduleList('上叶', 'lobe')
    }
  }

  const onLobeChange = e => {
    props.checkNoduleList(e.target.value, 'lobe')
  }

  const handleSelectChange = val => {
    props.checkNoduleList(val, 'type')
  }

  // 风险值输入框事件
  const handleRishInputChange = val => {
    handleSetButtonActive(parseInt(Number(val / 10)))
    setRiskData(val)
    props.handleUpdateRisk(val, 'inputChange')
  }

  const handleRishInputBlur = e => {
    handleSetButtonActive(parseInt(Number(e.target.value / 10)))
    props.handleUpdateRisk(Number(e.target.value))
  }

  // 设置当中按钮选中
  const handleSetButtonActive = num => {
    if (isNaN(num)) {
      return false
    }
    if (num > 9 || num < 0) {
      return false
    }
    btnGroup.map(item => (item.checked = false))
    const item = btnGroup.find(item => item.id === num)
    item.checked = true
    setBtnGroup([...btnGroup])
  }

  const handleRishButtonClick = val => {
    handleSetButtonActive(val)
    const curRisk = val * 10 + Math.floor(Math.random() * 10)
    setRiskData(curRisk)
    props.handleUpdateRisk(Number(curRisk))
  }

>>>>>>> a94da7370b645abf7e10a6a577c7b00a6a4506b2
  return (
    <div className="nodule-info-box">
      {props.noduleInfo ? (
        <>
          <Descriptions title="医生一建议：" column={2} size={size}>
            <Descriptions.Item label="肺">{props.noduleInfo.lung}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{props.noduleInfo.lobe}</Descriptions.Item>
            <Descriptions.Item label="类型">{props.noduleInfo.type}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生二建议：" column={2} size={size}>
            <Descriptions.Item label="肺">{props.noduleInfo.lung}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{props.noduleInfo.lobe}</Descriptions.Item>
            <Descriptions.Item label="类型">{props.noduleInfo.type}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="医生三建议：" column={2} size={size}>
            <Descriptions.Item label="肺">{props.noduleInfo.lung}</Descriptions.Item>
            <Descriptions.Item label="肺叶">{props.noduleInfo.lobe}</Descriptions.Item>
            <Descriptions.Item label="类型">{props.noduleInfo.type}</Descriptions.Item>
          </Descriptions>
        </>
      ) : null}
    </div>
  )
}

export default NoduleInfo
