import React, { Component } from 'react'

const tagColor = (type) => {
  let className
  switch (type) {
    case 'Android':
      className = ' volcano'
      break

    case 'iOS':
      className = ' blue'
      break

    case '休息视频':
      className = ' cyan'
      break

    case '福利':
      className = ' gold'
      break

    case '拓展资源':
      className = ' red'
      break

    case '前端':
      className = ' orange'
      break

    case 'App':
      className = ' lime'
      break

    default:
      className = ' magenta'
      break
  }
  return className
}

export default class Node extends Component {
  constructor(prop) {
    super(prop)
  }
  render() {
    let { item } = this.props

    return (
      <li>
        <div className="item-title">
          <a className="more" target="_blank" rel="nofollow" href={item.url}>More</a>
          <h2>{item.desc}</h2>
        </div>
        <div className="item-box">
          {item.who}&emsp;{item.publishedAt.slice(0, 10)}&emsp;<span className={`type${tagColor(item.type)}`}>{item.type}</span>
        </div>
      </li>
    )
  }
}