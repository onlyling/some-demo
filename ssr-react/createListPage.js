import React, { Component } from 'react'
import { Provider } from 'mobx-react'

import { initStore } from './store'
import List from './components/List'

export default ({ title, keywords, description, apiUrl }) => {

  class Node extends Component {

    static async getInitialProps(req) {
      const isServer = !!req
      const store = initStore(isServer)

      const res = await fetch(`${apiUrl}1`)
      const json = await res.json()

      return { list: json.results, isServer }
    }

    constructor(prop) {
      super(prop)
      this.store = initStore(prop.isServer, prop.list)
    }

    render() {
      return (
        <Provider store={this.store}>
          <List
            title={title}
            keywords={keywords}
            description={description}
            apiUrl={apiUrl}
          ></List>
        </Provider>
      )
    }
  }

  return Node

}