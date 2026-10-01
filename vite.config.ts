import { defineConfig, type Plugin } from 'vite';
import { renderFile } from 'pug';

// Компилирует src/index.pug и отдаёт результат вместо содержимого index.html.
// order: 'pre' — чтобы Vite потом сам обработал <script> и ссылки на ассеты.
function pugIndex(): Plugin {
  let entry = 'src/index.pug';
  // Партиалы подключаются через include и в граф модулей Vite не попадают,
  // поэтому следим за ними отдельно — иначе правка секции не вызовет перезагрузку.
  let templates = 'src/**/*.pug';

  return {
    name: 'pug-index',

    configResolved(config) {
      entry = `${config.root}/src/index.pug`;
      templates = `${config.root}/src/**/*.pug`;
    },

    transformIndexHtml: {
      order: 'pre',
      handler: () => renderFile(entry),
    },

    configureServer(server) {
      server.watcher.add(templates);
      server.watcher.on('change', (file) => {
        if (file.endsWith('.pug')) {
          server.hot.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [pugIndex()],
});
