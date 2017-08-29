const express=require("express");//express框架
const bodyParser=require("body-parser");//中间价用来解析请求体body
const proxy=require("http-proxy-middleware");//代理中间件
const qs=require("querystring");//字符串格式化
const proxyConfig=require("./proxy.config");
const app=express();
const project = require("../config/project.config");

//主要点：http-proxy-middleware
//https://www.npmjs.com/package/http-proxy-middleware

const createProxySetting=function (url){
    return {
        target:url,
        changeOrigin:true,
        headers:{
            Accept:"application/json",
            "X-Requested-With":"XMLHttpRequest"
        },
        //路由重定向
        pathRewrite:{
            "^/back_end/*":"/back_end/404"
        },
        //接受请求的事件
        onProxyReq:function(proxyReq,req){
            //判断接收到的请求方法是否是POST
            //是否接受到了请求体
            if(req.method==="POST"&&req.body){
                //post方法传递过来的 数据为数据流，需要手动转换成json
                const bodyData=qs.stringify(req.body)
                proxyReq.write(bodyData);
            }
        }
    }
}

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:false}))

proxyConfig.forEach(function(item) {
    app.use(item.url,proxy(createProxySetting(item.target)))
});

