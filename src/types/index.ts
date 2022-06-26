import View from "../base/view"

export interface NewsStore {
  getAllFeeds: () => NewsFeed[]
  getFeed: (position: number) => NewsFeed
  setRead: (feeds: NewsFeed[]) => void
  checkedRead: (id: number) => void
  hasFeeds: boolean
  currentPage: number
  numberOfFeed: number
  nextPage: number
  prevPage: number
}

export type News = {
  id: number
  time_ago: string
  title: string
  url: string
  user: string
  content: string
}

export type NewsFeed = News & {
  comments_count: number
  points: number
  read?: boolean
}

export type NewsDetail = News & {
  comments: NewsComment[]
}

export type NewsComment = News & {
  comments: NewsComment[]
  level: number
}

export type RouteInfo = {
  path: string
  page: View
}
