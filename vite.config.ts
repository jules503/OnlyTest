import { defineConfig, type Plugin } from 'vite';
import { renderFile } from 'pug';

/**
 * Компилирует src/index.pug и отдаёт результат вместо содержимого index.html.
 * order: 'pre' — чтобы Vite потом сам обработал <script> и ссылки на ассеты.
 */
function pugIndex(): Plugin {
  let entry = 'src/index.pug';

  return {
    name: 'pug-index',

    configResolved(config) {
      entry = `${config.root}/src/index.pug`;
    },

    transformIndexHtml: {
      order: 'pre',
      handler: () => renderFile(entry),
    },

    configureServer(server) {
      server.watcher.add(entry);
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
