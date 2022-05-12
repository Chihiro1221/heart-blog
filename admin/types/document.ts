export interface Document {
  _id?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface List<T> {
  total: number
  data: T[]
  lastPage: number
  page: number
}
