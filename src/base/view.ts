export default abstract class View {
  private template: string
  private renderTemplate: string
  private container: HTMLElement
  private htmlList: string[]

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

  protected updateView(): void {
    this.container.innerHTML = this.renderTemplate
    this.renderTemplate = this.template
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString)
  }

  protected getHtml(): string {
    const snapshot = this.htmlList.join("")
    this.clearHtmlList()
    return snapshot
  }

  private clearHtmlList(): void {
    this.htmlList = []
  }

  protected setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value)
  }

  abstract render(): void
}
