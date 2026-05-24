module.exports = {
  cacheDirectory: './.puppeteer_cache',
  skipDownload: process.env.PUPPETEER_SKIP_DOWNLOAD === 'true',
};
