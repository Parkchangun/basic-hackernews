import { NewsFeedApi } from "../base/api"
import View from "../base/view"

export default class NewsFeedView extends View {
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
  }

  private initRead(): void {
    for (let i = 0; i < window.store.feeds.length; i += 1)
      window.store.feeds[i].read = false
  }

  render(): void {
    const api = new NewsFeedApi()

    if (window.store.feeds.length === 0) {
      window.store.feeds = api.getData()
      this.initRead()
    }

    window.store.currentPage = Number(location.hash.substring(7) || 1)
    for (
      let i = (window.store.currentPage - 1) * 10;
      i < window.store.currentPage * 10;
      i += 1
    ) {
      const { read, id, title, comments_count, user, points, time_ago } =
        window.store.feeds[i]
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
      window.store.currentPage > 1 ? String(window.store.currentPage - 1) : "1"
    )
    this.setTemplateData(
      "next_page",
      Math.ceil(window.store.feeds.length / 10) === window.store.currentPage
        ? String(window.store.currentPage)
        : String(window.store.currentPage + 1)
    )

    this.updateView()
  }
}
