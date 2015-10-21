virtualServer-freemarker适用于项目成立初期，数据结构尚未明确，并且通过freemarker渲染页面的工程。

作用：1.方便定义可视化数据结构；2.服务未到位情况下模拟数据交互（附有简单参数验证）3.不依赖java工程便可本地实施开发

使用：

请先参照test目录下的使用方法

模拟数据结构

```
{
  "root": "./public",
  "freeMarker": [
    {
      "url": "/",
      "path": "ftl/test1.ftl",
      "data": {"name": "yf"}
    },
    {
      "url": "/list",
      "path": "ftl/test2.ftl",
      "data": {"name": "yf"}
    }
  ],
  "GET": [
    {
      "url": "/getList",
      "input": {
        "limit": 10,
        "offset": 0
      },
      "output": {
        "code": 200,
        "result": [],
        "total": 0
      }
    }
  ],
  "POST": [
    {
      "url": "/add",
      "input": {
        "name": "yf"
      },
      "output": {
        "code": 200,
        "result": [],
        "message": ""
      }
    }
  ]
}
```


