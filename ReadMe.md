# DonkJS

一个基于 Node.js 和 TypeScript 的实时服务器框架，使用 TSRPC 进行通信，提供 WebSocket 服务和组件化架构。

## 功能特性

- 🚀 **高性能**：基于 Node.js 事件驱动模型，支持高并发连接
- 📡 **实时通信**：内置 WebSocket 游戏服务器，支持低延迟数据传输
- 🔧 **组件化架构**：基于组件的模块化设计，便于扩展和维护
- 📚 **类型安全**：使用 TypeScript 提供完整的类型检查
- 📊 **API 文档**：自动生成 Swagger UI 文档，便于接口调试
- 📝 **日志系统**：基于 log4js 的灵活日志配置，支持多格式输出
- 🚦 **进程管理**：使用 PM2 进行进程管理和自动重启
- 💾 **数据持久化**：支持多种数据库连接（可扩展）

## 技术栈

- **后端框架**: Node.js + TypeScript
- **通信框架**: TSRPC
- **WebSocket 服务**: 内置 WebSocket 游戏服务器
- **日志系统**: log4js
- **进程管理**: PM2
- **组件化架构**: 基于组件的服务器架构
- **API 文档**: Swagger UI
- **依赖管理**: npm

## 环境要求

- Node.js: 16.x 或更高版本
- npm: 8.x 或更高版本
- Windows 7/10/11（当前开发环境）

## 安装步骤

1. **克隆项目**

```bash
git clone [<项目仓库地址>](https://github.com/lyh1091106900/donkjs.git)
cd donkjs
```

2. **安装依赖**

```bash
npm install
```

3. **编译项目**

```bash
npm run build
```

## 快速开始

### 开发环境 && 生产环境

使用 PM2 启动服务：

```bash
# 构建项目
npm run build

# 使用 PM2 启动
pm2 start pm2_config.json

# 查看服务状态
pm2 list

# 查看日志
pm2 logs
```

## 项目结构

├── src/ # 源代码目录 │ ├── common/ # 通用组件和工具 │ │ ├── BaseComponent.js # 组件基类 │ │ ├── WebsocketGameServer.js # WebSocket 服务器实现 │ │ └── ... │ ├── component/ # 业务组件 │ │ ├── EventComponent.js # 事件组件 │ │ ├── GlobalVarComponent.js # 全局变量组件 │ │ └── ... │ ├── shared/ # 共享类型定义和协议 │ ├── util/ # 工具类 │ │ ├── logger.js # 日志工具 │ │ ├── tool.js # 通用工具 │ │ └── ... │ ├── sysconfig/ # 系统配置文件 │ │ └── development/ # 开发环境配置 │ └── front.js # 前端服务器入口 ├── dist/ # 编译后目录 ├── docs/ # 文档目录 ├── logs/ # 日志目录 ├── node_modules/ # 依赖包 ├── package.json # 项目配置 ├── tsconfig.json # TypeScript 配置 ├── pm2_config.json # PM2 配置 └── README.md # 项目说明

## 配置说明

### 系统配置

配置文件位于 `src/sysconfig/` 目录下，根据环境分为不同子目录：

- `development/`: 开发环境配置
- `production/`: 生产环境配置

主要配置文件包括：

- `log_config.json`: 日志系统配置
- `db_config.json`: 数据库配置
- `server_auth_config.json`: 服务器认证配置
- `zone_config.json`: 区域配置

### PM2 配置

PM2 配置文件为 `pm2_config.json`，定义了应用的启动参数：

```json
{
  "apps": [
    {
      "name": "front_1",
      "script": "front.js",
      "cwd": "./dist",
      "env": {
        "id": "1",
        "internalIP": "127.0.0.1",
        "gameType": "donk",
        "port": "41001",
        "httpPort": "41003",
        "environment": "development"
      },
      "node_args": "--inspect=41002",
      "windowsHide": false
    }
  ]
}
```

## 开发指南

### 组件开发

1. 创建组件类，继承自 `BaseComponent`
2. 实现 `init()`、`start()` 和 `stop()` 方法
3. 在 `front.ts` 中注册和启动组件

### 添加 API 接口

1. 在 `shared/` 目录下定义接口类型
2. 使用 TSRPC CLI 生成接口代码
3. 实现接口处理逻辑

### 日志使用

```javascript
import { gameLogger, serverLogger } from "./util/logger";

// 游戏日志
gameLogger.log("游戏信息");
gameLogger.error("游戏错误");

// 服务器日志
serverLogger.info("服务器信息");
serverLogger.warn("服务器警告");
```

## 部署说明

### Windows 环境

1. 确保已安装 Node.js 和 npm
2. 安装 PM2 全局依赖：`npm install -g pm2`
3. 构建项目：`npm run build`
4. 使用 PM2 启动：`pm2 start pm2_config.json`
5. 设置 PM2 开机自启：`pm2 startup windows`

### 监控和维护

```bash
# 查看应用列表
pm2 list

# 查看实时日志
pm2 logs

# 重启应用
pm2 restart <app_name>

# 停止应用
pm2 stop <app_name>

# 移除应用
pm2 delete <app_name>

# 查看应用详情
pm2 show <app_name>
```

## API 文档

项目启动后，可以通过以下地址访问 Swagger UI 文档：
http://localhost:39999/api-docs

## 故障排除

### 常见问题

1. **端口被占用**：

   - 修改 `pm2_config.json` 中的端口配置
   - 或关闭占用端口的进程

2. **配置文件未加载**：

   - 确保配置文件路径正确
   - 检查环境变量 `NODE_ENV` 是否设置正确

3. **日志文件不生成**：
   - 检查 `log_config.json` 配置
   - 确保日志目录存在且有写入权限

## 贡献规范

1. 代码风格遵循 TypeScript 官方推荐规范
2. 提交代码前请运行 `npm run build` 确保编译通过
3. 提交信息使用清晰的描述，如：`feat: 添加新功能`、`fix: 修复 bug`
4. 大型功能变更请先创建 issue 讨论

## 许可证

MIT License
