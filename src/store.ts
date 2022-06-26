import { NewsFeed, NewsStore } from "./types"
export default class Store implements NewsStore {
  private feeds: NewsFeed[]
  private _currentPage: number

  constructor() {
    this.feeds = []
    this._currentPage = 1
  }

  get currentPage(): number {
    return this._currentPage
  }

  set currentPage(page: number) {
    if (page <= 0) return
    this._currentPage = page
  }

  get nextPage(): number {
    return Math.ceil(this.feeds.length / 10) === this.currentPage
      ? this._currentPage
      : this._currentPage + 1
  }

  get prevPage(): number {
    return this._currentPage > 1 ? this._currentPage - 1 : 1
  }

  get numberOfFeed(): number {
    return this.feeds.length
  }

  get hasFeeds(): boolean {
    return this.feeds.length > 0
  }

  getAllFeeds(): NewsFeed[] {
    return this.feeds
  }

  getFeed(position: number): NewsFeed {
    return this.feeds[position]
  }

  setRead(feeds: NewsFeed[]): void {
    this.feeds = feeds.map(feed => ({
      ...feed,
      read: false,
    }))
  }

  checkedRead(id: number): void {
    const feed = this.feeds.find((feed: NewsFeed) => feed.id === id)

    if (feed) feed.read = true
  }
}
