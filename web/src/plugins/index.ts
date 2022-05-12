import setupDayjsPlugins from '@/plugins/dayjs';
import { App } from 'vue';
import setupElement from './element';
import './tailwindcss/index.scss';
import setupVeeValidate from './veeValidate';
import setupVMdEditor from '@/plugins/v-md-editor';
import setupPinia from '@/plugins/pinia';
import setupNProgress from './nprogress';

export default function setupPlugins(app: App) {
  setupPinia(app);
  setupElement(app);
  setupVMdEditor(app);
  setupDayjsPlugins();
  setupVeeValidate();
  setupNProgress();
}
