import { NewsDetailApi } from "../base/api"
import View from "../base/view"
import { NewsComment } from "../types"

export default class NewsDetailView extends View {
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
        <div class="text-gray-400 min-h-20">
          {{__content__}}
        </div>

        {{__comments__}}

      </div>
    </div>
  `
    super(containerId, template)
  }

  private checkRead(id: number): void {
    for (let i = 0; i < window.store.feeds.length; i += 1) {
      if (window.store.feeds[i].id === id) {
        window.store.feeds[i].read = true
        break
      }
    }
  }

  private makeComment(comments: NewsComment[]): string {
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

    this.setTemplateData("current_page", String(window.store.currentPage))
    this.setTemplateData("title", newsDetail.title)
    this.setTemplateData("content", newsDetail.content)
    console.log(newsDetail)
    this.setTemplateData("comments", this.makeComment(newsDetail.comments))

    this.updateView()
  }
}
