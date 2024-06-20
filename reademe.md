### MongoDB

########### 1. 网上下载压缩安装包。 点进解压的文件夹里面，可以看见有个 bin 目录 , 在这里新建一个名为 data 的文件夹,创建好之后，进入 bin 目录，shift+右键，在此处打开 Windows PowerShell，输入命令 mongod --dbpath=..\data\db，这里 dbpath 是指存放数据的文件夹，用刚刚新建的 data/db 2.先按上文的方法启动本地的 MongoDB，不要关掉 PowerShell，在 bin 目录中再打开一个新的 PowerShell，通过 27017 端口来连接本地启动的 MongoDB 服务，输入命令 mongo
或 mongo --host=127.0.0.1 --port=27017

#### mongodump 备份数据库

########### 终端运行命令： `mongodump -h IP --port 端口 -u 用户名 -p 密码 -d 数据库 -o 文件存在路径 `
########### 注意：没设置用户名密码，可以去掉 -u -p, 不是 mongo 终端
mongodump -h 127.0.0.1 --port 27017 -d myPet -o 文件存在路径

#### mongorestore 还原数据库

########### 终端运行命令： `mongorestore -h IP --port 端口 -u 用户名 -p 密码 -d 数据库 --drop 文件存在路径`
########### 注意：没设置用户名密码，可以去掉 -u -p, 不是 mongo 终端; 数据库备份文件路径 koa/db-backups/myPet
mongorestore -h 127.0.0.1 --port 27017 -d myPet -o E:\kanggen\pet\koa\myPet\myPet

#### 程序目录

koa
├─ .env // 环境配置
├─ .gitignore
├─ .vscode
│ └─ launch.json
├─ package.json // 依赖包
├─ public // 服务器静态目录
│ └─ upload // 上传文件目录
│ └─ 0a14a06e5da3b341a34279000.jpg
├─ reademe.md
├─ db-backups // 数据库备份目录
│ └─ myPet // 数据库文件
└─ src // 程序目录
├─ app // 创建服务
│ ├─ errHandler.js
│ ├─ index.js
│ └─ succHandler.js
├─ config // 部分配置
│ └─ config.default.js
├─ constant // 响应配置
│ ├─ errType.js
│ └─ succType.js
├─ controller // 控制器文件
│ ├─ article.js
│ ├─ banner.js
│ ├─ upload.js
│ └─ user.js
├─ db // 连接数据库
│ └─ index.js
├─ index.html
├─ main.js // 程序主入口
├─ middleware // // 中间件文件
│ ├─ authMiddleware.js
│ ├─ uploadMIddleware.js
│ ├─ userMiddleware.js
│ ├─ validateMiddleware.js
│ └─ ws.js
├─ model // 模型文件
│ ├─ articleModel.js
│ ├─ banner.js
│ ├─ comment.js
│ ├─ favorite.js
│ ├─ groupMember.js
│ ├─ like.js
│ ├─ message.js
│ ├─ offlineMessag.js
│ ├─ uploadModel.js
│ ├─ userModel.js
│ └─ userWebSocket.js
├─ router // 路由文件
│ ├─ article.js
│ ├─ banner.js
│ ├─ index.js
│ ├─ public.js
│ ├─ upload.js
│ ├─ user.js
│ └─ webdscoket.js
├─ service // 服务文件
│ ├─ articleServer.js
│ ├─ banner.js
│ ├─ userServer.js
│ └─ wsServer.js
├─ validateParamsRules // 参数校验规则
│ └─ index.js
└─ websocket // socket 文件
└─ io.js

#### 程序开始

1.前置条件： 安装 node.js 环境， 安装 mongodb 数据库，

#### 项目运行

1. 安装依赖包： npm install 2. 启动项目： npm run serve 3. 访问地址： http://localhost:5000 4. 数据库地址： mongodb://127.0.0.1:27017/myPet 5. 数据库用户名密码： 无
2. 运行成功。控制台输出 ： 数据库链接成功 wsServer server in running 5000

#### 项目打包
