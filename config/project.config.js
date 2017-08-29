const path=require("path")
const debug=require("debug")("app:config:project");
const ip=require("ip");
//声明初始的配置
const config={
    env:process.env.NODE_ENV||"development",//process：node进程实例
    //Project Structure
    path_base:path.resolve(__dirname,".."),//path详解:http://www.jianshu.com/p/fe41ee02efc8
    dir_client:"src",
    dir_dist:"dist",
    dir_public:"public",
    dir_server:"server",
    dir_test:"tests",

    //server config
    server_host:ip.address(),//http://127.0.0.1
    server_port:process.env.PORT||3000,

    //compiler config
    compiler_devtool:"source-map",
    compiler_hash_type:"hash",
    compiler_fail_on_warning:false,
    compiler_quiet:false,
    compiler_public_path:"/",
    compiler_stats:{
        chunks:false,
        chunkModules:false,
        colors:true
    }
}

config.globals={
    "process.env":{
        "NODE_ENV":JSON.stringify(config.env)
    },
    "filename":"index.html",
    "NODE_ENV":config.env,
    "__DEV__":config.env=="development",
    "__PROD__":config.env="production",
    "__TEST__":config.env="test"
}

/* ************ */
    // Utiliies
/* ************ */
function base(){
    const args=[config.path_base].concat([].slice.call(arguments));
    return path.resolve.apply(path,args)
}

config.paths={
    base: base,
    node_modules:base.bind(null,config.node_modules),
}


const environments=require("./environments.config")
const overrides=environments[config.env]
if(overrides){
    debug("Found overrides,applying to default configuration.")
    Object.assign(config,overrides(config))
}else{
    debug("No environment overriders found,defaults will be userd");
}
module.exports=config;
