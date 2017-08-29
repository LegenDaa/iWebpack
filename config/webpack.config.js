//tutol:http://zhaoda.net/webpack-handbook/index.html

const webpack=require("webpack");
const project=require("./project.config");
const debug=require("debug")("app:config:webpack");
const UglifyJsParallelPlugin=require("webpack-uglify-parallel");
const os=require("os");

const __DEV__=project.globals.__DEV__
const __PROD__=project.globals.__PROD__

const webpackConfig={
    name:"client",
    target:"web",
    devtool:project.compiler_devtool,
    resolve:{
        modules:[project.paths.client(),"node_modules"],
        extensions:["web.js","js","jsx","json"]
    },
    module:{}
}

if(__DEV__){
    //开发环境
    debug("Enabling plugins for live development(HMR,NoErrors)");
    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()//webpack热替换插件
    )
}else if(__PROD__){
    //生产环境
    debug("Enanling plugins for production(UglifyJS)")

    /* ********** */
    //webpack plugin:https://segmentfault.com/a/1190000005106383
    /* ********** */
    webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),//优化插件，降低打包文件的大小，推荐使用
        new webpack.optimize.DedupePlugin(),
        new UglifyJsParallelPlugin({
            workers:os.cpus().length,
            mangle:true,
            compressor:{
                warnings:false,
                drop_debugger:true,
                dead_code:true
            }
        })
    )
}

module.exports=webpackConfig;