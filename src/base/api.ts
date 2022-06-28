// function applyApiMixins(targetClass: any, baseClasses: any[]): void {
//   baseClasses.forEach(baseClass => {
//     Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
//       const descriptor = Object.getOwnPropertyDescriptor(
//         baseClass.prototype,
//         name
//       )
import { NewsFeed, NewsDetail } from "../types"

//       if (descriptor)
//         Object.defineProperty(targetClass.prototype, name, descriptor)
//     })
//   })
// }

export class Api {
  xhr: XMLHttpRequest
  url: string

  constructor(url: string) {
    this.xhr = new XMLHttpRequest()
    this.url = url
  }

  protected getRequestWithXHR<AjaxResponse>(
    cb: (data: AjaxResponse) => void
  ): void {
    this.xhr.open("GET", this.url)
    this.xhr.addEventListener("load", () => {
      // Request finished. Do processing here.
      cb(JSON.parse(this.xhr.response) as AjaxResponse)
    })

    this.xhr.send()
  }

  protected getRequestWithPromise<AjaxResponse>(
    cb: (data: AjaxResponse) => void
  ): void {
    fetch(this.url)
      .then(response => response.json())
      .then(cb)
      .catch(error => alert(error))
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url)
  }

  getDataWithXHR(cb: (data: NewsFeed[]) => void): void {
    return this.getRequestWithXHR<NewsFeed[]>(cb)
  }

  getDataWithPromise(cb: (data: NewsFeed[]) => void): void {
    return this.getRequestWithPromise<NewsFeed[]>(cb)
  }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url)
  }

  getDataWithXHR(cb: (data: NewsDetail) => void): void {
    return this.getRequestWithXHR<NewsDetail>(cb)
  }

  getDataWithPromise(cb: (data: NewsDetail) => void): void {
    return this.getRequestWithPromise<NewsDetail>(cb)
  }
}

// interface NewsFeedApi extends Api {}
// interface NewsDetailApi extends Api {}

// applyApiMixins(NewsFeedApi, [Api])
// applyApiMixins(NewsDetailApi, [Api])
