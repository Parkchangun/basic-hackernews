// function applyApiMixins(targetClass: any, baseClasses: any[]): void {
//   baseClasses.forEach(baseClass => {
//     Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
//       const descriptor = Object.getOwnPropertyDescriptor(
//         baseClass.prototype,
//         name
//       )

import { NEWS_URL, CONTENT_URL } from "../config"
import { NewsFeed, NewsDetail } from "../types"

//       if (descriptor)
//         Object.defineProperty(targetClass.prototype, name, descriptor)
//     })
//   })
// }

export class Api {
  protected getRequest<AjaxResponse>(url: string): AjaxResponse {
    const ajax = new XMLHttpRequest()
    ajax.open("GET", url, false)
    ajax.send()

    return JSON.parse(ajax.response)
  }
}

export class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>(NEWS_URL)
  }
}

export class NewsDetailApi extends Api {
  getData(id: string): NewsDetail {
    return this.getRequest<NewsDetail>(CONTENT_URL.replace("@id", id))
  }
}

// interface NewsFeedApi extends Api {}
// interface NewsDetailApi extends Api {}

// applyApiMixins(NewsFeedApi, [Api])
// applyApiMixins(NewsDetailApi, [Api])
