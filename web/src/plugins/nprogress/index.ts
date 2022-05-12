import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
export default function setupNProgress() {
  NProgress.configure({
    showSpinner: false,
  });
}
