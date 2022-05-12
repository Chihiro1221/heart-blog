import { App } from 'vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import Prism from 'prismjs';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import 'prismjs/components/prism-json';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import '@kangc/v-md-editor/lib/style/preview.css';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

export default function setupPreviewEditor(app: App) {
  VMdPreview.use(vuepressTheme, {
    Prism,
  });
  VMdPreview.use(createCopyCodePlugin());
  VMdPreview.use(createTodoListPlugin());
  VMdPreview.use(createEmojiPlugin());
  app.use(VMdPreview);
}
