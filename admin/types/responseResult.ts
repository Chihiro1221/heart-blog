export interface ResponseResult<T> {
  code: number
  message: string
  result: T
  token: string
  type: 'success' | 'error'
}
