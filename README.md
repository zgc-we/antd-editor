# 一个 可视化实时渲染的 ant-design 页面搭建工具

> 此项目是上古项目，代码基本很难维护，现在发布出来仅供参考思路，感兴趣的可以根据原理重构一版，实现一个更完备的可视化编辑

> 友情提醒：不建议在团队内投入大量精力做类似的事情（企图一步到位改变开发现状），与行业里用 AI 切页面类似，尽量作为玩具把玩一下即可。

## 线上实例

https://xinyu198736.github.io/antd-visual-editor/index.html

托管在 github，第一次加载会比较慢

截图：

![](https://img.souche.com/0a3a88462435f20952346980e3ee4df5.png)

## 运行

```bash
npm run build;
npm run start;
# （已修复）因为我不太懂 webpack ，不太会配置，这个项目修改代码后实时生效还有问题。。求 pr
```

## 特性

* 可视化编辑，同时实时生成结果代码，还可以单独预览
* 丰富的数据编辑能力，可以编辑组件的二维属性
* 组件可嵌套
* 自适应布局
* 除了 antd 的组件，还有一些原生 html 元素可使用

## 原理解析

### 1.如何实现实时编辑

第一步，抽象整个可视化工作台的数据表达，无非是放了一个什么组件在什么位置，这个组件的父组件是谁，这个组件的属性是什么

如下图：

![](https://img.souche.com/c1c1605094e3a8bcaa1118ce00f8fcc3.png)

一个组件的基础定义：

```
title 组件名
type  组件类型（组件真实类名）
can_place 组件是否可以包含子组件
children 组件的子组件，数组类型
is_native 组件是否是原生 html 元素
config  组件可用的配置信息
props 组件配置信息的值，包含样式和属性等
```

根据这些值，我们就可以渲染和编辑组件了，编辑组件后，
会有一个大的表示画布当前状态的数据结构存储到 state 中，
另外，有一个方法可以根据这个数据结构渲染出整个画布，
所以每次有任何编辑动作之后，我们会触发 forceUpdate，重新绘制画布
也就是说，添加组件，编辑属性，和画布的显示是分离的，中间由一个大的数据结构连接（就是图片里这个）

### 2.如何反向生成 react 代码

根据上图中的数据结构，反向遍历，可轻易的生成 React 代码

### 3.如何定义组件可用的配置

在 pages/coms/xxx 里面定义一个组件的可用配置，然后即可在主界面中选择组件后在右侧"属性编辑区"中编辑属性。

来看看我们可以定义哪些属性吧

以一个按钮为例

```javascript
export default {
    "type": "Button",
    "title": "按钮",
    "props": {
        type: 'primary',  // 定义可以配置的 props
        content: '按钮一只', // 定义可以配置的 props
        style: {  // 定义可以配置的样式
            margin: "0px 10px 0px 0px"
        }
    },
    config: {   // 可用的配置项
        type: {   // type 这个配置的描述
            text: "主题",  // 配置的标题
            enum: [       // 可用的枚举，配置时会显示成下拉框
                'primary',
                'default',
                'dashed',
                'danger'
            ]
        },
        icon: {
            text: "图标",
        },
        content: {
            text: '文案',
        },
        style: {  // 可用的样式配置
            width: {  
                text: "宽度",
            },
            margin: {
                text: "外边距",
                type: "4-value" // 一种定制类型，会渲染成 4 个输入框
            }
        }
    },
}
```

这是最基本的配置项，只能适用于最基本的组件，但是遇到像 table 或者 Breadcrumb 这种组件就不行了

### 4.高级配置（二维数据）

以 Breadcrumb 为例，他有一个数据源的属性，数据源是一个数组+对象的混合表达，这种组件不少，应该如何定义呢

```javascript
export default {
  "type":"Breadcrumb",
  "title":"面包屑",
  props:{
      routes:[  // 这里是数据源的属性，和默认值
      {
          breadcrumbName:"一级目录",
          path:"#",
        key:1
      },
      {
          breadcrumbName:"二级目录",
          path:"#",
        key:2
      }
    ]
  },
  config:{
      routes:{   // 如何表达这个属性应该如何配置
          text:"项目配置",
          enumobject:[{  // 一种新的类型，enumobject，对象枚举
            key:1,  
            dataIndex:"breadcrumbName",  // 枚举的对象的第一个 key 是什么
            title:"显示文本",    // 枚举的对象的第一个 key 的文本描述
            type:'String',      // 枚举的对象的第一个 key 的类型
          },{
            key:2,
            dataIndex:"path",    // 枚举的对象的第二个 key 是什么
            title:"链接",        // 枚举的对象的第二个 key 的文本描述
            type:'String',      //枚举的对象的第二个 key 的类型
          }]
    }
  }
}
```

最终的属性编辑区：

![](https://img.souche.com/397b944593c4506a2085955fffee09d7.png)

即可边界对象枚举属性

### 5.更复杂的组件

大家会发现，table 这种组件和上述的组件都不太一样，首先看纯数据表格

![](https://img.souche.com/6c17078da4321e4e2738941718fe17d8.png)

其实这里还好，只是 table 有两个属性，一个表达列的数据，一个表达行的数据，我们只需要两个对象枚举即可

```javascript
{
    config:{
        columns:{
          text:"列管理",
          enumobject:[
            {
              title: '列文本',
              dataIndex: 'title',
              type:"String"
            },
            {
              title: '列key',
              dataIndex: 'dataIndex',
              type:"String"
            }
          ]
        },
        dataSource:{
          text:"值管理",
          enumobject:{
            type:'relative_props_object',
            target:'columns'
          }
        }
    }
}
```

这里实现了一个 关联，可以把 dataSource 的配置和 columns 关联起来 (relative_props_object)

### 6.更更复杂的表格

如果只是数据，还好，
但是 table 里可以还可以嵌套其他组件，每行每列，想想是不是头疼。。如下图

![](https://img.souche.com/d201501fd416b798678a6d9f4ca44b6e.png)

table 的每个 column 其实可以定义内部显示的元素，我们在默认值里就给他塞一个空的 layout 进去，
这样之后这里就会变成一个可以放置其他子元素的坑，具体不展开了，这里的逻辑比较复杂。


