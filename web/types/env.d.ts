interface ImportMetaEnv extends Readonly<Record<string, any>> {
  readonly VITE_DEV_URL: string;
  readonly VITE_PROD_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
