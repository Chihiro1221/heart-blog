export interface FileItem {
  uid: string
  name?: string
  status?: string
  response?: string
  url?: string
  type?: string
  size: number
  originFileObj: any
}

export interface FileInfo {
  file: FileItem
  fileList: FileItem[]
}
