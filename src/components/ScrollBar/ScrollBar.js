import React, { useState, useEffect } from 'react'
import './ScrollBar.scss'

const  ScrollBar = props => {
  const [list, setList] = useState([])

  useEffect(() => {
    if (props.imageIds.length > 0) {
      const { noduleList, imageIds } = props
      const list = []
      const h = 100 / imageIds.length
      const nodeIndexList = Array.from(new Set([...noduleList.map(item => item.num)]))
      for (let i = 0; i < imageIds.length; i++) {
        if (nodeIndexList.includes(i)) {
          list.push(
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="active"
              onClick={e => props.handleScorllClicked(i)}
            ></div>
          )
        } else {
          list.push(<div key={i} style={{ height: `${h}%` }}></div>)
        }
      }
      setList(list)
    }
  }, [props, props.imageIds])

  return <div className="scroll-bar-wrap">{list.map(item => item)}</div>
}

export default ScrollBar
