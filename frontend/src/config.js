let config = {};

if (window.env && typeof window.env === 'object') {
  config = {
    ...config,
    ...window.env,
  };
}

if (process.env && typeof process.env === 'object') {
  config = {
    ...config,
    ...process.env,
  };
}

export default config;
