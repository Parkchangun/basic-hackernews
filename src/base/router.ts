import { RouteInfo } from "../types"
import View from "./view"

export default class Router {
  private defaultRoute: RouteInfo | null
  private routeTable: RouteInfo[]

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
