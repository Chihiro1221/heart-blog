import { createApp } from 'vue';
import App from './App.vue';
import setupPlugins from './plugins';
import router, { setupRouter } from './router';
import './assets/global.scss';
import 'element-plus/dist/index.css';
import setupDirective from './directives';
import '@/store/user';

async function bootstrap() {
  const app = createApp(App);
  setupPlugins(app);
  setupDirective(app);
  setupRouter(app);
  await router.isReady();
  app.mount('#app');
}

void bootstrap();
