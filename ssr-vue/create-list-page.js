import List from './components/list'

export default ({
  apiUrl,
  title,
  keywords,
  description
}) => {
  return (
    {
      data() {
        return {
          list: [],
          currentPage: 1,
          loadMore: false,
          hasMore: true,
        }
      },
      head() {
        return {
          title,
          meta: [
            keywords ? { hid: 'keywords', name: 'keywords', content: keywords } : '',
            description ? { hid: 'description', name: 'description', content: description } : '',
          ]
        }
      },
      async asyncData({ isServer }) {
        const res = await fetch(`${apiUrl}1`)
        const json = await res.json()

        return { list: json.results, isServer }
      },
      methods: {
        handleClick() {
          if (this.loadMore || !this.hasMore) {
            return
          }
          this.loadMore = true
          
          this.loadMoreData()
        },
        async loadMoreData() {

          let currentPage = this.currentPage
          currentPage += 1

          const res = await fetch(`${apiUrl}${currentPage}`)
          const json = await res.json()

          if (json.results && json.results.length) {
            this.list = this.list.concat(json.results)
            this.loadMore = false
            this.currentPage = currentPage
          } else {
            this.hasMore = false
          }
        }
      },
      render(h) {
        return (
          <div class="list-box">
            <List list={this.list} />
            <div class="list-more">
              <button class="more-btn" onClick={this.handleClick}>加载更多</button>
            </div>
          </div>
        )
      }
    }
  )
}