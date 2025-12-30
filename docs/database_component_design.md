# 基于 DonkJS 的强入侵式数据库组件设计：支持多区架构的实现

## 引言

在实时服务器开发中，数据库的设计和管理是核心部分。DonkJS 的数据库组件采用了强入侵式设计，要求服务器必须配置三个数据库：`global`、`server` 和 `zone`，其中 `zone` 支持多个实例。这种设计使得服务器天然支持分区架构，适合高并发和多区场景。

---

## 数据库组件设计概述

DonkJS 的数据库组件通过 `MongoComponent` 实现，负责管理数据库连接和模型注册。组件的强入侵式设计确保了以下特性：

1. **全局数据库（`global`）**：存储全局配置和数据。
2. **服务器数据库（`server`）**：存储与当前服务器实例相关的数据。
3. **分区数据库（`zone`）**：支持多个分区，每个分区独立存储数据。

这种设计使得服务器能够轻松扩展分区，适应不同的业务需求。

---

## 数据库配置

数据库配置文件位于 `src/sysconfig/development/db_config.json`，定义了 `global`、`server` 和 `zone` 的连接信息。

示例配置：

```json
{
  "db_global": {
    "host": "192.168.101.108",
    "port": 27017,
    "db": "global_db"
  },
  "db_server": {
    "front_1": {
      "host": "192.168.101.108",
      "port": 27017,
      "db": "server_1"
    },
    "front_2": {
      "host": "192.168.101.108",
      "port": 27017,
      "db": "server_2"
    }
  },
  "db_zones": {
    "zone1": {
      "host": "192.168.101.108",
      "port": 27017,
      "db": "zone_1"
    },
    "zone2": {
      "host": "192.168.101.108",
      "port": 27017,
      "db": "zone_2"
    }
  }
}
```

---

## `MongoComponent` 的实现

`MongoComponent` 是数据库管理的核心组件，负责初始化和管理数据库连接。

### 1. **全局数据库连接**

全局数据库用于存储服务器的全局配置和数据。`MongoComponent` 会在启动时初始化连接：

```typescript
if (sysCfgComp.db_global) {
  await this.initDbConnection(sysCfgComp.db_global, initializeGlobalModel);
  logger.debug("Global database initialized");
}
```

### 2. **服务器数据库连接**

服务器数据库存储与当前服务器实例相关的数据。通过服务器 ID 获取对应的数据库配置：

```typescript
const serverCfg = sysCfgComp.db_server_map.get(server);
assert(
  serverCfg !== undefined,
  `Server config not found for serverId: ${server}`
);
await this.initDbConnection(serverCfg, initializeServerModel);
logger.debug("Server database initialized");
```

### 3. **分区数据库连接**

分区数据库支持多个实例，每个分区独立存储数据。`MongoComponent` 会遍历所有分区并初始化连接：

```typescript
const zoneList = sysCfgComp.server.zoneIdList;
for (const zone of zoneList) {
  const zoneCfg = sysCfgComp.db_server_map.get(server);
  assert(zoneCfg !== undefined, `Server config not found for zone: ${zone}`);
  await this.initDbZoneConnection(zoneCfg, zone, initializeZoneModel);
  logger.debug(`Zone database initialized for ${zone}`);
}
```

### 4. **连接管理**

`MongoComponent` 提供了通用的数据库连接方法，支持连接成功、错误和断开事件的处理：

```typescript
initDbConnection(dbConfig: DBCfg, callback: Function): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.db}`;
    const connection = mongoose.createConnection(url);

    connection.on("connected", () => {
      const result = callback(connection);
      resolve(result);
      logger.debug("Database initialized", dbConfig);
    });

    connection.on("error", (error: Error) => {
      logger.error("Connection error:", error);
      reject(error);
    });

    connection.on("disconnected", () => {
      logger.debug("Connection disconnected");
    });
  });
}
```

---

## 天然支持分区架构

由于 `zone` 数据库支持多个实例，DonkJS 的服务器天然支持分区架构。每个分区的数据独立存储，互不干扰，适合以下场景：

- **游戏分区**：不同分区的玩家数据独立存储。
- **业务隔离**：不同业务模块的数据分开管理。

分区架构的优势：

1. **高扩展性**：可以根据业务需求动态增加分区。
2. **高可靠性**：单个分区的故障不会影响其他分区。
3. **高性能**：分区间的数据隔离减少了数据库的竞争。

---

## 示例：初始化数据库组件

以下是服务器启动时初始化数据库组件的完整流程：

```typescript
const mongoComponent = new MongoComponent();
await mongoComponent.start();
```

在 `MongoComponent` 的 `start` 方法中，依次初始化全局数据库、服务器数据库和分区数据库：

```typescript
async start() {
  const sysCfgComp = ComponentManager.instance.getComponent(EComName.SysCfgComponent);

  // 初始化全局数据库
  if (sysCfgComp.db_global) {
    await this.initDbConnection(sysCfgComp.db_global, initializeGlobalModel);
  }

  // 初始化服务器数据库
  const serverCfg = sysCfgComp.db_server_map.get(server);
  await this.initDbConnection(serverCfg, initializeServerModel);

  // 初始化分区数据库
  const zoneList = sysCfgComp.server.zoneIdList;
  for (const zone of zoneList) {
    const zoneCfg = sysCfgComp.db_server_map.get(server);
    await this.initDbZoneConnection(zoneCfg, zone, initializeZoneModel);
  }
}
```

---

## 总结

DonkJS 的数据库组件通过强入侵式设计，确保了全局、服务器和分区数据库的统一管理。分区架构的天然支持使得服务器能够轻松扩展，适应高并发和多区场景。

未来的优化方向包括：

- 增加对其他数据库（如 Redis）的支持。
- 提供动态分区管理功能，支持分区的动态添加和移除。

希望本文能为实时服务器的数据库设计提供一些启发！
