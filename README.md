vsf是virtualServer-freemarker的缩写，它是一个模拟freemarker渲染的组件，方便前端模板真假数据切换。适用于项目成立初期，数据结构尚未明确，并且通过freemarker渲染页面的工程。

作用：1.方便定义可视化数据结构；2.服务未到位情况下模拟数据交互（附有简单参数验证）3.不依赖java工程便可本地实施开发 4.统一团队fake数据方式 

安装

```
$npm install vsf -g
```

使用：

必须有vs-config.json文件 （请使用绝对路径）所有资源路径均为vs-config.json文件配置root的相对路径，端口默认为8080

1. 指向vs-config.json的目录
```
$vsf /User/yangfan/vsf-test/
```
2.指向vs-config.json文件
```
$vsf /User/yangfan/vsf-test/vs-config.json
```
3.参照test目录下的使用，模拟数据结构  (vs-config.json) 

```
{ 
  // ftl模板起始路径
  "rootFm": "./public/ftl/",
  // 资源文件起始路径
  "rootRes": "./public",
  // 模拟模板对象集合
  "freeMarker": [
    {
      // 请求路径
      "url": "/",
      // 模板位置
      "path": "test1.ftl",
      // 模板渲染数据
      "data": {"name": "yf"}
    },
    {
      "url": "/list",
      "path": "test2.ftl",
      "data": {"name": "yf"}
    }
  ],
  // 模拟GET请求集合
  "GET": [
    {
      // 请求路劲
      "url": "/getList",
      // 输入参数（会验证参数数量）
      "input": {
        "limit": 10,
        "offset": 0
      },
      // 输出json
      "output": {
        "code": 200,
        "result": [],
        "total": 0
      }
    }
  ],
  // 模拟POST请求集合
  "POST": [
    {
      // 请求路劲
      "url": "/add",
      // 输入参数（会验证参数数量）
      "input": {
        "name": "yf"
      },
      // 输出json
      "output": {
        "code": 200,
        "result": [],
        "message": ""
      }
    }
  ]
}
```


