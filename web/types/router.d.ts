import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    guest?: boolean;
    isAuth?: boolean;
  }
}
