import http from "@/plugins/axios";
import { IAction } from "#/responseResult";

export const action = (dto: IAction) => {
  return http.request<IAction>({
    url: "/actions",
    method: "POST",
    data: dto,
  });
};
