import { RouteRecordRaw } from 'vue-router';
export const autoLoad = () => {
  const routes = [] as RouteRecordRaw[];
  const modules = import.meta.globEager('./module/**/*.ts');
  Object.values(modules).forEach((module) => {
    routes.push(module.default);
  });

  return routes;
};
