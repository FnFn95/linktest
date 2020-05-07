## invelink 盒子官网 前端
### 环境依赖

```
 "node": ">= 6.0.0",
 "npm": ">= 3.0.0"
```

### 项目构建及运行

``` bash
# clone项目仓库
git clone git@codexx.zrtec.net:suikai/invelink-web.git

# 进入项目目录
cd invelink-web

# 安装淘宝镜像，如果已经安装可以换忽略，如果有vpn可以忽略(npm包一般需要翻墙下载，故选择淘宝镜像安装)
npm i cnpm -g

# 安装项目依赖
cnpm i

# 启动项目及代码热更新，访问路径localhost:8080（默认端口8080可以在config/index.js修改端口）
npm run dev

# 构建生产发布（此步骤一般在服务器端完成）
npm run build

```





### 样式库：bootstrap 4.4.1

使用类名详见：https://v4.bootcss.com/docs/components/alerts/





### 组件说明：

1. **header**.vue   全局顶部导航条

2. **next**.vue   全局底部版权条

3. **user-options**.vue   个人中心页的左侧导航选项栏

4. **numbering**.vue   用于商品增加或减少，事件：adding   reduce  都会返回参数是操作后的数量

5. **pagination**.vue   分页器，事件：previous   next   都会返回当前页码