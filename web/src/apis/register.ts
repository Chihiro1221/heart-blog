import { Document } from "#/responseResult";
import http from "@/plugins/axios";

export interface IRegister {
  username: string;
  password: string;
  password_confirmation: string;
  email: string;
  code: number | null;
}

export type forgetPassword = Omit<IRegister, "username">;

export interface Register extends IRegister, Document {}

/**
 * 发送验证码
 * @returns {code:0123}
 */
export const sendEmailCode = (email: string) => {
  return http.request({
    url: "auth/email",
    method: "POST",
    data: {
      email,
    },
  });
};

/**
 * 注册账号
 * @param form
 * @returns
 */
export const register = (form: IRegister) => {
  return http.request<Register>({
    method: "POST",
    url: "auth/register",
    data: form,
  });
};

/**
 * 重置密码
 */
export const forget_password = (form: forgetPassword) => {
  return http.request({
    method: "POST",
    url: "auth/forget-password",
    data: form,
  });
};
