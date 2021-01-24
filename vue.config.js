module.exports = {
  devServer: {
    proxy: {
      '^/sudoku': {
        target: 'http://www.cs.utep.edu',
        changeOrigin: true,
        pathRewrite: { '^/sudoku': '/cheon/ws/sudoku' }
      }
    }
  }
}
