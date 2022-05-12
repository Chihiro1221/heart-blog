import { ActionEnum, ActionObjectEnum } from '@/enum/actionEnum';
import { Status } from '@/enum/statusEnum';

export interface ResponseResult<T> {
  code: number;
  message: string;
  result: T;
  type: 'success' | 'error';
}

export interface Document {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListResult<T> {
  data: T;
  lastPage: number;
  page: number;
  total: number;
}

export interface IArticle {
  _id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string | null;
  status: Status;
  is_stick: 1 | 0;
  cover: string;
  author?: IUser;
  category?: ICate;
  tags?: ITag[];
  cover_isShow?: boolean;
  likes?: IAction[];
  comments?: IComment[];
  browsers?: IAction[];
  collects?: IAction[];
  checked?: boolean;
}

export interface IRole {
  createdAt: string;
  menu_id: any;
  name: string;
  nickname: string;
  updatedAt: string;
  _id: string;
}

export interface IUser {
  _id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  password?: string;
  nickname: string;
  avatar?: string;
  description?: string;
  qq?: string;
  email?: string;
  github?: string;
  role?: IRole;
  rawPassword?: string;
  reNewPassword?: string;
  is_enabled?: boolean;
  articles?: { count: number };
  likes?: { _id: null; count: number };
  browsers?: { _id: null; count: number };
  blogroll?: IBlogRoll;
}

export interface UserForm extends Omit<IUser, '_id' | 'createdAt' | 'updatedAt'> {}

export interface ICate {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  parent?: string;
  children?: ICate[];
  is_enabled: 1 | 0;
}

export interface ITag {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  color?: string;
  is_enabled: 1 | 0;
}

export interface IAction {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  action_object_type: ActionObjectEnum;
  article?: IArticle;
  object_id: string;
  action_type: ActionEnum;
  user?: IUser | string;
  is_show?: 0 | 1;
  status?: 0 | 1;
}

export interface IAlbum {
  _id: string;
  createdAt: string;
  updatedAt: string;
  picture: string;
  description?: string;
  tags?: ITag[];
  picture_isShow?: boolean;
  likes?: IAction[];
  comments?: IComment[];
  collects?: IAction[];
}

export interface IComment {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: IUser;
  children?: IComment[];
  state?: boolean;
  likes?: IAction[];
  content: string;
  action_object_type: ActionObjectEnum;
  object_id?: string;
  readonly is_show?: 0 | 1;
  parent?: IComment | string;
}

export interface IBlogRoll {
  _id: string;
  createdAt: string;
  updatedAt: string;
  status: 0 | 1;
  avatar: string;
  site: string;
  description?: string;
  user?: string | IUser;
}
