# 漏洞演示應用程式 | Vulnerable Web Application

⚠️ **警告 | WARNING**: 這是一個包含故意安全漏洞的演示應用程式，**僅供教育用途**！請勿部署到生產環境！

This application contains **intentional security vulnerabilities** for **educational purposes only**! DO NOT deploy to production!

## 📋 專案簡介 | Project Overview

這個 Web 應用程式展示了常見的安全漏洞，幫助開發人員學習和理解各種安全威脅。

This web application demonstrates common security vulnerabilities to help developers learn and understand various security threats.

## 🎯 包含的漏洞 | Included Vulnerabilities

### 1. 💉 SQL 注入 (SQL Injection)
- **位置**: 登入功能 (`/login`) 和搜尋功能 (`/search`)
- **描述**: 直接將用戶輸入拼接到 SQL 查詢中，允許攻擊者執行任意 SQL 命令
- **演示**:
  ```
  Username: admin' OR '1'='1
  Password: anything
  ```
  或
  ```
  Search: ' UNION SELECT username, password, email FROM users --
  ```

### 2. 🔓 跨站腳本攻擊 (Cross-Site Scripting - XSS)
- **位置**: 評論功能 (`/comment`)
- **描述**: 不過濾用戶輸入，允許注入惡意 JavaScript 代碼
- **演示**:
  ```html
  <script>alert('XSS Attack!')</script>
  <img src=x onerror="alert('XSS')">
  ```

### 3. ⚡ 命令注入 (Command Injection)
- **位置**: Ping 功能 (`/ping`)
- **描述**: 直接執行用戶輸入的系統命令
- **演示**:
  ```
  127.0.0.1; ls -la
  127.0.0.1 && cat /etc/passwd
  127.0.0.1 | whoami
  ```

### 4. 📁 路徑遍歷 (Path Traversal)
- **位置**: 文件讀取功能 (`/file`)
- **描述**: 沒有驗證文件路徑，允許讀取系統中的任意文件
- **演示**:
  ```
  filename=../server.js
  filename=../../package.json
  filename=../../../etc/passwd
  ```

### 5. 🔑 不安全的直接對象引用 (Insecure Direct Object Reference - IDOR)
- **位置**: 用戶資料端點 (`/user/:id`)
- **描述**: 沒有授權檢查，可以訪問任何用戶的敏感信息
- **演示**: 訪問 `/user/1`, `/user/2`, `/user/3` 可獲得所有用戶資料

### 6. 🚪 缺少身份驗證 (Missing Authentication)
- **位置**: 管理員面板 (`/admin`)
- **描述**: 敏感頁面沒有任何身份驗證機制
- **演示**: 直接訪問 `/admin` 即可看到所有 API 金鑰和密碼

### 7. 💻 代碼注入 (Code Injection)
- **位置**: 計算器功能 (`/calculate`)
- **描述**: 使用 `eval()` 執行用戶輸入，允許執行任意 JavaScript 代碼
- **演示**:
  ```javascript
  process.version
  require('fs').readdirSync('.')
  ```

### 8. 🔐 硬編碼憑證 (Hardcoded Credentials)
- **位置**: `server.js` 源代碼
- **描述**: 代碼中包含硬編碼的 API 金鑰、密碼、AWS 憑證等敏感信息
- **包含**:
  - API Keys
  - Database Passwords
  - Secret Tokens
  - AWS Access Keys
  - AWS Secret Keys

### 9. 💾 敏感數據暴露 (Sensitive Data Exposure)
- **位置**: 多個端點
- **描述**: 在響應中暴露敏感信息，如信用卡號、密碼、密鑰等
- **演示**: 登入成功後會顯示信用卡號和所有憑證

### 10. 📦 使用存在已知漏洞的組件 (Using Components with Known Vulnerabilities)
- **位置**: `package.json`
- **描述**: 使用已知存在安全漏洞的過時依賴項
- **包含的易受攻擊依賴項**:
  - `lodash 4.17.15` - Prototype Pollution
  - `minimist 1.2.5` - Prototype Pollution
  - `ejs 2.7.4` - Template Injection
  - 其他過時版本的依賴項

## 🚀 安裝和運行 | Installation and Running

### 前置要求 | Prerequisites
- Node.js (v12 或更高版本)
- npm

### 安裝步驟 | Installation Steps

1. 克隆倉庫 | Clone the repository:
```bash
git clone <repository-url>
cd understanding-coding-agent
```

2. 安裝依賴項 | Install dependencies:
```bash
npm install
```

3. 啟動應用程式 | Start the application:
```bash
npm start
```

4. 在瀏覽器中訪問 | Open in browser:
```
http://localhost:3000
```

## 🧪 測試漏洞 | Testing Vulnerabilities

### 檢查依賴項漏洞 | Check Dependency Vulnerabilities
```bash
npm audit
```

這會顯示所有已知的依賴項漏洞。

### 手動測試 | Manual Testing
啟動應用程式後，訪問主頁面，可以看到所有漏洞的演示界面和利用方法。

## 📚 學習資源 | Learning Resources

### OWASP Top 10
此應用程式涵蓋了 OWASP Top 10 中的多個類別：
- A01:2021 – Broken Access Control (缺少身份驗證、IDOR)
- A02:2021 – Cryptographic Failures (敏感數據暴露、硬編碼憑證)
- A03:2021 – Injection (SQL 注入、命令注入、代碼注入、XSS)
- A05:2021 – Security Misconfiguration (缺少安全配置)
- A06:2021 – Vulnerable and Outdated Components (易受攻擊的依賴項)
- A08:2021 – Software and Data Integrity Failures (代碼注入)

### 安全編碼最佳實踐 | Secure Coding Best Practices

#### 防止 SQL 注入 | Prevent SQL Injection
✅ 使用參數化查詢或 ORM
```javascript
db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
```

#### 防止 XSS | Prevent XSS
✅ 對用戶輸入進行編碼和清理
```javascript
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(userInput);
```

#### 防止命令注入 | Prevent Command Injection
✅ 避免使用 shell 命令，使用庫函數代替
```javascript
// 不要使用 exec()
// 使用專用的庫，如 node-ping
```

#### 防止路徑遍歷 | Prevent Path Traversal
✅ 驗證和規範化文件路徑
```javascript
const safePath = path.normalize(userInput).replace(/^(\.\.(\/|\\|$))+/, '');
```

#### 使用環境變數存儲敏感信息 | Use Environment Variables
✅ 使用環境變數而不是硬編碼
```javascript
const API_KEY = process.env.API_KEY;
```

#### 保持依賴項更新 | Keep Dependencies Updated
✅ 定期更新依賴項
```bash
npm update
npm audit fix
```

## ⚠️ 免責聲明 | Disclaimer

此應用程式僅用於教育目的。作者不對因使用此代碼而造成的任何損害負責。請勿在生產環境中使用此應用程式或其代碼。

This application is for educational purposes only. The author is not responsible for any damage caused by the use of this code. Do not use this application or its code in production environments.

## 📄 授權 | License

MIT License - 僅供教育用途 | For educational purposes only