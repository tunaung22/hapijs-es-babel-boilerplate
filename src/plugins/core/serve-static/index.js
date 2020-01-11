
export async function register(server) {
  const staticRoute = {
    method: 'GET',
    path: '/public/{filename*}',
    options: {
      auth: false,
    },
    handler: {
      // directory: { path: Path.normalize(__dirname + '/') }
      directory: {
        path: 'src/assets/',
        listing: true,
      },
    },
  };

  server.route([].concat(staticRoute));
}
export const name = 'serve-static';
export const version = '0.0.1';
