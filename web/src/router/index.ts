import { autoLoad } from './autoload';
import { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import Guard from './guard';
import routes from './routes';
const router = createRouter({
  history: createWebHistory(),
  routes: [...autoLoad(), ...routes],
});

export default router;

export function setupRouter(app: App) {
  app.use(router);
  new Guard();
}
