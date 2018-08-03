绩效系统前端代码，基于[dva2+umi](https://github.com/dvajs/dva/blob/master/README_zh-CN.md)框架

## 目录规范

```
.
├── src
│    ├── assets
│    │   ├── images
│    │   └── yay.jpg
│    ├── components
│    │   ├── DiscussForm
│    │   │   ├── DiscussForm.css
│    │   │   ├── DiscussForm.js
│    │   │   ├── InputReplay.js
│    │   │   ├── testData.json
│    │   │   └── testData2.json
│    │   ├── EventsFormSelect
│    │   │   ├── ItemShow.js
│    │   │   ├── SelectIntelligent.css
│    │   │   ├── SelectIntelligent.js
│    │   │   └── singleSelect.js
│    │   ├── Example.js
│    │   ├── FilterTable
│    │   │   ├── Filter.css
│    │   │   └── Filter.js
│    │   ├── SearchBar
│    │   │   ├── SearchBar.css
│    │   │   └── SearchBar.js
│    │   └── SelectIntelligent
│    │       ├── ItemShow.js
│    │       ├── SelectIntelligent.css
│    │       └── SelectIntelligent.js
│    ├── global.css
│    ├── layouts
│    │   ├── Header.js
│    │   ├── SiderBar.js
│    │   ├── index.css
│    │   ├── index.js
│    │   └── layouts.css
│    ├── models
│    ├── pages
│    │   ├── audit
│    │   ├── index.js
│    │   ├── manage
│    │   ├── myCredit
│    │   ├── personel
│    │   ├── search
│    │   └── submitEvent
│    ├── services
│    └── utils
│        ├── config.js
│        ├── dataChange.js
│        ├── mytool.js
│        ├── postRequest.js
│        └── request.js
├── .umirc.js
├── default.conf
├── Dockerfile
└── package.json
```

**说明**

-   `src` 项目代码目录
    -   `assets` 存放图片相关目录
    -   `layouts` 项目全局 layout 目录，包含 header
    -   `components` 公用组件目录
    -   `models` 公用组件定义 model
    -   `page` 各页面代码目录，包含私有 components，models，services
    -   `services` 公用组件 services
    -   `utils` 各种工具函数
        -   `config.js` 项目配置文件**(APID:dev 开发网关， APIP:product 生产网关)**
        -   `request.js` 项目请求工具，开发环境与生产环境暂时需要手动切换 api
    -   `global.css` 全局样式文件，antd 覆盖样式在此文件中进行代码覆盖
-   `.umirc.js` umi 配置文件，详细见[umi](https://umijs.org/guide/with-dva.html)
-   `default.conf` 线上 nginx 配置
-   `Dockerfile` Docker 配置
-   `package.json` 加入的包文件

## UI 组件

基于[antd](https://ant.design/docs/react/introduce-cn)，配置了全局主题色`#F18D55`。有时候需要自定义覆盖样式，可写在 src/global.css 中

## 通用组件&工具

## 配置

项目由[dva](https://github.com/dvajs/dva-cli)脚手架生成。

已配置项：

-   `theme` 用于覆盖 antd[默认样式](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)变量
    -   `primary-color` 主题色，`#F18D55`
-   `plugins`
    -   `umi-plugin-dva` umi

## 代码规范&eslint

[戳这里](eslint.md)

## 相关文档

-   [dva](https://github.com/dvajs/dva/blob/master/README_zh-CN.md)
-   [umi](https://umijs.org/guide/with-dva.html)
-   [dva2+umi](https://github.com/sorrycc/blog/issues/62)
-   [react](https://reactjs.org/docs/hello-world.html)
-   [react-router](https://react-guide.github.io/react-router-cn/)
-   [redux](https://cn.redux.js.org/)
-   [redux-saga](https://redux-saga-in-chinese.js.org/)
-   [antd](https://ant.design/docs/react/introduce-cn)
-   [roadhog](https://github.com/sorrycc/roadhog/blob/master/README_zh-cn.md)
