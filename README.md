# @kcs-community/browser-api-signer

> [!IMPORTANT]
> License:UNLICENSED（本项目为组织私有，不对外公开）

用于浏览器端生成符合 KCS-Community 后端签名规则的 API 请求签名。

本包实现了基于 HMAC-SHA256 的签名算法，匹配 ASP.NET 后端的签名校验逻辑，适用于前端请求认证、重放攻击防护。

---

## 安装 Installation

通过 GitHub Packages 安装（需组织授权）：

```bash
npm install @kcs-community/browser-api-signer
```
在 .npmrc 中添加：
```
@kcs-community:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=your_github_token_here
```

---

## 签名规则说明

生成签名的原始字符串格式如下：
```
METHOD + PATH?SORTED_QUERY + TIMESTAMP + NONCE + BASE64_SHA256_CANONICAL_JSON
```
最终签名方式：
```
signature = BASE64(HMAC_SHA256(secret, rawData))
```
其中：

| 字段      | 示例              | 说明                                 |
|-----------|-------------------|--------------------------------------|
| METHOD    | POST              | 请求方法（大写）                     |
| PATH      | /api/resource     | 请求路径                             |
| QUERY     | ?a=1&b=2（升序编码） | query string，已排序编码             |
| TIMESTAMP | Unix时间戳        | 秒级时间戳，用于时效校验             |
| NONCE     | 随机字符串        | 防重放攻击                           |
| BODY      | JSON字符串        | Canonical 化后 SHA256 → Base64     |


---

## 使用示例
```javascript
import { generateSignature } from '@kcs-community/browser-api-signer';

const signature = await generateSignature({
  method: 'POST',
  urlPath: '/api/comment/submit',
  query: { sort: 'desc', page: '1' },
  timestamp: Math.floor(Date.now() / 1000).toString(),
  nonce: 'abc123xyz456',
  body: JSON.stringify({ content: 'hello world' }),
  secret: 'your-api-secret'
});

console.log('X-Signature:', signature);
```

发送请求时，需附带头部字段：

```
X-ApiKey: your-access-key
X-Timestamp: 1723456789
X-Nonce: abc123xyz456
X-Signature: （上述生成的签名）
```

> [!CAUTION]
> **ApiSecret 只应用于公开请求签名，不应暴露敏感用户密钥。**

> [!CAUTION] 
> **建议使用短时有效的 timestamp + nonce 并配合服务端缓存校验防重放。**

> [!CAUTION] 
> **不建议将此包用于 Node.js 环境，建议使用 Node 原生 crypto 实现服务端签名逻辑。**