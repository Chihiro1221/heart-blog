declare namespace toastui {
  class Editor {
    constructor(option: any)

    getHTML: () => any
    getMarkdown: () => any
    removeHook: (hook: string) => any
    addHook: (hook: string, callback: Function) => any
    setHeight: (height: string) => any
    getHeight: () => any
    on: (event: string, callback: Function) => any
    focus: () => any
    setPlaceholder: (placeholder: string) => any
  }
}
