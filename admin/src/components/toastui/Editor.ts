import { uploadImage } from "@/apis/uploadApi"

export default class {
  //编辑器实例
  public editor: toastui.Editor
  public isFullscreen: boolean = false

  constructor(el: string, public height: string, initialValue: string) {
    this.editor = new toastui.Editor({
      el: document.querySelector(el),
      height,
      initialEditType: "markdown",
      previewStyle: "vertical",
      initialValue,
      toolbarItems: this.toolbar(),
    })

    this.editor.setPlaceholder("在这里编写你的文章吧~")

    this.imageHook()
  }

  //工具条
  toolbar() {
    return [
      ["heading", "bold", "italic"],
      ["hr", "quote"],
      ["ul", "ol", "task", "indent", "outdent"],
      ["table", "image", "link"],
      ["code", "codeblock"],
      [
        {
          el: this.fullscreen(),
          name: "fullscreen",
          tooltip: "fullscreen",
        },
      ],
    ]
  }

  //全屏设置
  private fullscreen() {
    const button = document.createElement("button")
    button.className = "toastui-editor-toolbar-icons last"
    button.style.backgroundImage = "none"
    button.style.margin = "0"
    button.innerHTML = `<span>全屏</span>`
    button.addEventListener("click", () => {
      this.editor.setHeight("100vh")
      let ui = document.querySelector(".toastui-editor-defaultUI") as HTMLDivElement
      ui.classList.toggle("fullScreen")
      this.isFullscreen = true
    })

    document.documentElement.addEventListener("keyup", (event: KeyboardEvent) => {
      if (event.key == "Escape" && this.isFullscreen) {
        this.editor.setHeight(this.height)
        let ui = document.querySelector(".toastui-editor-defaultUI") as HTMLDivElement
        ui.classList.toggle("fullScreen")
        this.editor.focus()
        this.isFullscreen = false
      }
    })
    return button
  }

  //图片上传
  private imageHook() {
    this.editor.removeHook("addImageBlobHook")

    this.editor.addHook("addImageBlobHook", async (blob: any, callback: Function) => {
      const formData = new FormData()
      //添加post数据
      formData.append("file", blob, blob.name)
      //上传图片
      const response = await uploadImage(formData)
      //更改编辑器内容
      callback(response.result.url, blob.name)
    })
  }
}
