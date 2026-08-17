// Vercel serverless entry point: wraps the compiled Angular SSR Express app
// (dist/neo-vintage-new/server/server.mjs) as a Node request handler.
export default async (req, res) => {
  const { default: app } = await import('../dist/neo-vintage-new/server/server.mjs');
  return app(req, res);
};
