module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/clock/'
    : '/',
  outputDir: process.env.NODE_ENV === 'production'
    ? 'dist/clock/'
    : '/'
}
