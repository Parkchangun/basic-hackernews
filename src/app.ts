import Router from "./base/router"
import { NewsDetailView, NewsFeedView } from "./page"
import Store from "./store"

// const content: HTMLDivElement = document.createElement("div")
// const ajax: XMLHttpRequest = new XMLHttpRequest()

// const store: Store = {
//   currentPage: 1,
//   feeds: [],
// }

// declare global {
//   interface Window {
//     store: Store
//   }
// }

// window.store = store
const store = new Store()

const router: Router = new Router()

const newsFeedView = new NewsFeedView("root", store)
const newsDetailView = new NewsDetailView("root", store)

router.setDefaultPage(newsFeedView)

router.addRoutePath("/page/", newsFeedView)
router.addRoutePath("/show", newsDetailView)

router.route()
