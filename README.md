# navigation

用于自定义域名跳转，无需服务器，一键搭建

可以任意域名跳转到任意链接

也可以让域名返回特定消息

一键部署：
[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Fhal-wang%2Fnavigation&branch=main)

## 配置

### 配置默认链接：

添加环境变量 `DEFAULT_URL`，值为默认链接

GET 请求找不到跳转目标时，会跳转到默认链接，否则返回 404

### 添加访问服务

添加想要跳转的域名至访问服务

### 添加跳转

云数据库中的 `navigation` 添加文档

```JSON
{
  "_id": "domain",
  "to": "to url",
  "type": 1,
  "code": "status code"
}
```

- \_id: 要跳转的域名，通过这个域名访问将会跳转请求
- to: 跳转目标，内容与 type 有关
- type: 类型
  - 0 域名跳转，to 是域名，会传递路由参数
  - 1 路径跳转，跳转到 to 指定的路径
  - 2 返回消息，结构为 `{"message":"to"}`
  - 3 返回消息，内容是 to
- code: 跳转的状态码

  - type 为 1，2 时，状态码应为 `30x`

## 二次开发

如果现有功能不能满足，你可以进行二次开发

### 本地运行

在项目下创建文件 `.env.local`，内容如下

```
ENV_ID=cloudbase环境id
SECRET_KEY=腾讯云 secret key
SECRET_ID=腾讯云 secret id
DEFAULT_URL=默认跳转链接
```

安装依赖，在项目下执行

```sh
yarn install
```

再使用 vscode 打开项目，直接 F5 开始调试

或在项目下执行

```sh
yarn dev
```

### 发布

可以本地使用 `@cloudbase/cli` 发布，也可以使用 GitHub Actions 持续集成

#### cli 发布

确保项目根目录下有文件 `.env.local`，内容包含

```
ENV_ID=cloudbase环境id
DEFAULT_URL=默认链接
```

在项目根目录下运行以下命令发布

```sh
yarn deploy
```

#### GitHub Actions

仓库增加 Secrets，在 `Settings -> Secrets -> Actions`，点击 `New repository secret` 按钮

增加如下记录

- TENCENT_SECRET_ID: 腾讯云 secret id
- TENCENT_SECRET_KEY: 腾讯云 secret key
- ENV: 与 `cli 发布` 的 `.env.local` 文件内容相同

配置完成后，每次 main 分支提交代码就会自动发布到 CloudBase

发布进度可在仓库 `Actions` 中看到
