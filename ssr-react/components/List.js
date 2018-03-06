
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

import Layout from './Layout'
import ListItem from './ListItem'

@inject('store')
@observer
export default class Node extends Component {
  constructor(prop) {
    super(prop)

    this.state = {
      currentPage: 1,
      loadMore: false,
      hasMore: true
    }
  }

  handleClick = () => {
    let { loadMore, hasMore } = this.state
    if (loadMore || !hasMore) {
      return
    }

    this.setState({
      loadMore: true
    }, () => {
      this.loadMore()
    })
  }

  loadMore = async () => {
    let { currentPage } = this.state
    let { apiUrl, store } = this.props

    currentPage += 1

    const res = await fetch(`${apiUrl}${currentPage}`)
    const json = await res.json()

    if (json.results && json.results.length) {
      store.loadMoreList(json.results)
      this.setState({
        loadMore: false,
        currentPage
      })
    } else {
      this.setState({
        hasMore: false
      })
    }

  }

  render() {
    let { title, keywords, description, store } = this.props
    const list = [{ _id: 1, desc: '2323', who: '你猜', publishedAt: '2017-11-08T11:00:50.559Z' }, { _id: 2, desc: '2323', who: '你猜', publishedAt: '2017-11-08T11:00:50.559Z' }, { _id: 3, desc: '2323', who: '你猜', publishedAt: '2017-11-08T11:00:50.559Z' }]

    return (
      <Layout
        title={title}
        keywords={keywords}
        description={description}
      >
        <ul className="list-ul">
          {store.list.map((item) => {
            return (
              <ListItem key={item._id} item={item}></ListItem>
            )
          })}
        </ul>
        <div className="list-more">
          <button className="more-btn" onClick={this.handleClick}>加载更多</button>
        </div>
      </Layout>
    )
  }
}