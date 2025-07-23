# Ant Design 颜色生成器

🎨 基于 Ant Design Colors 官方算法的可视化颜色生成器，帮助设计师和开发者快速生成符合 Ant Design 规范的10色梯度调色板。

## ✨ 功能特性

- 🎯 **实时颜色生成** - 输入任意颜色，实时生成10色梯度调色板
- 🌓 **主题模式切换** - 支持浅色和深色两种主题模式
- 🎨 **预设颜色选择** - 提供13种 Ant Design 官方预设颜色
- 📋 **一键复制功能** - 点击颜色块即可复制颜色值到剪贴板
- 📦 **多格式导出** - 支持 CSS 变量、JSON、Tailwind 配置、SCSS 变量等格式
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **现代技术栈** - 基于 React 18 + TypeScript + Vite + Tailwind CSS

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8 (推荐) 或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 🚀 部署到 Vercel

项目已配置好 Vercel 部署文件，可以一键部署：

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. Vercel 会自动检测配置并部署

或者使用 Vercel CLI：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **状态管理**: Zustand
- **颜色算法**: @ant-design/colors + @ant-design/fast-color
- **图标库**: Lucide React
- **通知组件**: Sonner
- **路由**: React Router DOM

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ColorInput.tsx   # 颜色输入组件
│   ├── ColorPalette.tsx # 调色板展示组件
│   ├── PresetColors.tsx # 预设颜色组件
│   ├── ThemeToggle.tsx  # 主题切换组件
│   └── ExportMenu.tsx   # 导出菜单组件
├── hooks/               # 自定义 Hooks
│   ├── useTheme.ts      # 主题管理 Hook
│   └── useColorGeneration.ts # 颜色生成 Hook
├── pages/               # 页面组件
│   └── Home.tsx         # 主页
├── utils/               # 工具函数
└── types.ts             # 类型定义
```

## 🎯 使用说明

1. **输入颜色**: 在顶部输入框中输入十六进制、RGB 或 HSL 格式的颜色值
2. **选择预设**: 点击预设颜色快速应用 Ant Design 官方颜色
3. **切换主题**: 使用右上角的主题切换按钮在浅色/深色模式间切换
4. **复制颜色**: 点击任意颜色块复制颜色值到剪贴板
5. **导出调色板**: 使用导出功能将调色板保存为多种格式

## 📄 许可证

MIT License
