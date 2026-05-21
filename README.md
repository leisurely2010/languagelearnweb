# 语言学习平台

一款支持多语种学习的在线教育平台，涵盖英语、中文。

## 功能特性

### 1. 分级课程体系
- 支持英语、中文两种语言
- 从入门到精通的完整学习路径

### 2. 互动式学习模块
- **单词记忆**：选择正确的中文释义
- **语法练习**：选择题形式的语法训练
- **口语跟读**：录音评分功能
- **听力训练**：音频播放和选择题

### 3. 学习进度追踪
- 实时追踪课程完成进度
- 经验值和等级系统
- 连续学习天数统计

### 4. 用户注册登录
- 邮箱密码注册登录
- 使用 NextAuth 进行认证

### 5. 个性化学习路径推荐
- 根据学习进度推荐课程
- 自适应学习难度

### 6. 社区交流及成就激励系统
- 社区发帖和评论功能
- 成就徽章系统
- 学习趋势统计

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **数据库**: SQLite + Prisma
- **认证**: NextAuth
- **样式**: Tailwind CSS 3
- **图标**: Lucide React

## 安装运行

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装步骤

1. 安装依赖：
```bash
npm install
```

2. 初始化数据库：
```bash
npx prisma migrate dev
npx prisma db seed
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
npm start
```

## 项目结构

```
├── components/          # React 组件
│   ├── Layout.tsx       # 布局组件
│   ├── Card.tsx         # 卡片组件
│   ├── CourseCard.tsx   # 课程卡片
│   ├── ProgressBar.tsx  # 进度条
│   ├── AchievementBadge.tsx  # 成就徽章
│   ├── WordPractice.tsx      # 单词练习
│   ├── GrammarExercise.tsx   # 语法练习
│   ├── SpeakingPractice.tsx  # 口语练习
│   └── ListeningPractice.tsx # 听力练习
├── pages/               # Next.js 页面
│   ├── index.tsx        # 首页
│   ├── courses/         # 课程页面
│   ├── progress.tsx     # 进度页面
│   ├── community.tsx    # 社区页面
│   └── auth/            # 认证页面
├── api/                 # API 路由
├── lib/                 # 工具库
├── prisma/              # Prisma 配置
└── styles/              # 全局样式
```

## 许可证

MIT
