type Store = {
  currentPage: number
  feeds: NewsFeed[]
}

type News = {
  id: number
  time_ago: string
  title: string
  url: string
  user: string
  content: string
}

type NewsFeed = News & {
  comments_count: number
  points: number
  read?: boolean
}

type NewsDetail = News & {
  comments: NewsComment[]
}

type NewsComment = News & {
  comments: NewsComment[]
  level: number
}

type RouteInfo = {
  path: string
  page: View
}

const content: HTMLDivElement = document.createElement("div")
const ajax: XMLHttpRequest = new XMLHttpRequest()
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json"
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"

const store: Store = {
  currentPage: 1,
  feeds: [],
}

// function applyApiMixins(targetClass: any, baseClasses: any[]): void {
//   baseClasses.forEach(baseClass => {
//     Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
//       const descriptor = Object.getOwnPropertyDescriptor(
//         baseClass.prototype,
//         name
//       )

//       if (descriptor)
//         Object.defineProperty(targetClass.prototype, name, descriptor)
//     })
//   })
// }

class Api {
  protected getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest()
    ajax.open("GET", url, false)
    ajax.send()

    return JSON.parse(ajax.response)
  }
}

class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(NEWS_URL)
  }
}

class NewsDetailApi extends Api {
  getData(id: string): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENT_URL.replace("@id", id))
  }
}

// interface NewsFeedApi extends Api {}
// interface NewsDetailApi extends Api {}

// applyApiMixins(NewsFeedApi, [Api])
// applyApiMixins(NewsDetailApi, [Api])

abstract class View {
  template: string
  renderTemplate: string
  container: HTMLElement
  htmlList: string[]

  constructor(containerId: string, template: string) {
    const containerEl = document.getElementById(containerId)

    if (!containerEl) {
      throw "최상위 컨테이너가 없습니다!"
    }

    this.container = containerEl
    this.template = template
    this.renderTemplate = template
    this.htmlList = []
  }

  updateView(): void {
    this.container.innerHTML = this.renderTemplate
    this.renderTemplate = this.template
  }

  addHtml(htmlString: string): void {
    this.htmlList.push(htmlString)
  }

  getHtml(): string {
    const snapshot = this.htmlList.join("")
    this.clearHtmlList()
    return snapshot
  }

  clearHtmlList(): void {
    this.htmlList = []
  }

  setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value)
  }

  abstract render(): void
}

class Router {
  defaultRoute: RouteInfo | null
  routeTable: RouteInfo[]

  constructor() {
    window.addEventListener("hashchange", this.route.bind(this))
    this.defaultRoute = null
    this.routeTable = []
  }

  setDefaultPage(page: View): void {
    this.defaultRoute = { path: "", page }
  }

  addRoutePath(path: string, page: View): void {
    this.routeTable.push({ path, page })
  }

  route() {
    const routePath = location.hash

    if (routePath === "" && this.defaultRoute) {
      this.defaultRoute.page.render()
    }

    for (const routeInfo of this.routeTable) {
      if (routePath.indexOf(routeInfo.path) >= 0) {
        routeInfo.page.render()
        break
      }
    }
  }
}

class NewsFeedView extends View {
  api: NewsFeedApi
  feeds: NewsFeed[]

  constructor(containerId: string) {
    let template = `
    <div class="bg-gray-600 min-h-screen">
    <div class="bg-white text-xl">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center py-6">
          <div class="flex justify-start">
            <h1 class="font-extrabold">Hacker News</h1>
          </div>
          <div class="items-center justify-end">
            <a href="#/page/{{__prev_page__}}" class="text-gray-500">
              Previous
            </a>
            <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
              Next
            </a>
         </div>
        </div> 
      </div>
    </div>
    <div class="p-4 text-2xl text-gray-700">
     {{__news_feed__}}        
    </div>
  </div>
`
    super(containerId, template)
    this.api = new NewsFeedApi()
    this.feeds = store.feeds

    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData()
      this.makeFeeds()
    }
  }

  makeFeeds(): void {
    for (let i = 0; i < this.feeds.length; i += 1) this.feeds[i].read = false
  }

  render(): void {
    store.currentPage = Number(location.hash.substring(7) || 1)
    for (
      let i = (store.currentPage - 1) * 10;
      i < store.currentPage * 10;
      i += 1
    ) {
      const { read, id, title, comments_count, user, points, time_ago } =
        this.feeds[i]
      this.addHtml(`
    <div class="p-6 ${
      read ? "bg-red-500" : "bg-white"
    } mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
    <div class="flex">
      <div class="flex-auto">
        <a href="#/show/${id}">${title}</a>  
      </div>
      <div class="text-center text-sm">
        <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
      </div>
    </div>
    <div class="flex mt-3">
      <div class="grid grid-cols-3 text-sm text-gray-500">
        <div><i class="fas fa-user mr-1"></i>${user}</div>
        <div><i class="fas fa-heart mr-1"></i>${points}</div>
        <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
      </div>  
    </div>
  </div>
  `)
    }

    this.setTemplateData("news_feed", this.getHtml())
    this.setTemplateData(
      "prev_page",
      store.currentPage > 1 ? String(store.currentPage - 1) : "1"
    )
    this.setTemplateData(
      "next_page",
      Math.ceil(store.feeds.length / 10) === store.currentPage
        ? String(store.currentPage)
        : String(store.currentPage + 1)
    )

    this.updateView()
  }
}

class NewsDetailView extends View {
  constructor(containerId: string) {
    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__current_page__}}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>{{__title__}}</h2>
        <div class="text-gray-400 h-20">
          {{__content__}}
        </div>

        {{__comments__}}

      </div>
    </div>
  `
    super(containerId, template)
  }

  checkRead(id: number): void {
    for (let i = 0; i < store.feeds.length; i += 1) {
      if (store.feeds[i].id === id) {
        store.feeds[i].read = true
        break
      }
    }
  }

  makeComment(comments: NewsComment[]): string {
    for (let i = 0; i < comments.length; i++) {
      const comment: NewsComment = comments[i]

      this.addHtml(`
        <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>      
      `)

      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment(comment.comments))
      }
    }

    return this.getHtml()
  }

  render() {
    const id = location.hash.substring(7)
    const api = new NewsDetailApi()
    const newsDetail = api.getData(id)

    this.checkRead(Number(id))

    this.setTemplateData("current_page", String(store.currentPage))
    this.setTemplateData("title", newsDetail.title)
    this.setTemplateData("content", newsDetail.content)
    this.setTemplateData("comments", this.makeComment(newsDetail.comments))

    this.updateView()
  }
}

const router: Router = new Router()

const newsFeedView = new NewsFeedView("root")
const newsDetailView = new NewsDetailView("root")

router.setDefaultPage(newsFeedView)
router.addRoutePath("/page/", newsFeedView)
router.addRoutePath("/show", newsDetailView)

router.route()
