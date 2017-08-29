const webpack=require("webpack");
const project=require("./project.config");
const debug=require("debug")("app:config:webpack");
const UglifyJsParallelPlugin=require("webpack-uglify-parallel");
const os=require("os");

const __DEV__=project.globals&&project.globals.__DEV__
const __PROD__=project.globals&&project.globals.__PROD__

const webpackConfig={
    name:"client",
    target:"web",
    devtool:project.compiler_devtool,
    resolve:{
        modules:["node_modules"],
        extensions:["web.js","js","jsx","json"]
    },
    module:{}
}

if(__DEV__){
    //开发环境
    debug("Enabling plugins for live development(HMR,NoErrors)");
    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    )
}else if(__PROD__){
    //测试环境
    debug("Enanling plugins for production(UglifyJS)")
    webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
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