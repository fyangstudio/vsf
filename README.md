vsf是virtualServer-freemarker的缩写，它是一个模拟freemarker渲染的组件，开发阶段的前后端分离，方便前端模板真假数据切换。适用于项目成立初期，数据结构尚未明确，并且通过freemarker渲染页面的工程。

作用：1.方便定义可视化数据结构；2.服务未到位情况下模拟数据交互（附有简单参数验证）3.不依赖java工程便可本地实施开发 4.统一团队fake数据方式 

安装

```
$npm install vsf -g
```

使用：

必须有vs-config.json文件 （请使用绝对路径）所有资源路径均为vs-config.json文件配置root的相对路径，端口默认为8080



1.指向vs-config.json的目录
```
$vsf /User/yangfan/vsf-test/
```
2.指向vs-config.json文件
```
$vsf /User/yangfan/vsf-test/vs-config.json
```
3.参照test目录下的使用
项目目录下
```
$npm install vsf
```
test.js
```
var vsf = require('../node_modules/vsf');
var path = require('path');
vsf(path.join(__dirname, './vs-config.json'), 'utf-8');
```
命令行 统一启动虚拟服务
```
$node test.js
```
模拟数据结构参考如下 
vs-root.json  团队不同人员可配置不同参考路径（可为绝对路径）
```
{
  // 服务端口
  "port": 8080,
  // ftl文件参考路径
  "rootFm": "./public/ftl/",
  // 资源文件参考路径
  "rootRes": "./public"
}
```
vs-config.json 较大数据 支持json文件拓展  团队可维护一份配置
```
{ 
  // 配置资源参考路径等参数
  "root": "./vs-root.json",
  // 插入页面的cookie  （非必须）
  "cookies": {
    "key1": "value1",
    "key2": "value2"
  },
  // 模拟模板对象集合  （非必须）
  "freeMarker": [
    {
      // 请求路径
      "url": "/",
      // 模板位置
      "path": "pages/index/index.ftl",
      // 模板渲染数据 (可外联json, 字符串地址，例"./vs-data/index/ftl-index.json")
      "data": {"name": "yf"}
    }
  ],
  // 模拟GET请求集合  （非必须）
  "GET": [
    {
      // 请求路劲
      "url": "/getList",
      // 输入参数（会验证参数数量）  (可外联json, 字符串地址，例"./vs-data/index/ftl-index.json")
      "input": {
        "limit": 10,
        "offset": 0
      },
      // 输出json  (可外联json, 字符串地址，例"./vs-data/index/ftl-index.json")
      "output": {
        "code": 200,
        "result": [],
        "total": 0
      }
    }
  ],
  // 模拟POST请求集合  （非必须）
  "POST": [
    {
      // 请求路劲
      "url": "/add",
      // 输入参数（会验证参数数量） (可外联json, 字符串地址，例"./vs-data/index/ftl-index.json")
      "input": {
        "name": "yf"
      },
      // 输出json   (可外联json, 字符串地址，例"./vs-data/index/ftl-index.json")
      "output": {
        "code": 200,
        "result": [],
        "message": ""
      }
    }
  ]
}
```


