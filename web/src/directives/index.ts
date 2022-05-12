import { App } from "vue";

export default function setupDirective(app: App) {
  const directives = import.meta.globEager("./module/*.ts");
  Object.entries(directives).forEach(([key, module]) => {
    const name = key.split("/").pop()?.split(".").shift()!;
    app.directive(name, module.default);
  });
}
