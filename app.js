const ajax = new XMLHttpRequest()
const NEWS_URL = "https://api.hnpwa.com/v0/news/1.json"
const CONTENT_URL = "https://api.hnpwa.com/v0/item/@id.json"

const container = document.getElementById("root")
const content = document.createElement("div")

ajax.open("GET", NEWS_URL, false)
ajax.send()
const newsFeed = JSON.parse(ajax.response)

const ul = document.createElement("ul")

for (let i = 0; i < 10; i += 1) {
  const li = document.createElement("li")
  const a = document.createElement("a")

  a.href = `#${newsFeed[i].id}`
  a.textContent += `${newsFeed[i].title} - (${newsFeed[i].comments_count})`

  li.appendChild(a)
  ul.appendChild(li)
}
container.appendChild(ul)

window.addEventListener("hashchange", function () {
  const id = this.location.hash.substring(1)

  ajax.open("GET", CONTENT_URL.replace("@id", id), false)
  ajax.send()
  const newsContent = JSON.parse(ajax.response)

  const title = this.document.createElement("h1")
  title.textContent += `${newsContent.title}`
  content.append(title)
})

container.appendChild(content)
