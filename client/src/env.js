const DEPLOYMENT = true; // Change this value to switch between production and development

const ENV = DEPLOYMENT
  ? "https://url-metadata-fetcher-backend.vercel.app"
  : "http://localhost:5000";

export { ENV };
