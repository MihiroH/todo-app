module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/clock/'
    : '/',
  outputDir: 'dist/clock/'
}