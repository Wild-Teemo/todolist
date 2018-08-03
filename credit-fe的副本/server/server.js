const express = require('express');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT;
const API_HOST = process.env.API_HOST;

let port = 8080;
let apiHost = 'http://172.20.110.42:10000';

if (PORT) {
    port = parseInt(PORT);
    console.log('从环境变量获取到启动端口:', port);
}

if (API_HOST) {
    apiHost = API_HOST;
    console.log('从环境变量获取到API HOST:', apiHost);
} else {
    console.log('没有获取到API HOST, 采用默认:', apiHost);
}

//静态文件处理, HTTP对/static的请求都映射到相对目录的 /dist/static
app.use('/static', express.static('dist/static'));

//mock首页, 将index.html读取到内存, 根据环境变量添加API HOST
app.get('/*', (req, res) => {
    fs.readFile('dist/index.html', 'utf8', (err, data) => {
        let prefix = '<body><script>var API_HOST=\'' + apiHost + '\';</script>';
        data = data.replace('<body>', prefix);
        res.header('content-type', 'text/html');
        res.write(data);
        res.end();
    });
});

app.listen(port, () => {
    console.log('服务器已启动');
});
