import { cacheEnum } from "@/enum/cacheEnum";
import utils from "@/utils";
import http from "@/plugins/axios";

export function uploadUrl() {
  return http.config.baseURL + "/upload";
}

export function setAuthorization() {
  return {
    Authorization: `Bearer ${utils.store.get(cacheEnum.TOKEN)?.cache.token}`,
  };
}
