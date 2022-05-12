import env from './env';
import multer from './multer';
import uploadStore from './uploadStore';

export default () => {
  return {
    uploadStore: uploadStore(),
    email: multer(),
    env: env(),
  };
};
