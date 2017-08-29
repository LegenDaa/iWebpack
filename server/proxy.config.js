//配置代理服务器的代理指向
const proxy=[{
    url:"/back_end/auth/",
    target:"http://10.2.0.1:8351"
},{
    url:"/back_end/",
    target:"http://10.2.0.1:8352"
}]
module.exports=proxy;