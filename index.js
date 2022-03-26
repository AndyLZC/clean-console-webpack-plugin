function cleanConsoleWebpackPlugin(options) {
    this.options = options
}

cleanConsoleWebpackPlugin.prototype.apply = function(compiler) {

    // 监听事件在回调中获得 compilation 对象
    compiler.hooks.compilation.tap('cleanConsoleWebpackPlugin', compilation => {
        compilation.hooks.processAssets.tap({
              name: 'cleanConsoleWebpackPlugin',
            }, 
             assets => handleAsset(assets)
        )

        function handleAsset(assets) {
            const reg = /console.log\(['|"](.*?)['|"]\)/
            for(const [filename, source] of Object.entries(assets)) {
                const isJs = /\.js$/.test(filename)
                if(!isJs) continue
                const content = source.source().replace(reg, '')
                compilation.assets[filename] = {
                    source: () => {
                        return content
                    },
                    size: () => {
                        return Buffer.byteLength(content, 'utf8')
                    }
                }
            }
        }
    })
}

module.exports = cleanConsoleWebpackPlugin