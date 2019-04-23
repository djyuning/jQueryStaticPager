# jQuery Static Pager

![ ](https://img.shields.io/badge/node.js-v8.12.0-brightgreen.svg)
![ ](https://img.shields.io/badge/npm-v6.4.1-brightgreen.svg)
![ ](https://img.shields.io/badge/gulp-v4.0.0-orange.svg)
![ ](https://img.shields.io/badge/jQuery-0769ad.svg)

> 基于 jQuery 的静态数据分页插件

## 用法

[演示地址](https://codepen.io/djyuning/full/dLqyEX)

本插件依赖于 [jQuery 1.8+](https://github.com/jquery/jquery/releases?after=1.8.3%2B1)，在引用本插件前，请确保 jQuery 已正确引入。


```html
<div class="body"><!-- 在此渲染数据 --></div>
<div class="pager"><!-- 在此渲染分页，pager 选择器不可更改 --></div>

<!-- 引入 CSS 样式 -->
<link rel="stylesheet" href="jquery.pager.min.css" />

<!-- 引入脚本 -->
<script src="jquery.min.js"></script>
<script src="jquery.pager.min.js"></script>

<script>
  $(function () {
    // 新建一个变量存储数据
    var lists = [];

    // 新建一个函数用于渲染列表
    function render(page, options, pager) {
      if (lists.length === 0) return;

      // 每次从实际分页减去 1，得到初始偏移量
      page -= 1;

      // 偏移量 * 每页数据条数得到截取的开始位置
      var _start = page * options.size;

      // 数组截取
      var _rows = lists.slice(_start, _start + options.size);

      // 测试
      console.log('本页数据：', _rows);

    };

    // 初始化获取数据并调用插件
    $.ajax({
      method: 'GET',
      url: './data.json',
      success: function (res) {
        // 缓存数据
        lists = res.data;

        // 调用插件
        $('.pager').pager({
          total: lists.length,
          onChange: render
        });

      }
    });

  });
</script>
```

## 配置参数

### current

指定显示的页码，正整数。插件调用成功后会自动切换到该页。默认为 `1`，页码不能小于 1，不能大于最大页数。

### total

**必须**参数，数据总条数，正整数，默认为 `0`。

### size

每页显示数据条数，正整数，默认为 `10`。

### span

可查看的页数，正整数，默认为 `10`。`lite` 模式下无效。

### mode

主题样式，`default` 默认样式，`simple` 简约样式、`lite` 极简样式。

### lang

语言配置，以对象的形式传入。具体内容如下：

```json
{
  "first": "首页",
  "prev": "上一页",
  "next": "下一页",
  "end": "最后一页",
  "hover": "第 %page% 页",
  "total": "共 %pageTotal% 页 / %total% 条",
  "pump": "转到第 %d% 页",
  "ellipsisPrev": "前 %d% 页",
  "ellipsisNext": "后 %d% 页"
}
```

### keyboard

是否使用左右方向键键切换页码，默认为 `true`。

### showTotal

是否显示统计信息，默认为 `true`。

### showElevator

是否显示下拉表单，下拉表单可快速选择页码，默认为 `true`。

### onCreated

分页创建完成时执行的回调函数，支持一个参数：`pager` 实例。

### onChange

分页选择时执行的回调函数，支持参数分别是：`page` 当前页码、`options` 实例的配置项、`pager` 实例。

## 开发

本工程基于 [Node.js](https://nodejs.org/en/) 8.12.0 开发，构建时请确保本机已安装 8.12.0 或更高版本的 Node.js。

```bash
# 环境检测
$ node -v

# 安装构建依赖
$ npm install

# 构建为可部署的代码
$ npm run build
```

## 关于

Copyright &copy; 2019 tPeriod Tech
