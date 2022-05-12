import { App } from 'vue';
import setupEditor from './editor';
import setupPreviewEditor from './preview';

export default function setupVMdEditor(app: App) {
  setupPreviewEditor(app);
  setupEditor(app);
}
