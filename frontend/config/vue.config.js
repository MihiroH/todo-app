module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/currents/' : '/',
  outputDir: process.env.NODE_ENV === 'production' ? 'dist/currents/' : 'dist',
}
