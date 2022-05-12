import { request } from "http";
import { http } from "@/plugins";

export const uploadImage = (blob: any) => {
  return http.request<{ url: string }>({
    url: "upload",
    method: "POST",
    data: blob,
  });
};
