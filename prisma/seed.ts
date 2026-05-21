import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 生成专项训练题目的函数
function generateQuestions(type: string, language: string, level: number): Array<{ order: number; question: string; answer: string; explanation: string; difficulty: number }> {
  const questions: Array<{ order: number; question: string; answer: string; explanation: string; difficulty: number }> = []
  const diff = level === 1 ? 1 : level === 2 ? 2 : 3
  
  if (language === 'Chinese') {
    // ====== 中文题型模板 ======
    const chinesePinyinBanks: Array<{ pinyin: string; word: string; hint: string }> = [
      { pinyin: 'nǐ hǎo', word: '你好', hint: '问候' },
      { pinyin: 'wǒ', word: '我', hint: '第一人称' },
      { pinyin: 'tā', word: '他', hint: '第三人称' },
      { pinyin: 'rì běn', word: '日本', hint: '国家名称' },
      { pinyin: 'xué xí', word: '学习', hint: '获取知识' },
      { pinyin: 'shū', word: '书', hint: '阅读材料' },
      { pinyin: 'dà', word: '大', hint: '尺寸' },
      { pinyin: 'xiǎo', word: '小', hint: '尺寸' },
      { pinyin: 'shàng xué', word: '上学', hint: '去学校' },
      { pinyin: 'lǎo shī', word: '老师', hint: '职业' },
      { pinyin: 'péng yǒu', word: '朋友', hint: '人际关系' },
      { pinyin: 'diàn huà', word: '电话', hint: '通讯设备' },
      { pinyin: 'diàn nǎo', word: '电脑', hint: '电子设备' },
      { pinyin: 'huā', word: '花', hint: '植物' },
      { pinyin: 'yuè liàng', word: '月亮', hint: '天体' },
      { pinyin: 'tài yáng', word: '太阳', hint: '恒星' },
      { pinyin: 'fēi jī', word: '飞机', hint: '交通工具' },
      { pinyin: 'qì chē', word: '汽车', hint: '交通工具' },
      { pinyin: 'huǒ chē', word: '火车', hint: '交通工具' },
      { pinyin: 'yī yuàn', word: '医院', hint: '场所' },
      { pinyin: 'xué xiào', word: '学校', hint: '场所' },
      { pinyin: 'shāng diàn', word: '商店', hint: '购物场所' },
      { pinyin: 'chī fàn', word: '吃饭', hint: '日常活动' },
      { pinyin: 'hē shuǐ', word: '喝水', hint: '日常活动' },
      { pinyin: 'kàn shū', word: '看书', hint: '阅读' },
      { pinyin: 'xiě zì', word: '写字', hint: '书写' },
      { pinyin: 'shuō huà', word: '说话', hint: '交流' },
      { pinyin: 'tīng jiǎng', word: '听讲', hint: '听课' },
      { pinyin: 'pǎo bù', word: '跑步', hint: '运动' },
      { pinyin: 'chàng gē', word: '唱歌', hint: '爱好' },
    ]
    const chineseSynonymBanks: Array<{ word: string; answer: string; options: string[] }> = [
      { word: '快乐', answer: '开心', options: ['悲伤', '开心', '愤怒', '害怕'] },
      { word: '美丽', answer: '漂亮', options: ['丑陋', '漂亮', '高大', '矮小'] },
      { word: '聪明', answer: '聪慧', options: ['愚蠢', '智慧', '愚笨', '聪慧'] },
      { word: '快速', answer: '迅速', options: ['缓慢', '迅速', '慢速', '快速'] },
      { word: '喜爱', answer: '喜欢', options: ['讨厌', '喜欢', '憎恶', '爱护'] },
      { word: '高兴', answer: '愉快', options: ['难过', '愉快', '生气', '担心'] },
      { word: '悲伤', answer: '难过', options: ['快乐', '难过', '愤怒', '平静'] },
      { word: '勇敢', answer: '英勇', options: ['胆小', '英勇', '懦弱', '害怕'] },
      { word: '善良', answer: '仁慈', options: ['邪恶', '仁慈', '残忍', '冷漠'] },
      { word: '勤劳', answer: '勤奋', options: ['懒惰', '勤奋', '懈怠', '偷懒'] },
      { word: '坚强', answer: '刚强', options: ['软弱', '刚强', '脆弱', '柔韧'] },
      { word: '温暖', answer: '暖和', options: ['寒冷', '暖和', '凉爽', '炎热'] },
      { word: '明亮', answer: '光亮', options: ['黑暗', '光亮', '昏暗', '阴冷'] },
      { word: '安静', answer: '宁静', options: ['吵闹', '宁静', '喧哗', '嘈杂'] },
      { word: '珍贵', answer: '宝贵', options: ['廉价', '宝贵', '普通', '平凡'] },
      { word: '优秀', answer: '杰出', options: ['差劲', '杰出', '普通', '落后'] },
      { word: '著名', answer: '闻名', options: ['无名', '闻名', '平庸', '普通'] },
      { word: '愿意', answer: '乐意', options: ['拒绝', '乐意', '勉强', '不肯'] },
      { word: '思念', answer: '想念', options: ['忘记', '想念', '讨厌', '嫌弃'] },
      { word: '保护', answer: '守护', options: ['破坏', '守护', '伤害', '攻击'] },
      { word: '帮助', answer: '协助', options: ['阻碍', '协助', '妨碍', '捣乱'] },
      { word: '称赞', answer: '赞扬', options: ['批评', '赞扬', '指责', '贬低'] },
      { word: '思考', answer: '思索', options: ['发呆', '思索', '迷糊', '妄想'] },
      { word: '观察', answer: '观看', options: ['忽视', '观看', '忽略', '漠视'] },
      { word: '巨大', answer: '庞大', options: ['渺小', '庞大', '细小', '卑微'] },
      { word: '特别', answer: '特殊', options: ['普通', '特殊', '一般', '平常'] },
      { word: '立刻', answer: '马上', options: ['拖延', '马上', '以后', '稍后'] },
      { word: '愤怒', answer: '恼怒', options: ['开心', '恼怒', '平静', '安逸'] },
      { word: '疲惫', answer: '疲倦', options: ['精神', '疲倦', '兴奋', '活力'] },
      { word: '骄傲', answer: '自豪', options: ['谦虚', '自豪', '自卑', '羞愧'] },
    ]
    const chineseAntonymBanks: Array<{ word: string; answer: string; options: string[] }> = [
      { word: '大', answer: '小', options: ['小', '高', '矮', '长'] },
      { word: '高', answer: '矮', options: ['低', '上', '下', '矮'] },
      { word: '开心', answer: '悲伤', options: ['快乐', '悲伤', '愤怒', '平静'] },
      { word: '快', answer: '慢', options: ['慢', '快', '急', '缓'] },
      { word: '多', answer: '少', options: ['少', '众', '寡', '稀'] },
      { word: '热', answer: '冷', options: ['冷', '暖', '凉', '温'] },
      { word: '远', answer: '近', options: ['近', '遥', '长', '短'] },
      { word: '轻', answer: '重', options: ['重', '薄', '浮', '松'] },
      { word: '厚', answer: '薄', options: ['薄', '厚', '粗', '细'] },
      { word: '胖', answer: '瘦', options: ['瘦', '壮', '肥', '满'] },
      { word: '新', answer: '旧', options: ['旧', '陈', '古', '老'] },
      { word: '深', answer: '浅', options: ['浅', '暗', '沉', '厚'] },
      { word: '宽', answer: '窄', options: ['窄', '广', '阔', '长'] },
      { word: '浓', answer: '淡', options: ['淡', '厚', '重', '郁'] },
      { word: '稠', answer: '稀', options: ['稀', '密', '浓', '厚'] },
      { word: '生', answer: '熟', options: ['熟', '活', '新', '青'] },
      { word: '贫', answer: '富', options: ['富', '贵', '丰', '厚'] },
      { word: '勤', answer: '懒', options: ['懒', '惰', '怠', '拙'] },
      { word: '善', answer: '恶', options: ['恶', '良', '美', '好'] },
      { word: '真', answer: '假', options: ['假', '实', '诚', '正'] },
      { word: '美', answer: '丑', options: ['丑', '丽', '俊', '秀'] },
      { word: '好', answer: '坏', options: ['坏', '优', '佳', '良'] },
      { word: '黑', answer: '白', options: ['白', '暗', '灰', '乌'] },
      { word: '长', answer: '短', options: ['短', '远', '悠', '久'] },
      { word: '粗', answer: '细', options: ['细', '大', '壮', '肥'] },
      { word: '硬', answer: '软', options: ['软', '坚', '刚', '强'] },
      { word: '干', answer: '湿', options: ['湿', '燥', '枯', '旱'] },
      { word: '静', answer: '闹', options: ['闹', '寂', '安', '宁'] },
      { word: '明', answer: '暗', options: ['暗', '亮', '光', '辉'] },
      { word: '进', answer: '退', options: ['退', '入', '前', '往'] },
    ]
    const chineseIdiomBanks: Array<{ idiom: string; answer: string; options: string[]; explanation: string }> = [
      { idiom: '一____二', answer: '箭', options: ['心', '举', '石', '箭'], explanation: '一箭双雕' },
      { idiom: '画蛇____', answer: '添足', options: ['画龙点睛', '画蛇添足', '画龙画虎', '画蛇成龙'], explanation: '画蛇添足' },
      { idiom: '千军____马', answer: '万', options: ['万', '千', '百', '十'], explanation: '千军万马' },
      { idiom: '山____水尽', answer: '穷', options: ['高', '清', '穷', '远'], explanation: '山穷水尽' },
      { idiom: '____天动地', answer: '惊', options: ['惊', '震', '撼', '轰'], explanation: '惊天动地' },
      { idiom: '守株待____', answer: '兔', options: ['兔', '鸟', '鱼', '兽'], explanation: '守株待兔' },
      { idiom: '画龙点____', answer: '睛', options: ['睛', '眼', '目', '瞳'], explanation: '画龙点睛' },
      { idiom: '对牛弹____', answer: '琴', options: ['琴', '筝', '箫', '瑟'], explanation: '对牛弹琴' },
      { idiom: '亡羊补____', answer: '牢', options: ['牢', '圈', '栏', '栅'], explanation: '亡羊补牢' },
      { idiom: '掩耳盗____', answer: '铃', options: ['铃', '钟', '鼓', '锣'], explanation: '掩耳盗铃' },
      { idiom: '刻舟求____', answer: '剑', options: ['剑', '刀', '矛', '盾'], explanation: '刻舟求剑' },
      { idiom: '叶公好____', answer: '龙', options: ['龙', '凤', '虎', '蛇'], explanation: '叶公好龙' },
      { idiom: '杯弓蛇____', answer: '影', options: ['影', '形', '迹', '态'], explanation: '杯弓蛇影' },
      { idiom: '狐假虎____', answer: '威', options: ['威', '势', '力', '权'], explanation: '狐假虎威' },
      { idiom: '井底之____', answer: '蛙', options: ['蛙', '龟', '鱼', '虾'], explanation: '井底之蛙' },
      { idiom: '鹤立鸡____', answer: '群', options: ['群', '中', '里', '间'], explanation: '鹤立鸡群' },
      { idiom: '虎头蛇____', answer: '尾', options: ['尾', '身', '首', '足'], explanation: '虎头蛇尾' },
      { idiom: '马到成____', answer: '功', options: ['功', '就', '绩', '效'], explanation: '马到成功' },
      { idiom: '龙飞凤____', answer: '舞', options: ['舞', '翔', '飞', '跃'], explanation: '龙飞凤舞' },
      { idiom: '鸡犬不____', answer: '宁', options: ['宁', '安', '静', '平'], explanation: '鸡犬不宁' },
      { idiom: '鼠目寸____', answer: '光', options: ['光', '明', '亮', '辉'], explanation: '鼠目寸光' },
      { idiom: '牛刀小____', answer: '试', options: ['试', '用', '使', '展'], explanation: '牛刀小试' },
      { idiom: '如虎添____', answer: '翼', options: ['翼', '翅', '羽', '翎'], explanation: '如虎添翼' },
      { idiom: '杯水车____', answer: '薪', options: ['薪', '柴', '木', '草'], explanation: '杯水车薪' },
      { idiom: '画饼充____', answer: '饥', options: ['饥', '饿', '渴', '饱'], explanation: '画饼充饥' },
      { idiom: '精卫填____', answer: '海', options: ['海', '湖', '河', '江'], explanation: '精卫填海' },
      { idiom: '愚公移____', answer: '山', options: ['山', '石', '土', '岳'], explanation: '愚公移山' },
      { idiom: '百发百____', answer: '中', options: ['中', '准', '对', '正'], explanation: '百发百中' },
      { idiom: '一心一____', answer: '意', options: ['意', '心', '念', '思'], explanation: '一心一意' },
      { idiom: '三心二____', answer: '意', options: ['意', '心', '念', '想'], explanation: '三心二意' },
    ]
    const chineseCollocationBanks: Array<{ phrase: string; answer: string; options: string[]; explanation: string }> = [
      { phrase: '____饭', answer: '吃', options: ['吃', '喝', '看', '写'], explanation: '吃饭' },
      { phrase: '____书', answer: '读', options: ['看', '读', '写', '听'], explanation: '读书' },
      { phrase: '____篮球', answer: '打', options: ['打', '踢', '拍', '投'], explanation: '打篮球' },
      { phrase: '____电话', answer: '打', options: ['接', '打', '听', '说'], explanation: '打电话' },
      { phrase: '____作业', answer: '做', options: ['写', '做', '读', '看'], explanation: '做作业' },
      { phrase: '____歌', answer: '唱', options: ['唱', '听', '说', '读'], explanation: '唱歌' },
      { phrase: '____步', answer: '散', options: ['散', '跑', '走', '跳'], explanation: '散步' },
      { phrase: '____床', answer: '起', options: ['起', '上', '下', '铺'], explanation: '起床' },
      { phrase: '____脸', answer: '洗', options: ['洗', '擦', '抹', '护'], explanation: '洗脸' },
      { phrase: '____牙', answer: '刷', options: ['刷', '洗', '漱', '剔'], explanation: '刷牙' },
      { phrase: '____衣服', answer: '穿', options: ['穿', '洗', '买', '裁'], explanation: '穿衣服' },
      { phrase: '____电视', answer: '看', options: ['看', '听', '开', '关'], explanation: '看电视' },
      { phrase: '____音乐', answer: '听', options: ['听', '看', '唱', '弹'], explanation: '听音乐' },
      { phrase: '____游戏', answer: '玩', options: ['玩', '打', '做', '看'], explanation: '玩游戏' },
      { phrase: '____足球', answer: '踢', options: ['踢', '打', '拍', '投'], explanation: '踢足球' },
      { phrase: '____乒乓球', answer: '打', options: ['打', '踢', '拍', '扔'], explanation: '打乒乓球' },
      { phrase: '____泳', answer: '游', options: ['游', '潜', '浮', '跳'], explanation: '游泳' },
      { phrase: '____车', answer: '骑', options: ['骑', '开', '坐', '驾'], explanation: '骑车' },
      { phrase: '____门', answer: '敲', options: ['敲', '推', '拉', '关'], explanation: '敲门' },
      { phrase: '____手', answer: '握', options: ['握', '招', '挥', '摆'], explanation: '握手' },
      { phrase: '____信', answer: '写', options: ['写', '寄', '送', '收'], explanation: '写信' },
      { phrase: '____照片', answer: '拍', options: ['拍', '照', '洗', '晒'], explanation: '拍照片' },
      { phrase: '____飞机', answer: '坐', options: ['坐', '开', '驾', '乘'], explanation: '坐飞机' },
      { phrase: '____地铁', answer: '乘', options: ['乘', '开', '驾', '骑'], explanation: '乘地铁' },
      { phrase: '____雨', answer: '下', options: ['下', '落', '降', '飘'], explanation: '下雨' },
      { phrase: '____雪', answer: '下', options: ['下', '落', '降', '飘'], explanation: '下雪' },
      { phrase: '____风', answer: '刮', options: ['刮', '吹', '起', '来'], explanation: '刮风' },
      { phrase: '____咖啡', answer: '喝', options: ['喝', '吃', '泡', '煮'], explanation: '喝咖啡' },
      { phrase: '____烟', answer: '抽', options: ['抽', '吸', '吐', '含'], explanation: '抽烟' },
      { phrase: '____茶', answer: '喝', options: ['喝', '品', '泡', '煮'], explanation: '喝茶' },
    ]
    const chineseFillBlankBanks: Array<{ sentence: string; answer: string; options: string[]; explanation: string }> = [
      { sentence: '我今天____去学校', answer: '要', options: ['要', '会', '想', '能'], explanation: '我今天要去学校' },
      { sentence: '这朵花很____', answer: '美', options: ['美', '丑', '大', '小'], explanation: '这朵花很美' },
      { sentence: '他____很高', answer: '个', options: ['长', '身', '个', '人'], explanation: '他个子很高' },
      { sentence: '我们____朋友', answer: '是', options: ['是', '做', '交', '和'], explanation: '我们是朋友' },
      { sentence: '明天____下雨', answer: '会', options: ['会', '要', '能', '想'], explanation: '明天会下雨' },
      { sentence: '我____学生', answer: '是', options: ['是', '做', '当', '为'], explanation: '我是学生' },
      { sentence: '她____老师', answer: '是', options: ['是', '当', '做', '为'], explanation: '她是老师' },
      { sentence: '我们____去公园', answer: '一起', options: ['一起', '一同', '一块', '一齐'], explanation: '我们一起去公园' },
      { sentence: '他____跑步', answer: '在', options: ['在', '正', '要', '想'], explanation: '他在跑步' },
      { sentence: '我____吃饭', answer: '在', options: ['在', '正', '要', '想'], explanation: '我在吃饭' },
      { sentence: '____是你的书', answer: '这', options: ['这', '那', '它', '他'], explanation: '这是你的书' },
      { sentence: '____是谁', answer: '那', options: ['那', '这', '它', '他'], explanation: '那是谁' },
      { sentence: '我喜欢____苹果', answer: '吃', options: ['吃', '喝', '看', '玩'], explanation: '我喜欢吃苹果' },
      { sentence: '他会____英语', answer: '说', options: ['说', '写', '读', '看'], explanation: '他会说英语' },
      { sentence: '我会____游泳', answer: '游泳', options: ['游泳', '游水', '游', '泳'], explanation: '我会游泳' },
      { sentence: '天____了', answer: '黑', options: ['黑', '暗', '晚', '夜'], explanation: '天黑了' },
      { sentence: '他____很高', answer: '长', options: ['长', '长', '生', '成'], explanation: '他长得很高' },
      { sentence: '这____书是我的', answer: '本', options: ['本', '个', '只', '条'], explanation: '这本书是我的' },
      { sentence: '那____鸟很漂亮', answer: '只', options: ['只', '个', '本', '条'], explanation: '那只鸟很漂亮' },
      { sentence: '一____鱼在游', answer: '条', options: ['条', '只', '个', '尾'], explanation: '一条鱼在游' },
      { sentence: '我____去过北京', answer: '曾经', options: ['曾经', '已经', '早已', '从未'], explanation: '我曾经去过北京' },
      { sentence: '他____来了', answer: '已经', options: ['已经', '曾经', '早已', '刚刚'], explanation: '他已经来了' },
      { sentence: '你____吃饭了吗', answer: '吃饭', options: ['吃饭', '吃', '用餐', '进食'], explanation: '你吃饭了吗' },
      { sentence: '我们____回家', answer: '一起', options: ['一起', '一同', '一块', '一路'], explanation: '我们一起回家' },
      { sentence: '他____在看书', answer: '正', options: ['正', '在', '要', '想'], explanation: '他正在看书' },
      { sentence: '她____唱歌很好听', answer: '唱歌', options: ['唱歌', '唱', '歌', '歌唱'], explanation: '她唱歌很好听' },
      { sentence: '这____菜很好吃', answer: '道', options: ['道', '个', '盘', '碗'], explanation: '这道菜很好吃' },
      { sentence: '我____三兄弟', answer: '有', options: ['有', '是', '为', '做'], explanation: '我有三兄弟' },
      { sentence: '他____一个姐姐', answer: '有', options: ['有', '是', '为', '做'], explanation: '他有一个姐姐' },
      { sentence: '我们____好朋友', answer: '是', options: ['是', '做', '当', '成'], explanation: '我们是好朋友' },
    ]
    const chineseQuantifierBanks: Array<{ phrase: string; noun: string; answer: string; options: string[]; explanation: string }> = [
      { phrase: '一____书', noun: '书', answer: '本', options: ['个', '本', '只', '条'], explanation: '一本书' },
      { phrase: '一____笔', noun: '笔', answer: '支', options: ['支', '根', '条', '个'], explanation: '一支笔' },
      { phrase: '一____树', noun: '树', answer: '棵', options: ['棵', '株', '个', '只'], explanation: '一棵树' },
      { phrase: '一____鸟', noun: '鸟', answer: '只', options: ['只', '个', '条', '尾'], explanation: '一只鸟' },
      { phrase: '一____鱼', noun: '鱼', answer: '条', options: ['条', '只', '个', '尾'], explanation: '一条鱼' },
      { phrase: '一____桌子', noun: '桌子', answer: '张', options: ['张', '个', '只', '条'], explanation: '一张桌子' },
      { phrase: '一____椅子', noun: '椅子', answer: '把', options: ['把', '个', '张', '条'], explanation: '一把椅子' },
      { phrase: '一____花', noun: '花', answer: '朵', options: ['朵', '枝', '棵', '束'], explanation: '一朵花' },
      { phrase: '一____山', noun: '山', answer: '座', options: ['座', '个', '条', '片'], explanation: '一座山' },
      { phrase: '一____河', noun: '河', answer: '条', options: ['条', '个', '道', '片'], explanation: '一条河' },
      { phrase: '一____狗', noun: '狗', answer: '条', options: ['条', '只', '个', '匹'], explanation: '一条狗' },
      { phrase: '一____猫', noun: '猫', answer: '只', options: ['只', '条', '个', '匹'], explanation: '一只猫' },
      { phrase: '一____马', noun: '马', answer: '匹', options: ['匹', '只', '条', '个'], explanation: '一匹马' },
      { phrase: '一____牛', noun: '牛', answer: '头', options: ['头', '只', '条', '匹'], explanation: '一头牛' },
      { phrase: '一____猪', noun: '猪', answer: '头', options: ['头', '只', '条', '口'], explanation: '一头猪' },
      { phrase: '一____房子', noun: '房子', answer: '栋', options: ['栋', '间', '所', '座'], explanation: '一栋房子' },
      { phrase: '一____教室', noun: '教室', answer: '间', options: ['间', '个', '所', '栋'], explanation: '一间教室' },
      { phrase: '一____衣服', noun: '衣服', answer: '件', options: ['件', '条', '双', '套'], explanation: '一件衣服' },
      { phrase: '一____鞋', noun: '鞋', answer: '双', options: ['双', '只', '对', '副'], explanation: '一双鞋' },
      { phrase: '一____帽子', noun: '帽子', answer: '顶', options: ['顶', '个', '只', '双'], explanation: '一顶帽子' },
      { phrase: '一____信', noun: '信', answer: '封', options: ['封', '张', '篇', '份'], explanation: '一封信' },
      { phrase: '一____报纸', noun: '报纸', answer: '张', options: ['张', '份', '篇', '本'], explanation: '一张报纸' },
      { phrase: '一____钥匙', noun: '钥匙', answer: '把', options: ['把', '串', '个', '根'], explanation: '一把钥匙' },
      { phrase: '一____刀', noun: '刀', answer: '把', options: ['把', '柄', '个', '根'], explanation: '一把刀' },
      { phrase: '一____灯', noun: '灯', answer: '盏', options: ['盏', '个', '只', '台'], explanation: '一盏灯' },
      { phrase: '一____诗', noun: '诗', answer: '首', options: ['首', '篇', '段', '句'], explanation: '一首诗' },
      { phrase: '一____文章', noun: '文章', answer: '篇', options: ['篇', '首', '段', '本'], explanation: '一篇文章' },
      { phrase: '一____桥', noun: '桥', answer: '座', options: ['座', '条', '道', '孔'], explanation: '一座桥' },
      { phrase: '一____星星', noun: '星星', answer: '颗', options: ['颗', '个', '粒', '点'], explanation: '一颗星星' },
      { phrase: '一____叶子', noun: '叶子', answer: '片', options: ['片', '张', '枚', '个'], explanation: '一片叶子' },
    ]
    const chinesePunctuationBanks: Array<{ sentence: string; answer: string; options: string[]; explanation: string }> = [
      { sentence: '今天天气真好____', answer: '！', options: ['。', '！', '？', '，'], explanation: '感叹句用感叹号' },
      { sentence: '你吃饭了吗____', answer: '？', options: ['。', '？', '！', '，'], explanation: '疑问句用问号' },
      { sentence: '我喜欢吃苹果____香蕉____梨', answer: '、', options: ['，', '、', '；', '。'], explanation: '并列词语用顿号' },
      { sentence: '他说____我明天见', answer: '："', options: ['："', '：', '：', '，'], explanation: '说话内容前加冒号引号' },
      { sentence: '这是我的书____', answer: '。', options: ['。', '！', '？', '，'], explanation: '陈述句用句号' },
      { sentence: '你____我____他都是学生', answer: '、', options: ['、', '，', '；', '。'], explanation: '并列词语用顿号' },
      { sentence: '啊____真漂亮____', answer: '，', options: ['，', '！', '。', '？'], explanation: '感叹词后用逗号' },
      { sentence: '喂____你是谁', answer: '，', options: ['，', '！', '？', '。'], explanation: '呼语后用逗号' },
      { sentence: '因为下雨____所以没去', answer: '，', options: ['，', '。', '；', '——'], explanation: '因果复句用逗号' },
      { sentence: '如果明天下雨____就不去了', answer: '，', options: ['，', '。', '；', '——'], explanation: '假设复句用逗号' },
      { sentence: '他不仅聪明____而且努力', answer: '，', options: ['，', '。', '；', '——'], explanation: '递进复句用逗号' },
      { sentence: '《红楼梦》____西游记____三国演义', answer: '、', options: ['、', '，', '；', '。'], explanation: '书名之间用顿号' },
      { sentence: '他问____你叫什么名字', answer: '：', options: ['：', '，', '。', '？'], explanation: '引出问话用冒号' },
      { sentence: '注意____危险', answer: '！', options: ['！', '。', '？', '：'], explanation: '警示语用感叹号' },
      { sentence: '一二三____开始', answer: '，', options: ['，', '。', '！', '——'], explanation: '列举后用逗号' },
      { sentence: '他说____好的____我马上来', answer: '，', options: ['，', '：', '。', '；'], explanation: '引语前用逗号' },
      { sentence: '北京是中国的首都____', answer: '。', options: ['。', '！', '？', '，'], explanation: '陈述句用句号' },
      { sentence: '这个问题很难____不是吗', answer: '，', options: ['，', '。', '？', '！'], explanation: '反问句前用逗号' },
      { sentence: '加油____你能行____', answer: '，', options: ['，', '！', '。', '？'], explanation: '鼓励用语间用逗号' },
      { sentence: '中华人民共和国____简称中国', answer: '，', options: ['，', '——', '、', '。'], explanation: '解释说明前用逗号' },
      { sentence: '小学____中学____大学', answer: '、', options: ['、', '，', '；', '——'], explanation: '并列项用顿号' },
      { sentence: '他热爱学习____成绩很好', answer: '，', options: ['，', '。', '；', '——'], explanation: '因果句用逗号' },
      { sentence: '虽然很累____但是他坚持着', answer: '，', options: ['，', '。', '；', '——'], explanation: '转折句用逗号' },
      { sentence: '你怎么了____', answer: '？', options: ['？', '！', '。', '，'], explanation: '疑问句用问号' },
      { sentence: '多么美丽的风景____', answer: '！', options: ['！', '。', '？', '，'], explanation: '感叹句用感叹号' },
      { sentence: '书____是人类进步的阶梯', answer: '，', options: ['，', '——', '、', '；'], explanation: '主语后停顿用逗号' },
      { sentence: '总之____我们要努力', answer: '，', options: ['，', '——', '：', '；'], explanation: '总结词后用逗号' },
      { sentence: '他买了苹果____香蕉和橘子', answer: '、', options: ['、', '，', '；', '——'], explanation: '并列词语用顿号' },
      { sentence: '第一____要预习____第二____要复习', answer: '，', options: ['，', '、', '；', '。'], explanation: '序次语后用逗号' },
      { sentence: '祝你生日快乐____', answer: '！', options: ['！', '。', '？', '，'], explanation: '祝愿语用感叹号' },
    ]

    const bankMap: Record<string, any[]> = {
      PINYIN_TO_WORDS: chinesePinyinBanks,
      SYNONYMS: chineseSynonymBanks,
      ANTONYMS: chineseAntonymBanks,
      IDIOMS: chineseIdiomBanks,
      WORD_COLLOCATION: chineseCollocationBanks,
      FILL_IN_BLANK: chineseFillBlankBanks,
      QUANTIFIERS: chineseQuantifierBanks,
      PUNCTUATION: chinesePunctuationBanks,
    }
    const bank = bankMap[type] || []
    // 根据等级选择不同的30题（通过偏移量取不同的子集）
    const offset = (level - 1) * 10 % bank.length
    for (let i = 0; i < 30; i++) {
      const idx = (offset + i) % bank.length
      const item = bank[idx]
      if (type === 'PINYIN_TO_WORDS') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ pinyin: item.pinyin, hint: item.hint }),
          answer: item.word,
          explanation: `${item.pinyin} 对应中文 "${item.word}"`,
          difficulty: diff,
        })
      } else if (type === 'SYNONYMS' || type === 'ANTONYMS') {
        const t = type === 'SYNONYMS' ? '近义词' : '反义词'
        questions.push({
          order: i + 1,
          question: JSON.stringify({ word: item.word, options: item.options }),
          answer: item.answer,
          explanation: `"${item.word}"的${t}是"${item.answer}"`,
          difficulty: diff,
        })
      } else if (type === 'IDIOMS') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ idiom: item.idiom, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      } else if (type === 'WORD_COLLOCATION') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ phrase: item.phrase, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      } else if (type === 'FILL_IN_BLANK') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ sentence: item.sentence, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      } else if (type === 'QUANTIFIERS') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ phrase: item.phrase, noun: item.noun, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      } else if (type === 'PUNCTUATION') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ sentence: item.sentence, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      }
    }
  } else {
    // ====== 英语题型模板 ======
    const englishSpellingBanks: Array<{ word: string; hint: string }> = [
      { word: 'hello', hint: 'greeting' },
      { word: 'world', hint: 'the earth' },
      { word: 'learn', hint: 'gain knowledge' },
      { word: 'book', hint: 'reading material' },
      { word: 'happy', hint: 'feeling good' },
      { word: 'school', hint: 'place of education' },
      { word: 'teacher', hint: 'instructor' },
      { word: 'student', hint: 'learner' },
      { word: 'friend', hint: 'companion' },
      { word: 'family', hint: 'parents and children' },
      { word: 'water', hint: 'drink' },
      { word: 'flower', hint: 'plant bloom' },
      { word: 'garden', hint: 'outdoor plants area' },
      { word: 'music', hint: 'sounds and melodies' },
      { word: 'dance', hint: 'move rhythmically' },
      { word: 'apple', hint: 'fruit' },
      { word: 'orange', hint: 'citrus fruit' },
      { word: 'animal', hint: 'living creature' },
      { word: 'forest', hint: 'wooded area' },
      { word: 'river', hint: 'flowing water' },
      { word: 'mountain', hint: 'high landform' },
      { word: 'ocean', hint: 'vast sea' },
      { word: 'planet', hint: 'celestial body' },
      { word: 'travel', hint: 'journey' },
      { word: 'winter', hint: 'cold season' },
      { word: 'summer', hint: 'hot season' },
      { word: 'spring', hint: 'season after winter' },
      { word: 'autumn', hint: 'fall season' },
      { word: 'beauty', hint: 'aesthetic quality' },
      { word: 'wisdom', hint: 'knowledge and experience' },
    ]
    const englishSynonymBanks: Array<{ word: string; answer: string; options: string[] }> = [
      { word: 'happy', answer: 'joyful', options: ['sad', 'joyful', 'angry', 'afraid'] },
      { word: 'big', answer: 'large', options: ['small', 'large', 'tall', 'short'] },
      { word: 'fast', answer: 'quick', options: ['slow', 'quick', 'tiny', 'rapid'] },
      { word: 'smart', answer: 'intelligent', options: ['stupid', 'intelligent', 'foolish', 'dumb'] },
      { word: 'love', answer: 'like', options: ['hate', 'like', 'dislike', 'care'] },
      { word: 'pretty', answer: 'beautiful', options: ['ugly', 'beautiful', 'plain', 'homely'] },
      { word: 'old', answer: 'ancient', options: ['new', 'ancient', 'young', 'modern'] },
      { word: 'rich', answer: 'wealthy', options: ['poor', 'wealthy', 'needy', 'destitute'] },
      { word: 'brave', answer: 'courageous', options: ['cowardly', 'courageous', 'timid', 'fearful'] },
      { word: 'kind', answer: 'generous', options: ['cruel', 'generous', 'mean', 'selfish'] },
      { word: 'sad', answer: 'unhappy', options: ['glad', 'unhappy', 'merry', 'cheerful'] },
      { word: 'tired', answer: 'exhausted', options: ['energetic', 'exhausted', 'fresh', 'lively'] },
      { word: 'angry', answer: 'furious', options: ['calm', 'furious', 'peaceful', 'serene'] },
      { word: 'scared', answer: 'frightened', options: ['brave', 'frightened', 'bold', 'courageous'] },
      { word: 'difficult', answer: 'hard', options: ['easy', 'hard', 'simple', 'light'] },
      { word: 'important', answer: 'significant', options: ['trivial', 'significant', 'minor', 'petty'] },
      { word: 'strange', answer: 'odd', options: ['normal', 'odd', 'usual', 'common'] },
      { word: 'quiet', answer: 'silent', options: ['noisy', 'silent', 'loud', 'chatty'] },
      { word: 'thin', answer: 'slim', options: ['fat', 'slim', 'thick', 'heavy'] },
      { word: 'begin', answer: 'start', options: ['end', 'start', 'finish', 'stop'] },
      { word: 'help', answer: 'assist', options: ['hinder', 'assist', 'block', 'obstruct'] },
      { word: 'talk', answer: 'speak', options: ['listen', 'speak', 'silence', 'hear'] },
      { word: 'look', answer: 'see', options: ['ignore', 'see', 'miss', 'overlook'] },
      { word: 'think', answer: 'believe', options: ['doubt', 'believe', 'wonder', 'question'] },
      { word: 'want', answer: 'desire', options: ['reject', 'desire', 'refuse', 'decline'] },
      { word: 'like', answer: 'enjoy', options: ['dislike', 'enjoy', 'hate', 'detest'] },
      { word: 'great', answer: 'excellent', options: ['poor', 'excellent', 'bad', 'awful'] },
      { word: 'small', answer: 'tiny', options: ['large', 'tiny', 'huge', 'massive'] },
      { word: 'young', answer: 'youthful', options: ['old', 'youthful', 'aged', 'elderly'] },
      { word: 'calm', answer: 'peaceful', options: ['agitated', 'peaceful', 'nervous', 'anxious'] },
    ]
    const englishAntonymBanks: Array<{ word: string; answer: string; options: string[] }> = [
      { word: 'big', answer: 'small', options: ['small', 'tall', 'short', 'long'] },
      { word: 'happy', answer: 'sad', options: ['joyful', 'sad', 'angry', 'calm'] },
      { word: 'fast', answer: 'slow', options: ['slow', 'quick', 'rapid', 'swift'] },
      { word: 'hot', answer: 'cold', options: ['warm', 'cold', 'cool', 'mild'] },
      { word: 'many', answer: 'few', options: ['few', 'much', 'some', 'little'] },
      { word: 'rich', answer: 'poor', options: ['poor', 'wealthy', 'affluent', 'prosperous'] },
      { word: 'young', answer: 'old', options: ['old', 'youthful', 'new', 'fresh'] },
      { word: 'tall', answer: 'short', options: ['short', 'high', 'lofty', 'towering'] },
      { word: 'full', answer: 'empty', options: ['empty', 'stuffed', 'packed', 'crowded'] },
      { word: 'wet', answer: 'dry', options: ['dry', 'damp', 'moist', 'humid'] },
      { word: 'light', answer: 'dark', options: ['dark', 'bright', 'brilliant', 'shining'] },
      { word: 'heavy', answer: 'light', options: ['light', 'massive', 'weighty', 'bulky'] },
      { word: 'hard', answer: 'soft', options: ['soft', 'firm', 'solid', 'tough'] },
      { word: 'clean', answer: 'dirty', options: ['dirty', 'neat', 'tidy', 'spotless'] },
      { word: 'open', answer: 'closed', options: ['closed', 'ajar', 'wide', 'shut'] },
      { word: 'loud', answer: 'quiet', options: ['quiet', 'noisy', 'booming', 'thunderous'] },
      { word: 'thick', answer: 'thin', options: ['thin', 'fat', 'wide', 'broad'] },
      { word: 'strong', answer: 'weak', options: ['weak', 'powerful', 'mighty', 'sturdy'] },
      { word: 'brave', answer: 'cowardly', options: ['cowardly', 'bold', 'fearless', 'heroic'] },
      { word: 'polite', answer: 'rude', options: ['rude', 'courteous', 'gracious', 'mannerly'] },
      { word: 'early', answer: 'late', options: ['late', 'prompt', 'timely', 'punctual'] },
      { word: 'long', answer: 'short', options: ['short', 'extended', 'lengthy', 'prolonged'] },
      { word: 'wide', answer: 'narrow', options: ['narrow', 'broad', 'spacious', 'roomy'] },
      { word: 'deep', answer: 'shallow', options: ['shallow', 'profound', 'bottomless', 'abyssal'] },
      { word: 'high', answer: 'low', options: ['low', 'elevated', 'lofty', 'sky-high'] },
      { word: 'kind', answer: 'cruel', options: ['cruel', 'gentle', 'warm', 'caring'] },
      { word: 'safe', answer: 'dangerous', options: ['dangerous', 'secure', 'protected', 'shielded'] },
      { word: 'easy', answer: 'difficult', options: ['difficult', 'simple', 'effortless', 'smooth'] },
      { word: 'sweet', answer: 'bitter', options: ['bitter', 'sugary', 'savory', 'tasty'] },
      { word: 'fresh', answer: 'stale', options: ['stale', 'new', 'crisp', 'vibrant'] },
    ]
    const englishIdiomBanks: Array<{ idiom: string; answer: string; options: string[]; explanation: string }> = [
      { idiom: 'Break a ____', answer: 'leg', options: ['leg', 'arm', 'foot', 'hand'], explanation: 'Break a leg means good luck' },
      { idiom: 'Piece of ____', answer: 'cake', options: ['cake', 'bread', 'pie', 'pizza'], explanation: 'Piece of cake means very easy' },
      { idiom: 'Hit the ____ on the head', answer: 'nail', options: ['nail', 'hammer', 'pin', 'screw'], explanation: 'Hit the nail on the head means to be exactly right' },
      { idiom: 'Cost an ____ and a leg', answer: 'arm', options: ['arm', 'eye', 'ear', 'finger'], explanation: 'Cost an arm and a leg means very expensive' },
      { idiom: 'Once in a ____ moon', answer: 'blue', options: ['blue', 'red', 'full', 'new'], explanation: 'Once in a blue moon means very rarely' },
      { idiom: 'Under the ____', answer: 'weather', options: ['weather', 'rain', 'clouds', 'sun'], explanation: 'Under the weather means feeling ill' },
      { idiom: 'Let the cat out of the ____', answer: 'bag', options: ['bag', 'box', 'house', 'cage'], explanation: 'Let the cat out of the bag means reveal a secret' },
      { idiom: 'When pigs ____', answer: 'fly', options: ['fly', 'run', 'jump', 'swim'], explanation: 'When pigs fly means something that will never happen' },
      { idiom: 'Spill the ____', answer: 'beans', options: ['beans', 'milk', 'water', 'salt'], explanation: 'Spill the beans means reveal a secret' },
      { idiom: 'Bite the ____', answer: 'bullet', options: ['bullet', 'apple', 'cake', 'rope'], explanation: 'Bite the bullet means face a difficult situation' },
      { idiom: 'The ball is in your ____', answer: 'court', options: ['court', 'hand', 'field', 'house'], explanation: 'The ball is in your court means it is your turn to act' },
      { idiom: 'Burn the midnight ____', answer: 'oil', options: ['oil', 'candle', 'lamp', 'light'], explanation: 'Burn the midnight oil means work late into the night' },
      { idiom: 'Add fuel to the ____', answer: 'fire', options: ['fire', 'water', 'wind', 'earth'], explanation: 'Add fuel to the fire means make a situation worse' },
      { idiom: 'Steal someone\'s ____', answer: 'thunder', options: ['thunder', 'lightning', 'rain', 'wind'], explanation: 'Steal someone\'s thunder means take attention away' },
      { idiom: 'Face the ____', answer: 'music', options: ['music', 'song', 'dance', 'show'], explanation: 'Face the music means accept consequences' },
      { idiom: 'Go the extra ____', answer: 'mile', options: ['mile', 'step', 'yard', 'foot'], explanation: 'Go the extra mile means make extra effort' },
      { idiom: 'Keep your ____ up', answer: 'chin', options: ['chin', 'head', 'hand', 'eye'], explanation: 'Keep your chin up means stay positive' },
      { idiom: 'Cut ____ chase', answer: 'to the', options: ['to the', 'the', 'out the', 'off the'], explanation: 'Cut to the chase means get to the point' },
      { idiom: 'Miss the ____', answer: 'boat', options: ['boat', 'bus', 'train', 'plane'], explanation: 'Miss the boat means miss an opportunity' },
      { idiom: 'Pull someone\'s ____', answer: 'leg', options: ['leg', 'arm', 'hair', 'ear'], explanation: 'Pull someone\'s leg means tease someone' },
      { idiom: 'See eye to ____', answer: 'eye', options: ['eye', 'ear', 'nose', 'mouth'], explanation: 'See eye to eye means agree with someone' },
      { idiom: 'Sit on the ____', answer: 'fence', options: ['fence', 'chair', 'floor', 'ground'], explanation: 'Sit on the fence means remain neutral' },
      { idiom: 'Take it with a grain of ____', answer: 'salt', options: ['salt', 'pepper', 'sugar', 'sand'], explanation: 'Take with a grain of salt means be skeptical' },
      { idiom: 'The best of both ____', answer: 'worlds', options: ['worlds', 'sides', 'ends', 'ways'], explanation: 'The best of both worlds means enjoy two different advantages' },
      { idiom: 'Through thick and ____', answer: 'thin', options: ['thin', 'thick', 'slim', 'wide'], explanation: 'Through thick and thin means through all difficulties' },
      { idiom: 'Time flies when you\'re having ____', answer: 'fun', options: ['fun', 'work', 'sleep', 'eat'], explanation: 'Time flies when you\'re having fun' },
      { idiom: 'Up in the ____', answer: 'air', options: ['air', 'sky', 'cloud', 'wind'], explanation: 'Up in the air means uncertain' },
      { idiom: 'Wear your heart on your ____', answer: 'sleeve', options: ['sleeve', 'shirt', 'pocket', 'collar'], explanation: 'Wear your heart on your sleeve means show emotions openly' },
      { idiom: 'You can\'t judge a book by its ____', answer: 'cover', options: ['cover', 'page', 'title', 'author'], explanation: 'Don\'t judge based on appearance' },
      { idiom: 'Your guess is as good as ____', answer: 'mine', options: ['mine', 'his', 'hers', 'theirs'], explanation: 'Your guess is as good as mine means I don\'t know either' },
    ]
    const englishCollocationBanks: Array<{ phrase: string; answer: string; options: string[]; explanation: string }> = [
      { phrase: '____ breakfast', answer: 'have', options: ['make', 'do', 'cook', 'have'], explanation: 'We say "have breakfast"' },
      { phrase: '____ a shower', answer: 'take', options: ['make', 'take', 'do', 'get'], explanation: 'We say "take a shower"' },
      { phrase: '____ a decision', answer: 'make', options: ['do', 'make', 'take', 'have'], explanation: 'We say "make a decision"' },
      { phrase: '____ homework', answer: 'do', options: ['make', 'do', 'take', 'get'], explanation: 'We say "do homework"' },
      { phrase: '____ a mistake', answer: 'make', options: ['do', 'make', 'take', 'have'], explanation: 'We say "make a mistake"' },
      { phrase: '____ attention', answer: 'pay', options: ['pay', 'give', 'make', 'take'], explanation: 'We say "pay attention"' },
      { phrase: '____ a call', answer: 'make', options: ['do', 'make', 'take', 'have'], explanation: 'We say "make a call"' },
      { phrase: '____ time', answer: 'spend', options: ['spend', 'take', 'cost', 'use'], explanation: 'We say "spend time"' },
      { phrase: '____ a walk', answer: 'take', options: ['do', 'make', 'take', 'have'], explanation: 'We say "take a walk"' },
      { phrase: '____ business', answer: 'do', options: ['make', 'do', 'take', 'have'], explanation: 'We say "do business"' },
      { phrase: '____ a promise', answer: 'make', options: ['do', 'make', 'take', 'keep'], explanation: 'We say "make a promise"' },
      { phrase: '____ a complaint', answer: 'make', options: ['do', 'make', 'take', 'file'], explanation: 'We say "make a complaint"' },
      { phrase: '____ an exam', answer: 'take', options: ['do', 'make', 'take', 'have'], explanation: 'We say "take an exam"' },
      { phrase: '____ a nap', answer: 'take', options: ['do', 'make', 'take', 'have'], explanation: 'We say "take a nap"' },
      { phrase: '____ a guess', answer: 'make', options: ['do', 'make', 'take', 'have'], explanation: 'We say "make a guess"' },
      { phrase: '____ a difference', answer: 'make', options: ['do', 'make', 'take', 'have'], explanation: 'We say "make a difference"' },
      { phrase: '____ money', answer: 'make', options: ['do', 'make', 'take', 'earn'], explanation: 'We say "make money"' },
      { phrase: '____ friends', answer: 'make', options: ['do', 'make', 'take', 'get'], explanation: 'We say "make friends"' },
      { phrase: '____ a photo', answer: 'take', options: ['do', 'make', 'take', 'get'], explanation: 'We say "take a photo"' },
      { phrase: '____ a risk', answer: 'take', options: ['do', 'make', 'take', 'have'], explanation: 'We say "take a risk"' },
      { phrase: '____ a break', answer: 'take', options: ['do', 'make', 'take', 'have'], explanation: 'We say "take a break"' },
      { phrase: '____ dinner', answer: 'have', options: ['do', 'make', 'have', 'take'], explanation: 'We say "have dinner"' },
      { phrase: '____ a rest', answer: 'have', options: ['do', 'make', 'take', 'have'], explanation: 'We say "have a rest"' },
      { phrase: '____ fun', answer: 'have', options: ['do', 'make', 'have', 'take'], explanation: 'We say "have fun"' },
      { phrase: '____ a dream', answer: 'have', options: ['do', 'make', 'have', 'take'], explanation: 'We say "have a dream"' },
      { phrase: '____ a meeting', answer: 'have', options: ['do', 'make', 'have', 'take'], explanation: 'We say "have a meeting"' },
      { phrase: '____ a party', answer: 'have', options: ['do', 'make', 'have', 'take'], explanation: 'We say "have a party"' },
      { phrase: '____ trouble', answer: 'have', options: ['do', 'make', 'have', 'take'], explanation: 'We say "have trouble"' },
      { phrase: '____ a conversation', answer: 'have', options: ['do', 'make', 'have', 'take'], explanation: 'We say "have a conversation"' },
      { phrase: '____ a try', answer: 'give', options: ['do', 'make', 'give', 'take'], explanation: 'We say "give it a try"' },
    ]
    const englishFillBlankBanks: Array<{ sentence: string; answer: string; options: string[]; explanation: string }> = [
      { sentence: 'I ___ to school every day.', answer: 'go', options: ['go', 'goes', 'going', 'went'], explanation: 'Present tense for I' },
      { sentence: 'She ___ a book.', answer: 'reads', options: ['read', 'reads', 'reading', 'readed'], explanation: 'Present tense for she' },
      { sentence: 'They ___ happy.', answer: 'are', options: ['is', 'am', 'are', 'be'], explanation: 'Are for plural' },
      { sentence: 'We ___ to the park yesterday.', answer: 'went', options: ['go', 'goes', 'going', 'went'], explanation: 'Past tense' },
      { sentence: 'He ___ playing now.', answer: 'is', options: ['is', 'am', 'are', 'be'], explanation: 'Present continuous' },
      { sentence: 'I ___ a student.', answer: 'am', options: ['is', 'am', 'are', 'be'], explanation: 'I am' },
      { sentence: 'You ___ my friend.', answer: 'are', options: ['is', 'am', 'are', 'be'], explanation: 'You are' },
      { sentence: 'It ___ a cat.', answer: 'is', options: ['is', 'am', 'are', 'be'], explanation: 'It is' },
      { sentence: 'We ___ good friends.', answer: 'are', options: ['is', 'am', 'are', 'be'], explanation: 'We are' },
      { sentence: 'They ___ playing football.', answer: 'are', options: ['is', 'am', 'are', 'be'], explanation: 'They are' },
      { sentence: 'She ___ to music now.', answer: 'is listening', options: ['listens', 'is listening', 'listened', 'listen'], explanation: 'Present continuous' },
      { sentence: 'I ___ breakfast at 7 AM.', answer: 'have', options: ['have', 'has', 'had', 'having'], explanation: 'Simple present' },
      { sentence: 'He ___ coffee every morning.', answer: 'drinks', options: ['drink', 'drinks', 'drinking', 'drank'], explanation: 'Third person singular' },
      { sentence: 'They ___ to the movies last night.', answer: 'went', options: ['go', 'goes', 'went', 'going'], explanation: 'Past tense' },
      { sentence: 'She ___ her homework already.', answer: 'has finished', options: ['finish', 'finished', 'has finished', 'finishes'], explanation: 'Present perfect' },
      { sentence: 'I have ___ seen that movie.', answer: 'already', options: ['already', 'yet', 'still', 'never'], explanation: 'Already in positive sentences' },
      { sentence: 'Have you ___ been to Paris?', answer: 'ever', options: ['ever', 'never', 'already', 'yet'], explanation: 'Ever in questions' },
      { sentence: 'He is ___ tallest in his class.', answer: 'the', options: ['a', 'an', 'the', '/'], explanation: 'Superlative with the' },
      { sentence: 'She is ___ honest girl.', answer: 'an', options: ['a', 'an', 'the', '/'], explanation: 'An before vowel sound' },
      { sentence: 'I need ___ water.', answer: 'some', options: ['a', 'an', 'some', 'the'], explanation: 'Some for uncountable' },
      { sentence: 'There ___ many people.', answer: 'are', options: ['is', 'am', 'are', 'be'], explanation: 'There are for plural' },
      { sentence: 'There ___ a book on the table.', answer: 'is', options: ['is', 'am', 'are', 'be'], explanation: 'There is for singular' },
      { sentence: 'He doesn\'t ___ coffee.', answer: 'like', options: ['like', 'likes', 'liked', 'liking'], explanation: 'Base form after doesn\'t' },
      { sentence: 'Do you ___ swimming?', answer: 'like', options: ['like', 'likes', 'liked', 'liking'], explanation: 'Base form after do' },
      { sentence: 'She can ___ English well.', answer: 'speak', options: ['speak', 'speaks', 'spoke', 'speaking'], explanation: 'Base form after can' },
      { sentence: 'I will ___ you tomorrow.', answer: 'call', options: ['call', 'calls', 'called', 'calling'], explanation: 'Base form after will' },
      { sentence: 'He is interested ___ music.', answer: 'in', options: ['in', 'on', 'at', 'for'], explanation: 'Interested in' },
      { sentence: 'She is good ___ math.', answer: 'at', options: ['in', 'on', 'at', 'for'], explanation: 'Good at' },
      { sentence: 'I am afraid ___ dogs.', answer: 'of', options: ['of', 'from', 'about', 'with'], explanation: 'Afraid of' },
      { sentence: 'He is proud ___ his son.', answer: 'of', options: ['of', 'for', 'with', 'about'], explanation: 'Proud of' },
    ]
    const englishDeterminerBanks: Array<{ phrase: string; noun: string; answer: string; options: string[]; explanation: string }> = [
      { phrase: '___ apple', noun: 'apple', answer: 'an', options: ['a', 'an', 'the', 'some'], explanation: 'Use "an" before vowels' },
      { phrase: '___ book', noun: 'book', answer: 'a', options: ['a', 'an', 'the', 'some'], explanation: 'Use "a" before consonants' },
      { phrase: '___ water', noun: 'water', answer: 'some', options: ['a', 'an', 'the', 'some'], explanation: 'Some for uncountable' },
      { phrase: '___ books', noun: 'books', answer: 'some', options: ['a', 'an', 'the', 'some'], explanation: 'Some for plural' },
      { phrase: '___ sun', noun: 'sun', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'The for unique things' },
      { phrase: '___ honest man', noun: 'honest man', answer: 'an', options: ['a', 'an', 'the', 'some'], explanation: 'H is silent, so "an"' },
      { phrase: '___ university', noun: 'university', answer: 'a', options: ['a', 'an', 'the', 'some'], explanation: 'University starts with consonant sound' },
      { phrase: '___ hour', noun: 'hour', answer: 'an', options: ['a', 'an', 'the', 'some'], explanation: 'H is silent, so "an"' },
      { phrase: '___ moon', noun: 'moon', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'The for unique things' },
      { phrase: '___ milk', noun: 'milk', answer: 'some', options: ['a', 'an', 'the', 'some'], explanation: 'Some for uncountable' },
      { phrase: '___ children', noun: 'children', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'The for specific groups' },
      { phrase: '___ interesting story', noun: 'interesting story', answer: 'an', options: ['a', 'an', 'the', 'some'], explanation: 'An before vowel sound' },
      { phrase: '___ beautiful flower', noun: 'beautiful flower', answer: 'a', options: ['a', 'an', 'the', 'some'], explanation: 'A before consonant sound' },
      { phrase: '___ advice', noun: 'advice', answer: 'some', options: ['a', 'an', 'the', 'some'], explanation: 'Advice is uncountable' },
      { phrase: '___ information', noun: 'information', answer: 'some', options: ['a', 'an', 'the', 'some'], explanation: 'Information is uncountable' },
      { phrase: '___ earth', noun: 'earth', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'The for unique things' },
      { phrase: '___ elephant', noun: 'elephant', answer: 'an', options: ['a', 'an', 'the', 'some'], explanation: 'An before vowel sound' },
      { phrase: '___ useful tool', noun: 'useful tool', answer: 'a', options: ['a', 'an', 'the', 'some'], explanation: 'Useful starts with consonant sound' },
      { phrase: '___ one-dollar bill', noun: 'one-dollar bill', answer: 'a', options: ['a', 'an', 'the', 'some'], explanation: 'One starts with consonant sound' },
      { phrase: '___ eggs', noun: 'eggs', answer: 'some', options: ['a', 'an', 'the', 'some'], explanation: 'Some for plural' },
      { phrase: '___ same thing', noun: 'same thing', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'The same is a fixed expression' },
      { phrase: '___ only chance', noun: 'only chance', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'The only' },
      { phrase: '___ best option', noun: 'best option', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'Superlative uses "the"' },
      { phrase: '___ umbrella', noun: 'umbrella', answer: 'an', options: ['a', 'an', 'the', 'some'], explanation: 'An before vowel sound' },
      { phrase: '___ European country', noun: 'European country', answer: 'a', options: ['a', 'an', 'the', 'some'], explanation: 'European starts with consonant sound' },
      { phrase: '___ orange', noun: 'orange', answer: 'an', options: ['a', 'an', 'the', 'some'], explanation: 'An before vowel sound' },
      { phrase: '___ Pacific Ocean', noun: 'Pacific Ocean', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'Oceans use "the"' },
      { phrase: '___ United States', noun: 'United States', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'Countries with plural names use "the"' },
      { phrase: '___ air we breathe', noun: 'air we breathe', answer: 'the', options: ['a', 'an', 'the', 'some'], explanation: 'The for specific things' },
      { phrase: '___ ice cream', noun: 'ice cream', answer: 'some', options: ['a', 'an', 'the', 'some'], explanation: 'Some for uncountable' },
    ]
    const englishPunctuationBanks: Array<{ sentence: string; answer: string; options: string[]; explanation: string }> = [
      { sentence: 'How are you___', answer: '?', options: ['.', '?', '!', ','], explanation: 'Question mark for questions' },
      { sentence: 'I am happy___', answer: '.', options: ['.', '?', '!', ','], explanation: 'Period for statements' },
      { sentence: 'What a beautiful day___', answer: '!', options: ['.', '?', '!', ','], explanation: 'Exclamation for excitement' },
      { sentence: 'I like apples___ bananas___ and oranges.', answer: ',', options: [',', 'and', ';', '.'], explanation: 'Commas in lists' },
      { sentence: 'He said___ I will come.', answer: ':"', options: [':"', ':', ',', '"'], explanation: 'Quotes for speech' },
      { sentence: 'Hello___ how are you___', answer: ',', options: [',', '.', '!', '?'], explanation: 'Comma after greeting' },
      { sentence: 'Please sit down___', answer: '.', options: ['.', '!', '?', ','], explanation: 'Polite request with period' },
      { sentence: 'Wow___ that is amazing___', answer: '!', options: ['!', '.', '?', ','], explanation: 'Exclamation for amazement' },
      { sentence: 'She is smart___ kind___ and funny.', answer: ',', options: [',', ';', '.', '!'], explanation: 'Commas in serial list' },
      { sentence: 'Yes___ I agree.', answer: ',', options: [',', '.', '!', '?'], explanation: 'Comma after yes' },
      { sentence: 'I went to the store___ I bought some milk.', answer: ', and', options: [', and', '. and', '; and', ' and'], explanation: 'Comma before conjunction' },
      { sentence: 'Wait___ I am not ready___', answer: ',', options: [',', '.', '!', '?'], explanation: 'Comma for imperative mood' },
      { sentence: 'Help me___', answer: '!', options: ['.', '!', '?', ','], explanation: 'Exclamation for urgent help' },
      { sentence: 'Do you know the time___', answer: '?', options: ['.', '?', '!', ','], explanation: 'Question mark for question' },
      { sentence: 'She asked___ Where are you going___', answer: ',', options: [',', '.', '!', '?'], explanation: 'Comma before quoted question' },
      { sentence: 'The meeting is at 3___00 PM.', answer: ':', options: [':', ',', '.', ';'], explanation: 'Colon in time' },
      { sentence: 'Dear Sir___', answer: ',', options: [',', ':', '.', '!'], explanation: 'Comma in letter salutation' },
      { sentence: 'It was raining___ however___ we went out.', answer: ';', options: [';', ',', '.', '--'], explanation: 'Semicolon with conjunctive adverb' },
      { sentence: 'I have one goal___ to succeed.', answer: ':', options: [':', ',', ';', '.'], explanation: 'Colon for explanation' },
      { sentence: 'He is a doctor___ she is a lawyer.', answer: ', and', options: [', and', '. and', '; and', ' and'], explanation: 'Comma in compound sentence' },
      { sentence: 'The baby___ who was crying___ finally fell asleep.', answer: ',', options: [',', '.', ';', '--'], explanation: 'Commas for non-restrictive clause' },
      { sentence: 'I studied hard___ I passed the test.', answer: ', so', options: [', so', '. so', '; so', ' so'], explanation: 'Comma with result conjunction' },
      { sentence: 'Whatever you say___', answer: '.', options: ['.', '?', '!', ','], explanation: 'Period for statement' },
      { sentence: 'Would you like tea or coffee___', answer: '?', options: ['.', '?', '!', ','], explanation: 'Question mark for choice question' },
      { sentence: 'Come here___', answer: '!', options: ['.', '!', '?', ','], explanation: 'Exclamation for command' },
      { sentence: 'She sings___ dances___ and paints.', answer: ',', options: [',', ';', '.', '!'], explanation: 'Commas in verb list' },
      { sentence: 'First___ we need to plan.', answer: ',', options: [',', ':', '.', ';'], explanation: 'Comma after introductory word' },
      { sentence: 'In conclusion___ the results are positive.', answer: ',', options: [',', ':', '.', ';'], explanation: 'Comma after introductory phrase' },
      { sentence: 'He is tall___ dark___ and handsome.', answer: ',', options: [',', ';', '.', '--'], explanation: 'Commas in adjective list' },
      { sentence: 'Oh no___ I forgot my keys___', answer: '!', options: ['!', '.', '?', ','], explanation: 'Exclamation for distress' },
    ]

    const bankMap: Record<string, any[]> = {
      PINYIN_TO_WORDS: englishSpellingBanks,
      SYNONYMS: englishSynonymBanks,
      ANTONYMS: englishAntonymBanks,
      IDIOMS: englishIdiomBanks,
      WORD_COLLOCATION: englishCollocationBanks,
      FILL_IN_BLANK: englishFillBlankBanks,
      QUANTIFIERS: englishDeterminerBanks,
      PUNCTUATION: englishPunctuationBanks,
    }
    const bank = bankMap[type] || []
    const offset = (level - 1) * 10 % bank.length
    for (let i = 0; i < 30; i++) {
      const idx = (offset + i) % bank.length
      const item = bank[idx]
      if (type === 'PINYIN_TO_WORDS') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ pinyin: item.word.split('').join('-'), hint: item.hint }),
          answer: item.word,
          explanation: `${item.word} means ${item.hint}`,
          difficulty: diff,
        })
      } else if (type === 'SYNONYMS' || type === 'ANTONYMS') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ word: item.word, options: item.options }),
          answer: item.answer,
          explanation: `${item.word} and ${item.answer} are ${type === 'SYNONYMS' ? 'synonyms' : 'antonyms'}`,
          difficulty: diff,
        })
      } else if (type === 'IDIOMS') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ idiom: item.idiom, options: item.options }),
          answer: item.answer,
          explanation: `"${item.explanation}"`,
          difficulty: diff,
        })
      } else if (type === 'WORD_COLLOCATION') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ phrase: item.phrase, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      } else if (type === 'FILL_IN_BLANK') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ sentence: item.sentence, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      } else if (type === 'QUANTIFIERS') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ phrase: item.phrase, noun: item.noun, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      } else if (type === 'PUNCTUATION') {
        questions.push({
          order: i + 1,
          question: JSON.stringify({ sentence: item.sentence, options: item.options }),
          answer: item.answer,
          explanation: item.explanation,
          difficulty: diff,
        })
      }
    }
  }
  return questions
}

// 生成专项训练配置
const TRAINING_TYPES = ['PINYIN_TO_WORDS', 'SYNONYMS', 'ANTONYMS', 'IDIOMS', 'WORD_COLLOCATION', 'FILL_IN_BLANK', 'QUANTIFIERS', 'PUNCTUATION'] as const
const LANGUAGES = ['Chinese', 'English'] as const

// 标题映射
const chineseTypeTitles: Record<string, string> = {
  PINYIN_TO_WORDS: '看拼音写词语',
  SYNONYMS: '近义词练习',
  ANTONYMS: '反义词练习',
  IDIOMS: '成语积累',
  WORD_COLLOCATION: '词语搭配',
  FILL_IN_BLANK: '选词填空',
  QUANTIFIERS: '量词使用',
  PUNCTUATION: '标点用法',
}
const englishTypeTitles: Record<string, string> = {
  PINYIN_TO_WORDS: 'Spelling Practice',
  SYNONYMS: 'Synonyms Practice',
  ANTONYMS: 'Antonyms Practice',
  IDIOMS: 'Idioms Practice',
  WORD_COLLOCATION: 'Word Collocation',
  FILL_IN_BLANK: 'Fill in the Blank',
  QUANTIFIERS: 'Determiners',
  PUNCTUATION: 'Punctuation',
}
const chineseTypeDescriptions: Record<string, string> = {
  PINYIN_TO_WORDS: '通过拼音练习书写中文词语',
  SYNONYMS: '选择与给定词语意思相近的词',
  ANTONYMS: '选择与给定词语意思相反的词',
  IDIOMS: '学习常用成语',
  WORD_COLLOCATION: '选择正确的词语搭配',
  FILL_IN_BLANK: '选择合适的词语填入空格',
  QUANTIFIERS: '选择正确的量词',
  PUNCTUATION: '选择正确的标点符号',
}
const englishTypeDescriptions: Record<string, string> = {
  PINYIN_TO_WORDS: 'Practice English spelling with hints',
  SYNONYMS: 'Choose words with similar meanings',
  ANTONYMS: 'Choose words with opposite meanings',
  IDIOMS: 'Learn common English idioms',
  WORD_COLLOCATION: 'Choose correct word combinations',
  FILL_IN_BLANK: 'Choose the correct word for the blank',
  QUANTIFIERS: 'Choose the correct determiner',
  PUNCTUATION: 'Choose the correct punctuation',
}

const levelSuffix: Record<number, string> = {
  1: '（入门）',
  2: '（进阶）',
  3: '（高阶）',
}
const levelSuffixEn: Record<number, string> = {
  1: '(Beginner)',
  2: '(Intermediate)',
  3: '(Advanced)',
}

const specialTrainings: Array<{
  type: string
  language: string
  level: number
  title: string
  description: string
  questions: Array<{ order: number; question: string; answer: string; explanation: string; difficulty: number }>
}> = []

for (const lang of LANGUAGES) {
  const titles = lang === 'Chinese' ? chineseTypeTitles : englishTypeTitles
  const descs = lang === 'Chinese' ? chineseTypeDescriptions : englishTypeDescriptions
  const suffix = lang === 'Chinese' ? levelSuffix : levelSuffixEn
  for (const type of TRAINING_TYPES) {
    for (let level = 1; level <= 3; level++) {
      const title = lang === 'Chinese'
        ? `${titles[type]}${suffix[level]}`
        : `${titles[type]} ${suffix[level]}`
      const description = descs[type]
      specialTrainings.push({
        type,
        language: lang,
        level,
        title,
        description,
        questions: generateQuestions(type, lang, level),
      })
    }
  }
}

const courses = [
  // 初级英语课程
  {
    title: '英语基础入门',
    description: '从零开始学习英语，掌握基础词汇和日常对话',
    language: 'English',
    level: 1,
    category: 'Vocabulary',
    duration: 30,
    lessons: [
      {
        title: '问候与自我介绍',
        content: '学习基本问候语和自我介绍表达',
        order: 1,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'Good morning', options: ['晚安', '早上好', '晚上好', '下午好'], answer: '早上好', feedback: '"Good morning" 的中文意思是 "早上好"' },
          { type: 'choice', question: 'Hello', options: ['再见', '你好', '谢谢', '对不起'], answer: '你好', feedback: '"Hello" 的中文意思是 "你好"' },
        ],
      },
      {
        title: '数字与时间',
        content: '学习英语数字表达和时间表达',
        order: 2,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'seven', options: ['四', '五', '六', '七'], answer: '七', feedback: '"seven" 的中文意思是 "七"' },
          { type: 'choice', question: 'three thirty', options: ['三点', '三点半', '两点半', '四点'], answer: '三点半', feedback: '"three thirty" 的中文意思是 "三点半"' },
        ],
      },
    ],
  },
  {
    title: '英语语法基础',
    description: '学习英语基本语法规则',
    language: 'English',
    level: 1,
    category: 'Grammar',
    duration: 45,
    lessons: [
      {
        title: '名词与冠词',
        content: '学习名词的单复数和冠词的使用',
        order: 1,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'I have ____ apple.', options: ['a', 'an', 'the', '/'], answer: 'an', feedback: 'Use "an" before vowels' },
          { type: 'choice', question: 'The ____ are playing in the park.', options: ['child', 'children', 'childs', 'childes'], answer: 'children', feedback: 'Plural of "child" is "children"' },
        ],
      },
      {
        title: '动词时态',
        content: '学习一般现在时和现在进行时',
        order: 2,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'She ____ to school every day.', options: ['go', 'goes', 'going', 'went'], answer: 'goes', feedback: 'Third person singular needs "s"' },
          { type: 'choice', question: 'They ____ basketball now.', options: ['play', 'plays', 'playing', 'are playing'], answer: 'are playing', feedback: 'Use present continuous for actions happening now' },
        ],
      },
    ],
  },
  {
    title: '英语口语入门',
    description: '学习简单的英语口语表达',
    language: 'English',
    level: 1,
    category: 'Speaking',
    duration: 40,
    lessons: [
      {
        title: '日常问候',
        content: '学习日常打招呼和简单对话',
        order: 1,
        type: 'speaking',
        exercises: [
          { type: 'choice', question: 'How are you?', options: ['你多大了？', '你好吗？', '你去哪？', '你做什么？'], answer: '你好吗？', feedback: '"How are you?" 是问"你好吗？"' },
          { type: 'choice', question: 'Nice to meet you', options: ['很高兴见到你', '再见', '谢谢', '对不起'], answer: '很高兴见到你', feedback: '"Nice to meet you" 意思是"很高兴见到你"' },
        ],
      },
    ],
  },
  // 中级英语课程
  {
    title: '英语中级词汇',
    description: '学习更丰富的英语词汇和短语',
    language: 'English',
    level: 2,
    category: 'Vocabulary',
    duration: 50,
    lessons: [
      {
        title: '职业与工作',
        content: '学习各种职业和工作相关的词汇',
        order: 1,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'engineer', options: ['医生', '工程师', '教师', '律师'], answer: '工程师', feedback: '"engineer" 是"工程师"' },
          { type: 'choice', question: 'manager', options: ['员工', '经理', '老板', '客户'], answer: '经理', feedback: '"manager" 是"经理"' },
        ],
      },
      {
        title: '情感与表达',
        content: '学习表达情感和心情的词汇',
        order: 2,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'excited', options: ['难过的', '兴奋的', '生气的', '害怕的'], answer: '兴奋的', feedback: '"excited" 是"兴奋的"' },
          { type: 'choice', question: 'worried', options: ['开心的', '担心的', '累的', '饿的'], answer: '担心的', feedback: '"worried" 是"担心的"' },
        ],
      },
    ],
  },
  {
    title: '英语中级语法',
    description: '深入学习英语语法知识',
    language: 'English',
    level: 2,
    category: 'Grammar',
    duration: 60,
    lessons: [
      {
        title: '过去时态',
        content: '学习一般过去时和过去进行时',
        order: 1,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'I ____ to the park yesterday.', options: ['go', 'goes', 'went', 'going'], answer: 'went', feedback: 'Use past tense for yesterday' },
          { type: 'choice', question: 'What ____ you doing at 8 PM?', options: ['are', 'were', 'was', 'is'], answer: 'were', feedback: 'Use past continuous for specific time' },
        ],
      },
      {
        title: '比较级和最高级',
        content: '学习形容词和副词的比较等级',
        order: 2,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'This book is ____ than that one.', options: ['interesting', 'more interesting', 'most interesting', 'interestinger'], answer: 'more interesting', feedback: 'Use "more" for longer adjectives' },
          { type: 'choice', question: 'She is ____ student in the class.', options: ['smart', 'smarter', 'smartest', 'the smartest'], answer: 'the smartest', feedback: 'Use "the + -est" for superlative' },
        ],
      },
    ],
  },
  {
    title: '英语听力入门',
    description: '练习英语听力理解',
    language: 'English',
    level: 2,
    category: 'Listening',
    duration: 45,
    lessons: [
      {
        title: '听懂日常对话',
        content: '练习听懂简单的日常英语对话',
        order: 1,
        type: 'listening',
        exercises: [
          { type: 'choice', question: 'What is the weather like?', options: ['Sunny', 'Rainy', 'Cloudy', 'Snowy'], answer: 'Sunny', feedback: '天气很好，阳光明媚' },
        ],
      },
    ],
  },
  // 高级英语课程
  {
    title: '英语高级词汇',
    description: '学习高级英语词汇和成语',
    language: 'English',
    level: 3,
    category: 'Vocabulary',
    duration: 70,
    lessons: [
      {
        title: '商务英语词汇',
        content: '学习商务场景中使用的高级词汇',
        order: 1,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'negotiate', options: ['谈判', '购买', '销售', '生产'], answer: '谈判', feedback: '"negotiate" 是"谈判"' },
          { type: 'choice', question: 'investment', options: ['贷款', '投资', '储蓄', '保险'], answer: '投资', feedback: '"investment" 是"投资"' },
          { type: 'choice', question: 'acquisition', options: ['销售', '并购', '租赁', '投资'], answer: '并购', feedback: '"acquisition" 是"并购"' },
          { type: 'choice', question: 'liability', options: ['资产', '负债', '收入', '支出'], answer: '负债', feedback: '"liability" 是"负债"' },
          { type: 'choice', question: 'equity', options: ['债务', '股权', '利润', '成本'], answer: '股权', feedback: '"equity" 是"股权"' },
        ],
      },
      {
        title: '学术英语词汇',
        content: '学习学术写作和阅读所需的词汇',
        order: 2,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'hypothesis', options: ['结论', '假设', '数据', '方法'], answer: '假设', feedback: '"hypothesis" 是"假设"' },
          { type: 'choice', question: 'analysis', options: ['综合', '分析', '推理', '判断'], answer: '分析', feedback: '"analysis" 是"分析"' },
          { type: 'choice', question: 'methodology', options: ['方法学', '理论', '实践', '结果'], answer: '方法学', feedback: '"methodology" 是"方法学"' },
          { type: 'choice', question: 'paradigm', options: ['例子', '范式', '模型', '类型'], answer: '范式', feedback: '"paradigm" 是"范式"' },
          { type: 'choice', question: 'empirical', options: ['理论的', '经验的', '假设的', '抽象的'], answer: '经验的', feedback: '"empirical" 是"经验的"' },
        ],
      },
      {
        title: '英语成语和俚语',
        content: '学习常用的英语成语和俚语',
        order: 3,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'break the ice', options: ['打破冰', '打破僵局', '破冰而出', '破坏气氛'], answer: '打破僵局', feedback: '"break the ice" 意思是"打破僵局"' },
          { type: 'choice', question: 'piece of cake', options: ['一块蛋糕', '小菜一碟', '困难的事', '重要的事'], answer: '小菜一碟', feedback: '"piece of cake" 意思是"小菜一碟"' },
          { type: 'choice', question: 'hit the nail on the head', options: ['击打头部', '击中要害', '敲钉子', '犯错'], answer: '击中要害', feedback: '"hit the nail on the head" 意思是"击中要害"' },
          { type: 'choice', question: 'cost an arm and a leg', options: ['花费手脚', '非常昂贵', '付出代价', '免费'], answer: '非常昂贵', feedback: '"cost an arm and a leg" 意思是"非常昂贵"' },
          { type: 'choice', question: 'once in a blue moon', options: ['每月一次', '千载难逢', '蓝色月亮', '经常'], answer: '千载难逢', feedback: '"once in a blue moon" 意思是"千载难逢"' },
        ],
      },
    ],
  },
  {
    title: '英语高级语法',
    description: '学习复杂的英语语法结构',
    language: 'English',
    level: 3,
    category: 'Grammar',
    duration: 80,
    lessons: [
      {
        title: '虚拟语气',
        content: '学习虚拟条件句的用法',
        order: 1,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'If I ____ you, I would study harder.', options: ['am', 'was', 'were', 'be'], answer: 'were', feedback: 'Use "were" for subjunctive mood' },
          { type: 'choice', question: 'I wish I ____ more time.', options: ['have', 'had', 'has', 'having'], answer: 'had', feedback: 'Use past tense for wishes' },
          { type: 'choice', question: 'It is essential that he ____ there on time.', options: ['arrives', 'arrive', 'arrived', 'arriving'], answer: 'arrive', feedback: 'Use base form in that-clauses after "essential"' },
          { type: 'choice', question: 'If only I ____ the answer.', options: ['know', 'knew', 'knows', 'knowing'], answer: 'knew', feedback: 'Use past tense for "If only"' },
        ],
      },
      {
        title: '倒装结构',
        content: '学习英语中的倒装句式',
        order: 2,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'Not only ____ good at English, but also at math.', options: ['she is', 'is she', 'she was', 'was she'], answer: 'is she', feedback: 'Invert after "Not only"' },
          { type: 'choice', question: 'Rarely ____ such a beautiful sunset.', options: ['I have seen', 'have I seen', 'I saw', 'saw I'], answer: 'have I seen', feedback: 'Invert after "Rarely"' },
          { type: 'choice', question: 'Only then ____ how serious the problem was.', options: ['I realized', 'did I realize', 'realize I', 'I realize'], answer: 'did I realize', feedback: 'Invert after "Only then"' },
          { type: 'choice', question: 'Under no circumstances ____ late.', options: ['you should be', 'should you be', 'you be', 'be you'], answer: 'should you be', feedback: 'Invert after "Under no circumstances"' },
        ],
      },
      {
        title: '分词和独立主格结构',
        content: '学习现在分词、过去分词和独立主格结构',
        order: 3,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '____ from the hill, the city looks beautiful.', options: ['Seeing', 'Seen', 'To see', 'See'], answer: 'Seen', feedback: 'Use past participle for passive meaning' },
          { type: 'choice', question: '____ the work, he went home.', options: ['Finished', 'Having finished', 'To finish', 'Finish'], answer: 'Having finished', feedback: 'Use perfect participle for completed action' },
          { type: 'choice', question: 'Weather ____, we will go hiking.', options: ['permits', 'permitted', 'permitting', 'to permit'], answer: 'permitting', feedback: 'Use present participle in absolute construction' },
        ],
      },
    ],
  },
  {
    title: '英语写作高级',
    description: '学习高级英语写作技巧',
    language: 'English',
    level: 3,
    category: 'Writing',
    duration: 90,
    lessons: [
      {
        title: '学术论文写作',
        content: '学习如何写好学术论文',
        order: 1,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '论文的开头应该包含什么？', options: ['结论', '引言', '参考文献', '附录'], answer: '引言', feedback: '论文开头应该包含引言' },
          { type: 'choice', question: '文献综述的目的是什么？', options: ['列出所有书籍', '总结和评价相关研究', '抄袭他人', '增加页数'], answer: '总结和评价相关研究', feedback: '文献综述需要总结和评价相关研究' },
          { type: 'choice', question: 'APA格式中，参考文献的作者姓名应该如何排列？', options: ['姓在前，名首字母在后', '名在前，姓在后', '全部大写', '全部小写'], answer: '姓在前，名首字母在后', feedback: 'APA格式要求姓在前，名首字母在后' },
        ],
      },
      {
        title: '商务邮件写作',
        content: '学习专业的商务邮件写作',
        order: 2,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '正式商务邮件的主题应该是？', options: ['模糊不清', '具体明确', '非常长', '使用表情符号'], answer: '具体明确', feedback: '邮件主题应该具体明确' },
          { type: 'choice', question: '商务邮件的结尾应该使用？', options: ['Best regards', 'Bye', 'See you', 'Yolo'], answer: 'Best regards', feedback: '"Best regards" 是正式的商务邮件结尾' },
          { type: 'choice', question: '在商务邮件中，最重要的是什么？', options: ['使用复杂词汇', '清晰简洁', '写很长的邮件', '使用很多颜色'], answer: '清晰简洁', feedback: '商务邮件最重要的是清晰简洁' },
        ],
      },
      {
        title: '辩论性文章写作',
        content: '学习如何写有说服力的辩论文章',
        order: 3,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '辩论文章的第一段应该包含？', options: ['所有证据', '中心论点', '结论', '个人故事'], answer: '中心论点', feedback: '第一段应该陈述中心论点' },
          { type: 'choice', question: '在辩论文章中，引用权威来源是为了？', options: ['增加字数', '增强说服力', '显示知识', '让文章更长'], answer: '增强说服力', feedback: '引用权威来源可以增强说服力' },
          { type: 'choice', question: '反驳对方观点时应该？', options: ['忽略它们', '尊重地回应', '嘲笑它们', '直接跳过'], answer: '尊重地回应', feedback: '应该尊重地回应对方观点' },
        ],
      },
    ],
  },
  // 初级中文课程
  {
    title: '中文基础入门',
    description: '从零开始学习中文，掌握基础汉字和日常对话',
    language: 'Chinese',
    level: 1,
    category: 'Vocabulary',
    duration: 30,
    lessons: [
      {
        title: '问候与自我介绍',
        content: '学习基本问候语和自我介绍表达',
        order: 1,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '早上见面应该说什么？', options: ['晚安', '早上好', '晚上好', '下午好'], answer: '早上好', feedback: '早上问候应该说"早上好"' },
          { type: 'choice', question: '"你好"是什么意思？', options: ['Goodbye', 'Hello', 'Thank you', 'Sorry'], answer: 'Hello', feedback: '"你好" means Hello in English' },
        ],
      },
      {
        title: '数字与时间',
        content: '学习中文数字表达和时间表达',
        order: 2,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '"5"用中文怎么说？', options: ['四', '五', '六', '七'], answer: '五', feedback: '5 is "五" in Chinese' },
          { type: 'choice', question: '"下午2点"英文是:', options: ['2 AM', '2 PM', '14:00', 'two oclock'], answer: '2 PM', feedback: '下午2点 is "2 PM" in English' },
        ],
      },
    ],
  },
  {
    title: '中文语法基础',
    description: '学习中文基本语法规则',
    language: 'Chinese',
    level: 1,
    category: 'Grammar',
    duration: 45,
    lessons: [
      {
        title: '名词与量词',
        content: '学习中文名词和量词的搭配',
        order: 1,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '一____书', options: ['个', '本', '只', '条'], answer: '本', feedback: '书的量词是"本"' },
          { type: 'choice', question: '一____笔', options: ['本', '支', '个', '张'], answer: '支', feedback: '笔的量词是"支"' },
        ],
      },
      {
        title: '动词与形容词',
        content: '学习中文动词和形容词的用法',
        order: 2,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '我____饭。', options: ['吃', '喝', '看', '写'], answer: '吃', feedback: '吃饭 means to eat' },
          { type: 'choice', question: '这个苹果很____。', options: ['快乐', '漂亮', '甜', '快'], answer: '甜', feedback: '苹果应该用"甜"来形容' },
        ],
      },
    ],
  },
  {
    title: '中文口语入门',
    description: '学习简单的中文口语表达',
    language: 'Chinese',
    level: 1,
    category: 'Speaking',
    duration: 40,
    lessons: [
      {
        title: '点餐用语',
        content: '学习在餐厅点餐的基本用语',
        order: 1,
        type: 'speaking',
        exercises: [
          { type: 'choice', question: '服务员，我要____。', options: ['买单', '点菜', '打包', '预约'], answer: '点菜', feedback: '点餐时说"点菜"' },
          { type: 'choice', question: '这个菜很____。', options: ['贵', '好吃', '辣', '咸'], answer: '好吃', feedback: '可以说菜"好吃"' },
        ],
      },
    ],
  },
  // 中级中文课程
  {
    title: '中文中级词汇',
    description: '学习更丰富的中文词汇和短语',
    language: 'Chinese',
    level: 2,
    category: 'Vocabulary',
    duration: 50,
    lessons: [
      {
        title: '旅行与交通',
        content: '学习旅行和交通相关的词汇',
        order: 1,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '机场', options: ['airport', 'station', 'bus stop', 'harbor'], answer: 'airport', feedback: '"机场" is "airport"' },
          { type: 'choice', question: '火车票', options: ['bus ticket', 'train ticket', 'plane ticket', 'subway ticket'], answer: 'train ticket', feedback: '"火车票" is "train ticket"' },
        ],
      },
      {
        title: '购物与价格',
        content: '学习购物和询问价格的词汇',
        order: 2,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '这个多少钱？', options: ['How much is this?', 'What is this?', 'Where is this?', 'How is this?'], answer: 'How much is this?', feedback: '询问价格用"How much is this?"' },
          { type: 'choice', question: '便宜', options: ['expensive', 'cheap', 'good', 'bad'], answer: 'cheap', feedback: '"便宜" is "cheap"' },
        ],
      },
    ],
  },
  {
    title: '中文中级语法',
    description: '深入学习中文语法知识',
    language: 'Chinese',
    level: 2,
    category: 'Grammar',
    duration: 60,
    lessons: [
      {
        title: '把字句和被字句',
        content: '学习把字句和被字句的用法',
        order: 1,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '我____书看完了。', options: ['把', '被', '让', '给'], answer: '把', feedback: '用把字句表示主动动作' },
          { type: 'choice', question: '杯子____打碎了。', options: ['把', '被', '让', '给'], answer: '被', feedback: '用被字句表示被动' },
        ],
      },
      {
        title: '补语结构',
        content: '学习结果补语和状态补语',
        order: 2,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '我听____了。', options: ['清楚', '明白', '到', '见'], answer: '清楚', feedback: '"听清楚了"是正确的表达' },
        ],
      },
    ],
  },
  {
    title: '中文听力入门',
    description: '练习中文听力理解',
    language: 'Chinese',
    level: 2,
    category: 'Listening',
    duration: 45,
    lessons: [
      {
        title: '听懂天气预报',
        content: '练习听懂中文天气预报',
        order: 1,
        type: 'listening',
        exercises: [
          { type: 'choice', question: '明天天气怎么样？', options: ['晴天', '下雨', '多云', '下雪'], answer: '晴天', feedback: '明天是晴天' },
        ],
      },
    ],
  },
  // 高级中文课程
  {
    title: '中文高级词汇',
    description: '学习高级中文词汇和成语',
    language: 'Chinese',
    level: 3,
    category: 'Vocabulary',
    duration: 70,
    lessons: [
      {
        title: '成语学习',
        content: '学习常用的中文成语',
        order: 1,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '一举两得', options: ['做一件事得到两种收获', '两个动作一起做', '两次成功', '两个好处'], answer: '做一件事得到两种收获', feedback: '"一举两得"指做一件事得到两种收获' },
          { type: 'choice', question: '守株待兔', options: ['积极努力', '坐等机会', '勤劳工作', '快速行动'], answer: '坐等机会', feedback: '"守株待兔"比喻坐等机会' },
          { type: 'choice', question: '破釜沉舟', options: ['打破锅碗', '下定决心', '破坏东西', '沉船'], answer: '下定决心', feedback: '"破釜沉舟"比喻下定决心，不顾一切' },
          { type: 'choice', question: '卧薪尝胆', options: ['睡在柴火上', '刻苦自励', '吃胆', '休息'], answer: '刻苦自励', feedback: '"卧薪尝胆"形容刻苦自励，发愤图强' },
          { type: 'choice', question: '画蛇添足', options: ['画蛇加脚', '多此一举', '画画', '添加'], answer: '多此一举', feedback: '"画蛇添足"比喻做了多余的事，反而不合适' },
        ],
      },
      {
        title: '书面语词汇',
        content: '学习正式书面语中的高级词汇',
        order: 2,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '综上所述', options: ['In conclusion', 'In addition', 'For example', 'However'], answer: 'In conclusion', feedback: '"综上所述" is "In conclusion"' },
          { type: 'choice', question: '鉴于此', options: ['Because of this', 'In addition', 'For example', 'However'], answer: 'Because of this', feedback: '"鉴于此" is "Because of this"' },
          { type: 'choice', question: '毋庸讳言', options: ['No need to say', 'Needless to say', 'Say nothing', 'Speak freely'], answer: 'Needless to say', feedback: '"毋庸讳言" is "Needless to say"' },
          { type: 'choice', question: '举足轻重', options: ['Very important', 'Light', 'Heavy', 'Not important'], answer: 'Very important', feedback: '"举足轻重"形容处于重要地位' },
          { type: 'choice', question: '相得益彰', options: ['互相配合，更显美好', '互相冲突', '互相帮助', '互相学习'], answer: '互相配合，更显美好', feedback: '"相得益彰"指互相配合，双方的能力和作用更能显示出来' },
        ],
      },
      {
        title: '文言文词汇',
        content: '学习常见的文言文词汇和表达',
        order: 3,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '吾', options: ['你', '我', '他', '我们'], answer: '我', feedback: '"吾"在文言文中指"我"' },
          { type: 'choice', question: '汝', options: ['你', '我', '他', '她'], answer: '你', feedback: '"汝"在文言文中指"你"' },
          { type: 'choice', question: '其', options: ['其中的，他的', '其他的', '其实', '其次'], answer: '其中的，他的', feedback: '"其"在文言文中可表示"其中的"或"他的"' },
          { type: 'choice', question: '乃', options: ['是，于是', '不是', '可能', '也许'], answer: '是，于是', feedback: '"乃"在文言文中可表示"是"或"于是"' },
          { type: 'choice', question: '哉', options: ['语气词，表示感叹', '好的', '在', '有'], answer: '语气词，表示感叹', feedback: '"哉"是语气词，表示感叹或反问' },
        ],
      },
    ],
  },
  {
    title: '中文高级语法',
    description: '学习复杂的中文语法结构',
    language: 'Chinese',
    level: 3,
    category: 'Grammar',
    duration: 80,
    lessons: [
      {
        title: '复句结构',
        content: '学习因果、转折、假设等复句',
        order: 1,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '____下雨了，我们不去了。', options: ['虽然', '因为', '如果', '即使'], answer: '因为', feedback: '因果关系用"因为"' },
          { type: 'choice', question: '____他很聪明，____不努力。', options: ['因为...所以', '虽然...但是', '如果...就', '不但...而且'], answer: '虽然...但是', feedback: '转折关系用"虽然...但是"' },
          { type: 'choice', question: '____明天下雨，我们____不去爬山。', options: ['虽然...但是', '如果...就', '因为...所以', '不但...而且'], answer: '如果...就', feedback: '假设关系用"如果...就"' },
          { type: 'choice', question: '他____会说英语，____会说法语。', options: ['虽然...但是', '不但...而且', '因为...所以', '如果...就'], answer: '不但...而且', feedback: '递进关系用"不但...而且"' },
          { type: 'choice', question: '____遇到多大的困难，我们____要坚持到底。', options: ['虽然...但是', '无论...都', '因为...所以', '如果...就'], answer: '无论...都', feedback: '条件关系用"无论...都"' },
        ],
      },
      {
        title: '特殊句式',
        content: '学习把字句、被字句、连动句等特殊句式',
        order: 2,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '请把书____给我。', options: ['递', '递过来', '递给', '递给来'], answer: '递过来', feedback: '趋向补语"过来"表示动作朝向说话人' },
          { type: 'choice', question: '杯子____他打碎了。', options: ['把', '被', '让', '给'], answer: '被', feedback: '被动句用"被"' },
          { type: 'choice', question: '他____出去散步了。', options: ['走', '走了', '走去', '走着'], answer: '走了', feedback: '动态助词"了"表示动作完成' },
          { type: 'choice', question: '我每天____跑步锻炼身体。', options: ['去', '去了', '来', '来了'], answer: '去', feedback: '连动句表示连续的动作' },
        ],
      },
      {
        title: '修辞方法',
        content: '学习比喻、拟人、排比、夸张等修辞方法',
        order: 3,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '"月光像流水一样"使用了什么修辞？', options: ['拟人', '比喻', '排比', '夸张'], answer: '比喻', feedback: '用"像"表示比喻' },
          { type: 'choice', question: '"花儿在风中笑弯了腰"使用了什么修辞？', options: ['比喻', '拟人', '排比', '夸张'], answer: '拟人', feedback: '把物当作人写是拟人' },
          { type: 'choice', question: '"这山真高啊，直插云霄"使用了什么修辞？', options: ['比喻', '拟人', '排比', '夸张'], answer: '夸张', feedback: '夸大事实是夸张' },
          { type: 'choice', question: '"学习是灯，照亮前行的路；学习是桥，连接理想的彼岸；学习是船，驶向成功的港湾"使用了什么修辞？', options: ['比喻', '排比', '拟人', '夸张'], answer: '排比', feedback: '三个以上结构相似的句子是排比' },
        ],
      },
    ],
  },
  {
    title: '中文写作高级',
    description: '学习高级中文写作技巧',
    language: 'Chinese',
    level: 3,
    category: 'Writing',
    duration: 90,
    lessons: [
      {
        title: '议论文写作',
        content: '学习如何写好议论文',
        order: 1,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '议论文的三要素不包括：', options: ['论点', '论据', '论证', '抒情'], answer: '抒情', feedback: '议论文三要素是论点、论据、论证' },
          { type: 'choice', question: '议论文的论点应该是？', options: ['模糊不清', '明确具体', '情绪化', '自相矛盾'], answer: '明确具体', feedback: '论点应该明确具体' },
          { type: 'choice', question: '议论文的论据应该是？', options: ['个人意见', '真实可靠', '道听途说', '虚构的'], answer: '真实可靠', feedback: '论据应该真实可靠' },
          { type: 'choice', question: '议论文的结构通常是？', options: ['引言-本论-结论', '开头-中间-结尾', '起因-经过-结果', '随便组织'], answer: '引言-本论-结论', feedback: '议论文通常采用引言-本论-结论结构' },
        ],
      },
      {
        title: '散文写作',
        content: '学习散文的写作技巧',
        order: 2,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '散文的特点是？', options: ['形散神不散', '结构严谨', '情节曲折', '人物众多'], answer: '形散神不散', feedback: '散文形散神不散' },
          { type: 'choice', question: '散文的语言应该？', options: ['华丽但空洞', '生动优美', '平淡无奇', '晦涩难懂'], answer: '生动优美', feedback: '散文语言应该生动优美' },
          { type: 'choice', question: '散文的主题应该？', options: ['不明确', '集中深刻', '广泛多样', '随意变化'], answer: '集中深刻', feedback: '散文主题应该集中深刻' },
        ],
      },
      {
        title: '应用文写作',
        content: '学习各类应用文的写作',
        order: 3,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '正式书信的开头应该写？', options: ['随便打招呼', '尊敬的称呼', '直接说事', '结尾问候'], answer: '尊敬的称呼', feedback: '正式书信开头用尊敬的称呼' },
          { type: 'choice', question: '报告的特点是？', options: ['虚构', '真实客观', '情绪化', '个人观点'], answer: '真实客观', feedback: '报告应该真实客观' },
          { type: 'choice', question: '邀请函的内容应该包括？', options: ['随便说说', '时间、地点、事由', '只有时间', '只有地点'], answer: '时间、地点、事由', feedback: '邀请函需要说明时间、地点、事由' },
          { type: 'choice', question: '申请书的语言应该？', options: ['强硬', '诚恳礼貌', '随便', '命令式'], answer: '诚恳礼貌', feedback: '申请书语言应该诚恳礼貌' },
        ],
      },
    ],
  },
  // 专家级英语课程（level 4）
  {
    title: '英语专家级词汇',
    description: '学习专业领域的高级英语词汇和术语',
    language: 'English',
    level: 4,
    category: 'Vocabulary',
    duration: 100,
    lessons: [
      {
        title: '科技英语词汇',
        content: '学习科学和技术领域的高级词汇',
        order: 1,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'algorithm', options: ['算法', '代数', '几何', '统计'], answer: '算法', feedback: '"algorithm" 是"算法"' },
          { type: 'choice', question: 'cryptography', options: ['地理学', '密码学', '天文学', '生物学'], answer: '密码学', feedback: '"cryptography" 是"密码学"' },
          { type: 'choice', question: 'quantum', options: ['质量', '量子', '分子', '原子'], answer: '量子', feedback: '"quantum" 是"量子"' },
          { type: 'choice', question: 'nanotechnology', options: ['信息技术', '纳米技术', '生物技术', '太空技术'], answer: '纳米技术', feedback: '"nanotechnology" 是"纳米技术"' },
          { type: 'choice', question: 'artificial intelligence', options: ['智能机器人', '人工智能', '自动化', '机器学习'], answer: '人工智能', feedback: '"artificial intelligence" 是"人工智能"' },
        ],
      },
      {
        title: '医学英语词汇',
        content: '学习医学和健康领域的专业词汇',
        order: 2,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'cardiology', options: ['心理学', '心脏病学', '神经病学', '皮肤病学'], answer: '心脏病学', feedback: '"cardiology" 是"心脏病学"' },
          { type: 'choice', question: 'diagnosis', options: ['治疗', '诊断', '手术', '处方'], answer: '诊断', feedback: '"diagnosis" 是"诊断"' },
          { type: 'choice', question: 'pharmaceutical', options: ['医学的', '制药的', '手术的', '护理的'], answer: '制药的', feedback: '"pharmaceutical" 是"制药的"' },
          { type: 'choice', question: 'pediatrics', options: ['外科学', '内科学', '儿科学', '产科学'], answer: '儿科学', feedback: '"pediatrics" 是"儿科学"' },
        ],
      },
      {
        title: '法律英语词汇',
        content: '学习法律和司法领域的专业词汇',
        order: 3,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: 'jurisdiction', options: ['法律', '司法权', '律师', '法庭'], answer: '司法权', feedback: '"jurisdiction" 是"司法权"' },
          { type: 'choice', question: 'litigation', options: ['合同', '诉讼', '仲裁', '调解'], answer: '诉讼', feedback: '"litigation" 是"诉讼"' },
          { type: 'choice', question: 'liability', options: ['权利', '责任', '义务', '利益'], answer: '责任', feedback: '"liability" 是"责任"' },
          { type: 'choice', question: 'plaintiff', options: ['被告', '原告', '法官', '律师'], answer: '原告', feedback: '"plaintiff" 是"原告"' },
        ],
      },
    ],
  },
  {
    title: '英语专家级语法',
    description: '学习英语语法的高级用法和细微区别',
    language: 'English',
    level: 4,
    category: 'Grammar',
    duration: 110,
    lessons: [
      {
        title: '复杂句结构',
        content: '学习多层嵌套的复杂句结构',
        order: 1,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'The report, ____ was published yesterday, has caused much debate.', options: ['which', 'that', 'what', 'who'], answer: 'which', feedback: 'Use "which" for non-restrictive clauses' },
          { type: 'choice', question: 'He is the man ____ I think is the best candidate.', options: ['who', 'whom', 'which', 'whose'], answer: 'who', feedback: 'Use "who" as the subject of the clause' },
          { type: 'choice', question: '____ we have finished the project, we can take a break.', options: ['Now that', 'Because', 'Although', 'If'], answer: 'Now that', feedback: '"Now that" indicates cause and effect with recent completion' },
        ],
      },
      {
        title: '情态动词的细微区别',
        content: '学习情态动词在不同语境中的细微区别',
        order: 2,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'You ____ have told me about the meeting earlier.', options: ['should', 'would', 'could', 'might'], answer: 'should', feedback: '"Should have" expresses criticism of past action' },
          { type: 'choice', question: 'He ____ have finished the work by now.', options: ['must', 'should', 'would', 'could'], answer: 'must', feedback: '"Must have" expresses strong deduction' },
          { type: 'choice', question: '____ you like to join us for dinner?', options: ['Would', 'Will', 'Shall', 'Can'], answer: 'Would', feedback: '"Would you like" is a polite invitation' },
        ],
      },
      {
        title: '介词和搭配',
        content: '学习介词的固定搭配和习惯用法',
        order: 3,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: 'I am interested ____ learning more about this topic.', options: ['in', 'on', 'at', 'for'], answer: 'in', feedback: 'Interested is followed by "in"' },
          { type: 'choice', question: 'The book is different ____ what I expected.', options: ['from', 'to', 'than', 'with'], answer: 'from', feedback: 'Different is followed by "from"' },
          { type: 'choice', question: 'He is capable ____ completing the task.', options: ['of', 'to', 'for', 'in'], answer: 'of', feedback: 'Capable is followed by "of"' },
        ],
      },
    ],
  },
  {
    title: '英语专家级写作',
    description: '学习专业英语写作和学术发表',
    language: 'English',
    level: 4,
    category: 'Writing',
    duration: 120,
    lessons: [
      {
        title: '研究论文写作',
        content: '学习如何撰写高质量的研究论文',
        order: 1,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '论文摘要的目的是什么？', options: ['介绍作者', '概括整篇论文', '列出参考文献', '致谢'], answer: '概括整篇论文', feedback: '摘要需要概括整篇论文' },
          { type: 'choice', question: '论文的"方法"部分应该描述？', options: ['研究发现', '研究设计和过程', '研究结论', '研究背景'], answer: '研究设计和过程', feedback: '方法部分描述研究设计和过程' },
          { type: 'choice', question: '引用文献时，最重要的是？', options: ['引用越多越好', '准确和恰当', '只引用知名学者', '只引用最新文献'], answer: '准确和恰当', feedback: '引用文献要准确和恰当' },
        ],
      },
      {
        title: '专业报告写作',
        content: '学习如何撰写专业的商务和技术报告',
        order: 2,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '执行摘要应该放在报告的？', options: ['最前面', '中间', '最后', '附录'], answer: '最前面', feedback: '执行摘要应该放在报告最前面' },
          { type: 'choice', question: '技术报告中的图表应该？', options: ['没有必要', '清晰标注', '尽量复杂', '使用很多颜色'], answer: '清晰标注', feedback: '图表应该清晰标注' },
          { type: 'choice', question: '报告的建议部分应该？', options: ['模糊不清', '具体可行', '非常笼统', '不切实际'], answer: '具体可行', feedback: '建议应该具体可行' },
        ],
      },
    ],
  },
  // 专家级中文课程（level 4）
  {
    title: '中文专家级词汇',
    description: '学习专业领域的高级中文词汇和术语',
    language: 'Chinese',
    level: 4,
    category: 'Vocabulary',
    duration: 100,
    lessons: [
      {
        title: '科技中文词汇',
        content: '学习科学和技术领域的高级词汇',
        order: 1,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '人工智能', options: ['artificial intelligence', 'machine learning', 'deep learning', 'natural language processing'], answer: 'artificial intelligence', feedback: '"人工智能" is "artificial intelligence"' },
          { type: 'choice', question: '区块链', options: ['block chain', 'data chain', 'digital chain', 'computer chain'], answer: 'block chain', feedback: '"区块链" is "block chain"' },
          { type: 'choice', question: '基因编辑', options: ['gene editing', 'gene modification', 'DNA change', 'gene change'], answer: 'gene editing', feedback: '"基因编辑" is "gene editing"' },
          { type: 'choice', question: '航天技术', options: ['space technology', 'air technology', 'rocket technology', 'satellite technology'], answer: 'space technology', feedback: '"航天技术" is "space technology"' },
        ],
      },
      {
        title: '医学中文词汇',
        content: '学习医学和健康领域的专业词汇',
        order: 2,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '心血管', options: ['heart and blood vessels', 'heart and lungs', 'blood and nerves', 'heart and brain'], answer: 'heart and blood vessels', feedback: '"心血管" refers to heart and blood vessels' },
          { type: 'choice', question: '免疫', options: ['immune', 'medicine', 'treatment', 'prevention'], answer: 'immune', feedback: '"免疫" is "immune"' },
          { type: 'choice', question: '诊断', options: ['diagnosis', 'treatment', 'prescription', 'recovery'], answer: 'diagnosis', feedback: '"诊断" is "diagnosis"' },
        ],
      },
      {
        title: '中国古典文学词汇',
        content: '学习中国古典文学中的词汇和表达',
        order: 3,
        type: 'vocabulary',
        exercises: [
          { type: 'choice', question: '风雅颂', options: ['诗经的分类', '唐诗的分类', '宋词的分类', '元曲的分类'], answer: '诗经的分类', feedback: '"风雅颂"是诗经的分类' },
          { type: 'choice', question: '赋比兴', options: ['诗经的表现手法', '唐诗的表现手法', '宋词的表现手法', '元曲的表现手法'], answer: '诗经的表现手法', feedback: '"赋比兴"是诗经的表现手法' },
          { type: 'choice', question: '平仄', options: ['诗的韵律', '诗的字数', '诗的行数', '诗的标题'], answer: '诗的韵律', feedback: '"平仄"是诗的韵律' },
        ],
      },
    ],
  },
  {
    title: '中文专家级语法',
    description: '学习中文语法的高级用法和细微区别',
    language: 'Chinese',
    level: 4,
    category: 'Grammar',
    duration: 110,
    lessons: [
      {
        title: '虚词的精细用法',
        content: '学习虚词的多种用法和细微区别',
        order: 1,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '这个问题____重要，需要认真对待。', options: ['十分', '有点', '稍微', '几乎'], answer: '十分', feedback: '"十分"表示程度很高' },
          { type: 'choice', question: '他____不会来了，我们别等了。', options: ['恐怕', '肯定', '一定', '确实'], answer: '恐怕', feedback: '"恐怕"表示推测和担忧' },
          { type: 'choice', question: '这个消息让大家____感到意外。', options: ['都', '也', '还', '才'], answer: '都', feedback: '"都"表示包括全部' },
        ],
      },
      {
        title: '复杂长句的组织',
        content: '学习如何组织结构复杂的长句',
        order: 2,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '____遇到多大的困难，____要坚持到底。', options: ['无论...都', '虽然...但是', '因为...所以', '不但...而且'], answer: '无论...都', feedback: '条件关系用"无论...都"' },
          { type: 'choice', question: '____时间紧，任务重，____大家还是按时完成了工作。', options: ['虽然...但是', '因为...所以', '如果...就', '不但...而且'], answer: '虽然...但是', feedback: '转折关系用"虽然...但是"' },
        ],
      },
      {
        title: '古代汉语语法',
        content: '学习古代汉语的基本语法特点',
        order: 3,
        type: 'grammar',
        exercises: [
          { type: 'choice', question: '古汉语中"之"的常见用法不包括：', options: ['的', '他/她/它', '到', '因为'], answer: '因为', feedback: '"之"不表示"因为"' },
          { type: 'choice', question: '古汉语中"而"的常见用法是：', options: ['表示并列、转折等关系', '表示原因', '表示时间', '表示地点'], answer: '表示并列、转折等关系', feedback: '"而"表示并列、转折等关系' },
        ],
      },
    ],
  },
  {
    title: '中文专家级写作',
    description: '学习专业中文写作和文学创作',
    language: 'Chinese',
    level: 4,
    category: 'Writing',
    duration: 120,
    lessons: [
      {
        title: '学术论文写作',
        content: '学习如何撰写高质量的中文学术论文',
        order: 1,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '学术论文的关键词应该？', options: ['越多越好', '准确反映论文主题', '随便选几个', '只用一个'], answer: '准确反映论文主题', feedback: '关键词应该准确反映论文主题' },
          { type: 'choice', question: '学术论文的语言应该？', options: ['华丽辞藻', '严谨规范', '口语化', '情绪化'], answer: '严谨规范', feedback: '学术论文语言应该严谨规范' },
        ],
      },
      {
        title: '文学创作技巧',
        content: '学习文学创作的高级技巧',
        order: 2,
        type: 'writing',
        exercises: [
          { type: 'choice', question: '小说创作中，人物塑造应该？', options: ['完美无缺', '丰满立体', '简单单一', '只描写外貌'], answer: '丰满立体', feedback: '人物应该丰满立体' },
          { type: 'choice', question: '文学作品中的环境描写是为了？', options: ['凑字数', '渲染气氛，衬托人物', '展示写景能力', '没什么用'], answer: '渲染气氛，衬托人物', feedback: '环境描写用于渲染气氛，衬托人物' },
        ],
      },
    ],
  },
]

// 考试数据
const exams = [
  // 英语考试
  {
    language: 'English',
    level: 1,
    title: '英语初级水平考试',
    description: '完成初级课程后参加，通过可解锁中级课程',
    passingScore: 60,
    questions: [
      {
        order: 1,
        question: '选择 "Good morning" 的正确中文翻译：',
        options: ['晚安', '早上好', '晚上好', '下午好'],
        answer: '早上好',
        explanation: 'Good morning 是早上问候语'
      },
      {
        order: 2,
        question: '"Hello" 的中文意思是：',
        options: ['再见', '你好', '谢谢', '对不起'],
        answer: '你好',
        explanation: 'Hello 是常用的问候语'
      },
      {
        order: 3,
        question: '数字 "seven" 是：',
        options: ['五', '六', '七', '八'],
        answer: '七',
        explanation: 'Seven 是数字 7'
      },
      {
        order: 4,
        question: 'I have ____ apple. 填入正确的冠词：',
        options: ['a', 'an', 'the', '/'],
        answer: 'an',
        explanation: 'Apple 以元音开头，用 an'
      },
      {
        order: 5,
        question: 'She ____ to school every day.',
        options: ['go', 'goes', 'going', 'went'],
        answer: 'goes',
        explanation: '第三人称单数用 goes'
      },
      {
        order: 6,
        question: '选择正确的回答：How are you?',
        options: ['I\'m fine, thanks.', 'Goodbye!', 'Hello!', 'Nice to meet you.'],
        answer: 'I\'m fine, thanks.',
        explanation: '这是 How are you 的标准回答'
      },
      {
        order: 7,
        question: '"Thank you" 的意思是：',
        options: ['对不起', '请', '谢谢', '不客气'],
        answer: '谢谢',
        explanation: 'Thank you 表示感谢'
      },
      {
        order: 8,
        question: '选择正确的句子：',
        options: ['I is a student.', 'I are a student.', 'I am a student.', 'I be a student.'],
        answer: 'I am a student.',
        explanation: 'I 后面用 am'
      },
      {
        order: 9,
        question: '"Please" 的中文意思是：',
        options: ['对不起', '请', '谢谢', '好的'],
        answer: '请',
        explanation: 'Please 是礼貌用语'
      },
      {
        order: 10,
        question: '选择正确的数字：Ten',
        options: ['八', '九', '十', '十一'],
        answer: '十',
        explanation: 'Ten 是数字 10'
      }
    ]
  },
  {
    language: 'English',
    level: 2,
    title: '英语中级水平考试',
    description: '完成中级课程后参加，通过可解锁高级课程',
    passingScore: 60,
    questions: [
      {
        order: 1,
        question: '"Engineer" 的中文意思是：',
        options: ['医生', '工程师', '教师', '律师'],
        answer: '工程师',
        explanation: 'Engineer 是工程师'
      },
      {
        order: 2,
        question: 'I ____ to the park yesterday.',
        options: ['go', 'goes', 'went', 'going'],
        answer: 'went',
        explanation: '昨天用过去式 went'
      },
      {
        order: 3,
        question: '"Manager" 是指：',
        options: ['员工', '经理', '老板', '客户'],
        answer: '经理',
        explanation: 'Manager 是经理'
      },
      {
        order: 4,
        question: 'This book is ____ than that one.',
        options: ['interesting', 'more interesting', 'most interesting', 'interestinger'],
        answer: 'more interesting',
        explanation: '比较级用 more + 多音节形容词'
      },
      {
        order: 5,
        question: '"Excited" 表示：',
        options: ['难过的', '兴奋的', '生气的', '害怕的'],
        answer: '兴奋的',
        explanation: 'Excited 是兴奋的'
      },
      {
        order: 6,
        question: '选择正确的句子：',
        options: ['She can sings well.', 'She can sing well.', 'She can singing well.', 'She can to sing well.'],
        answer: 'She can sing well.',
        explanation: 'Can 后面用动词原形'
      },
      {
        order: 7,
        question: '"Worried" 的意思是：',
        options: ['开心的', '担心的', '累的', '饿的'],
        answer: '担心的',
        explanation: 'Worried 是担心的'
      },
      {
        order: 8,
        question: 'Rarely ____ such a beautiful sunset.',
        options: ['I have seen', 'have I seen', 'I saw', 'saw I'],
        answer: 'have I seen',
        explanation: '否定词开头句子用倒装'
      },
      {
        order: 9,
        question: '"Investment" 是指：',
        options: ['贷款', '投资', '储蓄', '保险'],
        answer: '投资',
        explanation: 'Investment 是投资'
      },
      {
        order: 10,
        question: '选择正确的介词搭配：I\'m interested ____.',
        options: ['on', 'in', 'at', 'for'],
        answer: 'in',
        explanation: 'Interested 后面用 in'
      }
    ]
  },
  {
    language: 'English',
    level: 3,
    title: '英语高级水平考试',
    description: '完成高级课程后参加，通过可解锁专家级课程',
    passingScore: 60,
    questions: [
      {
        order: 1,
        question: '"Algorithm" 是指：',
        options: ['算法', '代数', '几何', '统计'],
        answer: '算法',
        explanation: 'Algorithm 是算法'
      },
      {
        order: 2,
        question: 'If I ____ you, I would study harder.',
        options: ['am', 'was', 'were', 'be'],
        answer: 'were',
        explanation: '虚拟语气用 were'
      },
      {
        order: 3,
        question: '"Cryptography" 是：',
        options: ['地理学', '密码学', '天文学', '生物学'],
        answer: '密码学',
        explanation: 'Cryptography 是密码学'
      },
      {
        order: 4,
        question: 'Not only ____ good at English, but also at math.',
        options: ['she is', 'is she', 'she was', 'was she'],
        answer: 'is she',
        explanation: 'Not only 开头用倒装'
      },
      {
        order: 5,
        question: '"Quantum" 的意思是：',
        options: ['质量', '量子', '分子', '原子'],
        answer: '量子',
        explanation: 'Quantum 是量子'
      },
      {
        order: 6,
        question: 'I wish I ____ more time.',
        options: ['have', 'had', 'has', 'having'],
        answer: 'had',
        explanation: 'Wish 后面用虚拟语气'
      },
      {
        order: 7,
        question: '"Jurisdiction" 是指：',
        options: ['法律', '司法权', '律师', '法庭'],
        answer: '司法权',
        explanation: 'Jurisdiction 是司法权'
      },
      {
        order: 8,
        question: '____ from the hill, the city looks beautiful.',
        options: ['Seeing', 'Seen', 'To see', 'See'],
        answer: 'Seen',
        explanation: '被动关系用过去分词'
      },
      {
        order: 9,
        question: '"Litigation" 的意思是：',
        options: ['合同', '诉讼', '仲裁', '调解'],
        answer: '诉讼',
        explanation: 'Litigation 是诉讼'
      },
      {
        order: 10,
        question: 'It is essential that he ____ there on time.',
        options: ['arrives', 'arrive', 'arrived', 'arriving'],
        answer: 'arrive',
        explanation: 'Essential 后面用虚拟语气动词原形'
      }
    ]
  },
  // 中文考试
  {
    language: 'Chinese',
    level: 1,
    title: '中文初级水平考试',
    description: '完成初级课程后参加，通过可解锁中级课程',
    passingScore: 60,
    questions: [
      {
        order: 1,
        question: '早上见面应该说：',
        options: ['晚安', '早上好', '晚上好', '下午好'],
        answer: '早上好',
        explanation: '早上问候用早上好'
      },
      {
        order: 2,
        question: '"你好"的英文是：',
        options: ['Goodbye', 'Hello', 'Thank you', 'Sorry'],
        answer: 'Hello',
        explanation: '你好是 Hello'
      },
      {
        order: 3,
        question: '数字"5"的中文是：',
        options: ['四', '五', '六', '七'],
        answer: '五',
        explanation: '5 是五'
      },
      {
        order: 4,
        question: '选择正确的量词：一____书',
        options: ['个', '本', '只', '条'],
        answer: '本',
        explanation: '书的量词是本'
      },
      {
        order: 5,
        question: '我____饭。',
        options: ['吃', '喝', '看', '写'],
        answer: '吃',
        explanation: '吃饭是正确搭配'
      },
      {
        order: 6,
        question: '这个苹果很____。',
        options: ['快乐', '漂亮', '甜', '快'],
        answer: '甜',
        explanation: '苹果用甜来形容'
      },
      {
        order: 7,
        question: '选择正确的回答：谢谢！',
        options: ['对不起', '不客气', '好的', '再见'],
        answer: '不客气',
        explanation: '谢谢的回答是不客气'
      },
      {
        order: 8,
        question: '一____笔的正确量词是：',
        options: ['本', '支', '个', '张'],
        answer: '支',
        explanation: '笔的量词是支'
      },
      {
        order: 9,
        question: '再见的英文是：',
        options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
        answer: 'Goodbye',
        explanation: '再见是 Goodbye'
      },
      {
        order: 10,
        question: '数字"十"的阿拉伯数字是：',
        options: ['8', '9', '10', '11'],
        answer: '10',
        explanation: '十是 10'
      }
    ]
  },
  {
    language: 'Chinese',
    level: 2,
    title: '中文中级水平考试',
    description: '完成中级课程后参加，通过可解锁高级课程',
    passingScore: 60,
    questions: [
      {
        order: 1,
        question: '"机场"的英文是：',
        options: ['airport', 'station', 'bus stop', 'harbor'],
        answer: 'airport',
        explanation: '机场是 airport'
      },
      {
        order: 2,
        question: '____下雨了，我们不去了。',
        options: ['虽然', '因为', '如果', '即使'],
        answer: '因为',
        explanation: '因果关系用因为'
      },
      {
        order: 3,
        question: '"火车票"的英文是：',
        options: ['bus ticket', 'train ticket', 'plane ticket', 'subway ticket'],
        answer: 'train ticket',
        explanation: '火车票是 train ticket'
      },
      {
        order: 4,
        question: '____明天下雨，我们____不去爬山。',
        options: ['虽然...但是', '如果...就', '因为...所以', '不但...而且'],
        answer: '如果...就',
        explanation: '假设关系用如果...就'
      },
      {
        order: 5,
        question: '"便宜"的英文是：',
        options: ['expensive', 'cheap', 'good', 'bad'],
        answer: 'cheap',
        explanation: '便宜是 cheap'
      },
      {
        order: 6,
        question: '____他很聪明，____不努力。',
        options: ['因为...所以', '虽然...但是', '如果...就', '不但...而且'],
        answer: '虽然...但是',
        explanation: '转折关系用虽然...但是'
      },
      {
        order: 7,
        question: '请把书____给我。',
        options: ['递', '递过来', '递给', '递给来'],
        answer: '递过来',
        explanation: '趋向补语过来表示动作朝说话人'
      },
      {
        order: 8,
        question: '他____会说英语，____会说法语。',
        options: ['虽然...但是', '不但...而且', '因为...所以', '如果...就'],
        answer: '不但...而且',
        explanation: '递进关系用不但...而且'
      },
      {
        order: 9,
        question: '杯子____他打碎了。',
        options: ['把', '被', '让', '给'],
        answer: '被',
        explanation: '被动句用被'
      },
      {
        order: 10,
        question: '"月光像流水一样"使用了什么修辞？',
        options: ['拟人', '比喻', '排比', '夸张'],
        answer: '比喻',
        explanation: '用像表示比喻'
      }
    ]
  },
  {
    language: 'Chinese',
    level: 3,
    title: '中文高级水平考试',
    description: '完成高级课程后参加，通过可解锁专家级课程',
    passingScore: 60,
    questions: [
      {
        order: 1,
        question: '"一举两得"的意思是：',
        options: ['做一件事得到两种收获', '两个动作一起做', '两次成功', '两个好处'],
        answer: '做一件事得到两种收获',
        explanation: '一举两得指做一件事得到两种收获'
      },
      {
        order: 2,
        question: '____遇到多大的困难，我们____要坚持到底。',
        options: ['虽然...但是', '无论...都', '因为...所以', '如果...就'],
        answer: '无论...都',
        explanation: '条件关系用无论...都'
      },
      {
        order: 3,
        question: '"破釜沉舟"比喻：',
        options: ['打破锅碗', '下定决心', '破坏东西', '沉船'],
        answer: '下定决心',
        explanation: '破釜沉舟比喻下定决心'
      },
      {
        order: 4,
        question: '古汉语中"吾"的意思是：',
        options: ['你', '我', '他', '我们'],
        answer: '我',
        explanation: '吾是我的意思'
      },
      {
        order: 5,
        question: '"卧薪尝胆"形容：',
        options: ['睡在柴火上', '刻苦自励', '吃胆', '休息'],
        answer: '刻苦自励',
        explanation: '卧薪尝胆形容刻苦自励'
      },
      {
        order: 6,
        question: '"汝"在古汉语中是：',
        options: ['你', '我', '他', '她'],
        answer: '你',
        explanation: '汝是你的意思'
      },
      {
        order: 7,
        question: '"风雅颂"是：',
        options: ['诗经的分类', '唐诗的分类', '宋词的分类', '元曲的分类'],
        answer: '诗经的分类',
        explanation: '风雅颂是诗经的分类'
      },
      {
        order: 8,
        question: '议论文的三要素不包括：',
        options: ['论点', '论据', '论证', '抒情'],
        answer: '抒情',
        explanation: '议论文三要素是论点、论据、论证'
      },
      {
        order: 9,
        question: '"赋比兴"是：',
        options: ['诗经的表现手法', '唐诗的表现手法', '宋词的表现手法', '元曲的表现手法'],
        answer: '诗经的表现手法',
        explanation: '赋比兴是诗经的表现手法'
      },
      {
        order: 10,
        question: '散文的特点是：',
        options: ['形散神不散', '结构严谨', '情节曲折', '人物众多'],
        answer: '形散神不散',
        explanation: '散文形散神不散'
      }
    ]
  }
]

// 绘本故事数据
const stories = [
  // ==================== English Level 1 ====================
  {
    language: 'English',
    level: 1,
    title: 'A Sunny Day',
    description: 'A simple story about a sunny day at the park',
    content: 'It is a sunny day. Tom and his dog go to the park. They see a big tree. They see a red flower. Tom runs and plays. His dog jumps and barks. They have a happy day at the park. The sun is warm. Tom says, "I love sunny days!"',
    wordCount: 52,
    questions: [
      { order: 1, type: 'CHOICE', question: 'What is the weather like in the story?', options: JSON.stringify(['Rainy', 'Sunny', 'Cloudy', 'Snowy']), answer: 'Sunny', explanation: 'The story says "It is a sunny day."', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: 'Where do Tom and his dog go?', options: JSON.stringify(['School', 'Park', 'Store', 'Home']), answer: 'Park', explanation: 'They go to the park.', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: 'What color is the flower?', options: JSON.stringify(['Blue', 'Yellow', 'Red', 'White']), answer: 'Red', explanation: 'They see a red flower.', difficulty: 1 },
    ],
  },
  {
    language: 'English',
    level: 1,
    title: 'My Cat',
    description: 'A simple story about a friendly cat',
    content: 'I have a cat. Her name is Mimi. She is white and soft. She likes to sleep on my bed. She drinks milk and eats fish. Mimi likes to play with a ball. I love my cat very much. She is my best friend.',
    wordCount: 46,
    questions: [
      { order: 1, type: 'CHOICE', question: 'What is the cat\'s name?', options: JSON.stringify(['Kitty', 'Mimi', 'Lily', 'Lucy']), answer: 'Mimi', explanation: 'The cat\'s name is Mimi.', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: 'What color is the cat?', options: JSON.stringify(['Black', 'White', 'Brown', 'Gray']), answer: 'White', explanation: 'The cat is white and soft.', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: 'What does the cat like to drink?', options: JSON.stringify(['Water', 'Juice', 'Milk', 'Tea']), answer: 'Milk', explanation: 'She drinks milk and eats fish.', difficulty: 1 },
    ],
  },
  // ==================== Chinese Level 1 ====================
  {
    language: 'Chinese',
    level: 1,
    title: '快乐的一天',
    description: '关于在公园度过快乐一天的简单故事',
    content: '今天是晴天。小明和妈妈去公园。公园里有很多花。有红色的花和黄色的花。小明看到一只小鸟。小鸟在树上唱歌。小明很开心。他说："我喜欢公园！"',
    wordCount: 56,
    questions: [
      { order: 1, type: 'CHOICE', question: '今天天气怎么样？', options: JSON.stringify(['下雨', '晴天', '阴天', '下雪']), answer: '晴天', explanation: '故事中说"今天是晴天"', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小明和谁去公园？', options: JSON.stringify(['爸爸', '妈妈', '爷爷', '奶奶']), answer: '妈妈', explanation: '小明和妈妈去公园', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小明在公园里看到了什么？', options: JSON.stringify(['大鱼', '小狗', '小鸟', '小猫']), answer: '小鸟', explanation: '小明看到一只小鸟', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '我的小狗',
    description: '关于一只可爱小狗的简单故事',
    content: '我有一只小狗。它叫旺旺。它是棕色的。它有黑黑的眼睛。旺旺喜欢吃肉。它喜欢在草地上跑。我每天带它去散步。它是我的好朋友。',
    wordCount: 48,
    questions: [
      { order: 1, type: 'CHOICE', question: '小狗叫什么名字？', options: JSON.stringify(['汪汪', '旺旺', '小明', '花花']), answer: '旺旺', explanation: '小狗叫旺旺', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小狗是什么颜色的？', options: JSON.stringify(['白色', '黑色', '棕色', '灰色']), answer: '棕色', explanation: '它是棕色的', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小狗喜欢吃什么？', options: JSON.stringify(['鱼', '肉', '菜', '水果']), answer: '肉', explanation: '旺旺喜欢吃肉', difficulty: 1 },
    ],
  },
  // ==================== Chinese Level 1 (新增) ====================
  {
    language: 'Chinese',
    level: 1,
    title: '我的家',
    description: '关于家人的简单故事',
    content: '我有一个幸福的家。家里有爸爸、妈妈和我。爸爸很高，他很强壮。妈妈很漂亮，她对我很好。我很爱他们。我们家有一只小猫，它叫花花。花花很可爱，它喜欢在沙发上睡觉。晚上，我们一家人一起吃饭，一起看电视。我很开心。我爱我的家。',
    wordCount: 78,
    questions: [
      { order: 1, type: 'CHOICE', question: '故事里"我"家里有几口人？', options: JSON.stringify(['两口人', '三口人', '四口人', '五口人']), answer: '三口人', explanation: '家里有爸爸、妈妈和我，一共三口人', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小猫叫什么名字？', options: JSON.stringify(['旺旺', '小花', '花花', '小白']), answer: '花花', explanation: '小猫叫花花', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小猫喜欢在哪里睡觉？', options: JSON.stringify(['床上', '沙发上', '地上', '桌子上']), answer: '沙发上', explanation: '花花喜欢在沙发上睡觉', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小兔子找萝卜',
    description: '关于小兔子找食物的简单故事',
    content: '有一只小兔子，它叫白白。白白饿了，想吃萝卜。它去菜园里找。菜园里有白菜，但是没有萝卜。白白有点难过。它又去超市里找。超市里有好多萝卜，有红色的，有白色的。白白买了一个大萝卜。它很开心，抱着萝卜回家了。回到家，白白把萝卜洗干净，大口大口地吃了起来。萝卜真好吃！',
    wordCount: 88,
    questions: [
      { order: 1, type: 'CHOICE', question: '小兔子叫什么名字？', options: JSON.stringify(['小黑', '白白', '小花', '小黄']), answer: '白白', explanation: '小兔子叫白白', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小兔子想吃什么？', options: JSON.stringify(['白菜', '萝卜', '肉', '苹果']), answer: '萝卜', explanation: '白白想吃萝卜', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小兔子最后在哪里找到了萝卜？', options: JSON.stringify(['菜园', '超市', '家里', '公园']), answer: '超市', explanation: '它去超市里找，超市里有好多萝卜', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '水果乐园',
    description: '关于水果的简单故事',
    content: '今天，妈妈带我去水果店。水果店里有好多水果。有红红的苹果，像小灯笼。有黄黄的香蕉，像弯弯的月亮。有圆圆的西瓜，绿绿的皮。还有紫色的葡萄，一串串的。妈妈问我："你想吃什么水果？"我说："我想吃苹果和香蕉。"妈妈买了苹果和香蕉。回到家，我洗了一个苹果，咬了一口。甜甜的，真好吃。妈妈说："多吃水果对身体好。"我爱吃水果。',
    wordCount: 115,
    questions: [
      { order: 1, type: 'CHOICE', question: '妈妈带我去了哪里？', options: JSON.stringify(['学校', '公园', '水果店', '超市']), answer: '水果店', explanation: '妈妈带我去水果店', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '故事里提到了哪些水果？', options: JSON.stringify(['苹果和梨', '苹果、香蕉、西瓜和葡萄', '西瓜和桃子', '葡萄和橙子']), answer: '苹果、香蕉、西瓜和葡萄', explanation: '有苹果、香蕉、西瓜和葡萄', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '"我"最后吃了什么？', options: JSON.stringify(['香蕉', '西瓜', '苹果', '葡萄']), answer: '苹果', explanation: '我洗了一个苹果，咬了一口', difficulty: 1 },
      { order: 4, type: 'CHOICE', question: '妈妈说了什么？', options: JSON.stringify(['水果很贵', '多吃水果对身体好', '不能吃太多', '水果不好吃']), answer: '多吃水果对身体好', explanation: '妈妈说"多吃水果对身体好"', difficulty: 1 },
    ],
  },
  // ==================== Chinese Level 1 - 中华传统美德小故事 ====================
  {
    language: 'Chinese',
    level: 1,
    title: '孔融让梨',
    description: '一个关于谦让的传统美德故事',
    content: '古时候，有个小朋友叫孔融。有一天，爸爸买来了一盘梨。孔融和哥哥们一起吃梨。孔融选了一个最小的梨。爸爸看见了，问他："你为什么拿最小的梨？"孔融说："我年纪小，应该吃小的。大的留给哥哥们吃。"爸爸听了，点点头说："你真是个懂事的好孩子。"',
    wordCount: 78,
    questions: [
      { order: 1, type: 'CHOICE', question: '孔融选了一个什么样的梨？', options: JSON.stringify(['最大的', '最小的', '中间的', '最甜的']), answer: '最小的', explanation: '孔融选了一个最小的梨', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '孔融为什么拿最小的梨？', options: JSON.stringify(['他不喜欢吃梨', '他年纪小应该吃小的', '大的不好吃', '哥哥们要大的']), answer: '他年纪小应该吃小的', explanation: '孔融说我年纪小应该吃小的', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '爸爸觉得孔融是个什么样的孩子？', options: JSON.stringify(['调皮的', '懂事的', '贪吃的', '懒惰的']), answer: '懂事的', explanation: '爸爸说孔融是个懂事的好孩子', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '司马光砸缸',
    description: '一个关于机智救人的故事',
    content: '古时候，司马光和小伙伴们在院子里玩。院子里有一口大水缸。有个小朋友不小心掉进了水缸里。水缸很高，其他小朋友都吓哭了。司马光没有哭，他想了一个好办法。他搬起一块大石头，用力砸向水缸。水缸破了，水流了出来，小朋友得救了。大家都夸司马光聪明。',
    wordCount: 85,
    questions: [
      { order: 1, type: 'CHOICE', question: '发生了什么事情？', options: JSON.stringify(['小朋友摔倒了', '小朋友掉进水缸里', '水缸倒了', '小朋友吵架了']), answer: '小朋友掉进水缸里', explanation: '有个小朋友不小心掉进了水缸里', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '司马光是怎么救人的？', options: JSON.stringify(['用绳子拉', '找大人帮忙', '用石头砸缸', '跳进水缸']), answer: '用石头砸缸', explanation: '司马光搬起大石头砸向水缸', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '其他小朋友在做什么？', options: JSON.stringify(['帮忙救人', '吓哭了', '去找大人', '在玩']), answer: '吓哭了', explanation: '其他小朋友都吓哭了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '乌鸦喝水',
    description: '一个关于动脑筋解决问题的故事',
    content: '有一只乌鸦飞了很久，口渴了。它看见一个瓶子里有水。可是瓶口很小，水也不多，乌鸦喝不到水。乌鸦没有放弃，它想了想，想到了一个好办法。它把石头一颗一颗地叼进瓶子里。石头沉到瓶底，水就慢慢升高了。乌鸦终于喝到了水。乌鸦真聪明！',
    wordCount: 82,
    questions: [
      { order: 1, type: 'CHOICE', question: '乌鸦遇到了什么困难？', options: JSON.stringify(['找不到食物', '喝不到瓶里的水', '飞不动了', '找不到家']), answer: '喝不到瓶里的水', explanation: '瓶口小水不多，乌鸦喝不到水', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '乌鸦想出了什么办法？', options: JSON.stringify(['把瓶子推倒', '叼石头放进瓶子', '用树枝喝水', '等下雨']), answer: '叼石头放进瓶子', explanation: '乌鸦把石头叼进瓶子里让水升高', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '这个故事告诉我们什么？', options: JSON.stringify(['乌鸦很笨', '遇到困难要动脑筋', '石头可以吃', '瓶子很危险']), answer: '遇到困难要动脑筋', explanation: '乌鸦遇到困难想办法解决了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '铁杵磨成针',
    description: '一个关于坚持和毅力的故事',
    content: '唐代大诗人李白小时候很贪玩。有一天，他在河边看到一位老奶奶在磨一根铁棒。李白好奇地问："老奶奶，您在做什么？"老奶奶说："我要把这根铁棒磨成一根针。"李白更奇怪了，问："这么粗的铁棒，怎么能磨成针呢？"老奶奶笑着说："只要天天磨，总有一天能磨成针。"李白听了很受感动。从此他认真学习，终于成了大诗人。',
    wordCount: 115,
    questions: [
      { order: 1, type: 'CHOICE', question: '老奶奶在河边做什么？', options: JSON.stringify(['洗衣服', '磨铁棒', '钓鱼', '散步']), answer: '磨铁棒', explanation: '老奶奶在磨一根铁棒', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '老奶奶说怎样才能把铁棒磨成针？', options: JSON.stringify(['用机器磨', '天天磨', '请人帮忙', '用火烧']), answer: '天天磨', explanation: '老奶奶说只要天天磨总有一天能磨成针', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '李白听了老奶奶的话后怎么样了？', options: JSON.stringify(['继续贪玩', '认真学习', '也去磨铁棒', '回家了']), answer: '认真学习', explanation: '李白从此认真学习成了大诗人', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '愚公移山',
    description: '一个关于坚持不懈的故事',
    content: '很久以前，有一位老人叫愚公。他家门前有两座大山，出门很不方便。愚公决定把山挖掉。邻居都笑他说："你这么大年纪了，怎么能挖掉两座大山呢？"愚公说："我挖不完，还有我的儿子。儿子挖不完，还有孙子。子子孙孙，一代一代挖下去，总有一天能把山挖平。"天神被愚公的精神感动了，派人把山搬走了。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '愚公为什么要挖山？', options: JSON.stringify(['山里有宝藏', '出门不方便', '喜欢挖山', '山太难看了']), answer: '出门不方便', explanation: '两座大山挡在家门口，出门很不方便', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '别人笑话愚公时，他是怎么说的？', options: JSON.stringify(['不挖了', '子子孙孙挖下去', '请人帮忙', '搬家']), answer: '子子孙孙挖下去', explanation: '愚公说子子孙孙一代一代挖下去', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '最后山是怎么被搬走的？', options: JSON.stringify(['愚公挖平的', '天神搬走的', '邻居帮忙的', '山自己倒了']), answer: '天神搬走的', explanation: '天神被感动了派人把山搬走了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '曹冲称象',
    description: '一个关于聪明智慧的故事',
    content: '古时候，有人送给曹操一头大象。曹操很高兴，问大家："这头大象有多重？谁能称出来？"大家看着这么大的象，都摇头说没办法。这时，曹操的儿子曹冲才七岁，他说："我有办法。"曹冲让人把大象赶上船，在船身上划了记号。再把大象赶下船，往船上装石头。装到船沉到记号的地方，称一称石头的重量，就知道大象有多重了。曹操非常高兴。',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '曹操问大家什么问题？', options: JSON.stringify(['大象几岁了', '大象有多重', '大象吃什么', '大象从哪里来']), answer: '大象有多重', explanation: '曹操问大家这头大象有多重', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '曹冲用了什么办法称象？', options: JSON.stringify(['用尺子量', '用石头代替大象', '用大秤称', '问大象自己']), answer: '用石头代替大象', explanation: '曹冲用石头代替大象称重量', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '曹冲当时几岁？', options: JSON.stringify(['五岁', '六岁', '七岁', '八岁']), answer: '七岁', explanation: '曹冲才七岁就想出了好办法', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '守株待兔',
    description: '一个关于不能懒惰等待的故事',
    content: '古时候，有一个农夫在田里干活。突然，一只兔子跑过来，撞到了树桩上，死了。农夫很高兴，捡起兔子带回家吃了。从此，农夫不再干活了。他天天坐在树桩旁边等，等着再有兔子撞过来。可是，再也没有兔子来了。田里的庄稼都枯死了。别人问他为什么不去种田，他说："我在等兔子呢！"这个故事告诉我们，不能靠运气过日子。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '农夫第一次是怎么得到兔子的？', options: JSON.stringify(['用网抓的', '兔子撞在树桩上', '买来的', '别人送的']), answer: '兔子撞在树桩上', explanation: '兔子跑过来撞到树桩上死了', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '农夫后来每天做什么？', options: JSON.stringify(['种田', '坐在树桩边等兔子', '去市场卖兔子', '砍树']), answer: '坐在树桩边等兔子', explanation: '农夫天天坐在树桩旁边等兔子', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '故事告诉我们什么道理？', options: JSON.stringify(['要爱护动物', '不能靠运气过日子', '兔子跑得快', '种田很辛苦']), answer: '不能靠运气过日子', explanation: '这个故事告诉我们不能靠运气过日子', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '掩耳盗铃',
    description: '一个关于自欺欺人的故事',
    content: '古时候，有一个人看到别人家门口挂着一个漂亮的铃铛。他很想偷走这个铃铛。他知道，用手一碰铃铛，铃铛就会响。他想了想，想出一个"好办法"。他捂住自己的耳朵，然后去偷铃铛。他以为把自己的耳朵捂住，别人就听不到铃铛的声音了。结果，他刚碰到铃铛，主人就听到了声音，跑出来把他抓住了。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '这个人想偷什么？', options: JSON.stringify(['金子', '铃铛', '花瓶', '衣服']), answer: '铃铛', explanation: '他想偷别人家门前的铃铛', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '他想出了什么办法？', options: JSON.stringify(['晚上去偷', '捂住自己的耳朵', '用棉花塞住铃铛', '找朋友帮忙']), answer: '捂住自己的耳朵', explanation: '他捂住自己的耳朵去偷铃铛', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '最后怎么样了？', options: JSON.stringify(['偷到了铃铛', '被主人抓住了', '铃铛没响', '逃跑了']), answer: '被主人抓住了', explanation: '主人听到声音跑出来把他抓住了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '画蛇添足',
    description: '一个关于做事不要多余的故事',
    content: '古时候，有几个人比赛画蛇。谁先画完，谁就可以喝一壶酒。有一个人画得很快，最先画完了蛇。他拿起酒壶，正要喝酒时，看到别人还在画。他得意地想："我再给蛇画几只脚吧。"于是他继续给蛇画脚。这时候，另一个人画完了蛇，抢过酒壶说："蛇本来没有脚，你给它画了脚，就不是蛇了。"说完，就把酒喝了。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '比赛画蛇的奖品是什么？', options: JSON.stringify(['一壶酒', '一锭银子', '一块肉', '一条蛇']), answer: '一壶酒', explanation: '谁先画完就可以喝一壶酒', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '先画完的人做了什么？', options: JSON.stringify(['喝了酒', '给蛇画脚', '帮别人画', '睡觉了']), answer: '给蛇画脚', explanation: '他给蛇画了几只脚', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '故事告诉我们什么？', options: JSON.stringify(['蛇有脚', '做事不要多余', '画画很难', '比赛要公平']), answer: '做事不要多余', explanation: '做事不要做多余的事情', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '叶公好龙',
    description: '一个关于表里不一的故事',
    content: '古时候，有一个人叫叶公。他特别喜欢龙。他的家里到处都画着龙。柱子上雕着龙，墙上画着龙，衣服上也绣着龙。天上的真龙听说了，很感动，想见见叶公。于是真龙从天上飞下来，把头伸进窗户里。叶公看到真龙，吓得脸色发白，浑身发抖，大叫着逃跑了。原来叶公喜欢的不是真龙，只是像龙的东西。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '叶公喜欢什么？', options: JSON.stringify(['老虎', '龙', '凤凰', '马']), answer: '龙', explanation: '叶公特别喜欢龙', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '真龙来了之后叶公有什么反应？', options: JSON.stringify(['很高兴', '吓跑了', '和龙说话', '请龙喝茶']), answer: '吓跑了', explanation: '叶公看到真龙吓得逃跑了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '故事告诉我们什么？', options: JSON.stringify(['龙很可怕', '要表里如一', '要喜欢龙', '画画很重要']), answer: '要表里如一', explanation: '叶公表面喜欢龙其实并不喜欢', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '凿壁偷光',
    description: '一个关于勤奋好学的故事',
    content: '古时候，有一个小朋友叫匡衡。他很喜欢读书，可是家里很穷，买不起蜡烛。晚上没有亮光，他就不能读书了。匡衡看到隔壁邻居家有亮光，就在墙上偷偷凿了一个小洞。光从小洞里照过来，匡衡就借着这点光读书。他每天都很用功地读书，后来成了一位大学问家。',
    wordCount: 80,
    questions: [
      { order: 1, type: 'CHOICE', question: '匡衡为什么在墙上凿洞？', options: JSON.stringify(['为了通风', '为了借光读书', '为了看邻居', '为了好玩']), answer: '为了借光读书', explanation: '匡衡借着邻居家的光读书', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '匡衡家里为什么没有灯？', options: JSON.stringify(['不喜欢灯', '家里很穷买不起蜡烛', '灯坏了', '不需要灯']), answer: '家里很穷买不起蜡烛', explanation: '家里很穷买不起蜡烛', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '匡衡后来怎么样了？', options: JSON.stringify(['成了大学问家', '做了木匠', '去种田了', '做了商人']), answer: '成了大学问家', explanation: '匡衡后来成了一位大学问家', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '黄香温席',
    description: '一个关于孝顺父母的故事',
    content: '古时候，有一个小朋友叫黄香。他九岁时，母亲就去世了。他对父亲非常孝顺。夏天很热，黄香先用扇子把父亲的枕席扇凉了，再让父亲睡觉。冬天很冷，黄香先钻进被窝，用自己的身体把被窝暖热了，再让父亲睡觉。大家都很称赞黄香的孝顺。后来黄香长大了，也成了一个有出息的人。',
    wordCount: 88,
    questions: [
      { order: 1, type: 'CHOICE', question: '夏天黄香为父亲做了什么？', options: JSON.stringify(['扇凉枕席', '准备冷水', '打开窗户', '买冰棍']), answer: '扇凉枕席', explanation: '夏天黄香把枕席扇凉了再让父亲睡', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '冬天黄香为父亲做了什么？', options: JSON.stringify(['生火炉', '暖热被窝', '关紧窗户', '盖厚被子']), answer: '暖热被窝', explanation: '黄香钻进被窝暖热了再让父亲睡', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '这个故事告诉我们要什么？', options: JSON.stringify(['好好学习', '孝顺父母', '爱护动物', '节约用水']), answer: '孝顺父母', explanation: '黄香对父亲非常孝顺', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '木兰从军',
    description: '一个关于女英雄的故事',
    content: '古时候，有一个女孩子叫花木兰。有一天，皇帝要征兵打仗，木兰的父亲也在名单上。父亲年纪大了，身体不好，不能去打仗。木兰决定代替父亲去从军。她女扮男装上了战场。在军队里，木兰很勇敢，立了很多战功。打了十二年仗，伙伴们都不知道她是个女孩子。木兰真是个了不起的女英雄。',
    wordCount: 95,
    questions: [
      { order: 1, type: 'CHOICE', question: '木兰为什么要代替父亲从军？', options: JSON.stringify(['父亲年纪大了身体不好', '她想去玩', '家里没人', '她喜欢打仗']), answer: '父亲年纪大了身体不好', explanation: '父亲年纪大了身体不好不能去打仗', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '木兰在军队里表现得怎么样？', options: JSON.stringify(['很害怕', '很勇敢', '想回家', '偷懒']), answer: '很勇敢', explanation: '木兰很勇敢立了很多战功', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '伙伴们知道木兰是女孩子吗？', options: JSON.stringify(['知道', '不知道', '有人知道', '后来才知道']), answer: '不知道', explanation: '打了十二年伙伴们都不知道她是女孩子', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '三个和尚',
    description: '一个关于团结合作的故事',
    content: '山上有一座小庙，庙里住着一个小和尚。小和尚每天下山挑水喝。后来来了一个瘦和尚，两个人一起抬水喝。再后来来了一个胖和尚，三个人都不愿意去挑水了。你推我，我推你，结果谁都没水喝。夜里老鼠出来偷东西吃，把灯台打翻了。庙里着火了，三个和尚赶紧一起挑水救火。火灭了，他们明白了：团结力量大。从此三个人一起挑水。',
    wordCount: 115,
    questions: [
      { order: 1, type: 'CHOICE', question: '一个和尚的时候怎么喝水？', options: JSON.stringify(['下山挑水', '接雨水', '买水喝', '喝井水']), answer: '下山挑水', explanation: '小和尚每天下山挑水喝', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '三个和尚在一起时为什么没水喝？', options: JSON.stringify(['没有水了', '都不愿意去挑水', '水桶坏了', '井干了']), answer: '都不愿意去挑水', explanation: '三个和尚互相推脱不去挑水', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '最后三个和尚明白了什么道理？', options: JSON.stringify(['要节约用水', '团结力量大', '不要养猫', '要早睡早起']), answer: '团结力量大', explanation: '三个和尚一起救火后明白了团结力量大', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小猫钓鱼',
    description: '一个关于专心的故事',
    content: '有一天，猫妈妈带着小花猫去河边钓鱼。小花猫刚坐下，一只蜻蜓飞来了。小花猫放下鱼竿去追蜻蜓。蜻蜓飞走了，小花猫没追到。小花猫回到河边，看见妈妈已经钓到了一条大鱼。过了一会儿，一只蝴蝶飞来了。小花猫又放下鱼竿去追蝴蝶。蝴蝶也飞走了。妈妈对小花猫说："钓鱼要专心，不能三心二意。"小花猫听了，坐下来专心钓鱼，终于钓到了一条大鱼。',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '小花猫第一次去追什么？', options: JSON.stringify(['蝴蝶', '蜻蜓', '小鸟', '兔子']), answer: '蜻蜓', explanation: '一只蜻蜓飞来了小花猫去追蜻蜓', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '妈妈钓到鱼了，小花猫钓到了吗？', options: JSON.stringify(['钓到了', '没有', '钓到一条小的', '钓到两条']), answer: '没有', explanation: '小花猫三心二意没有钓到鱼', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小花猫最后是怎么钓到大鱼的？', options: JSON.stringify(['专心钓鱼', '换了个地方', '用新鱼竿', '妈妈帮忙']), answer: '专心钓鱼', explanation: '小花猫专心钓鱼终于钓到大鱼', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小马过河',
    description: '一个关于勇于尝试的故事',
    content: '小马和妈妈住在河边。有一天，妈妈叫小马把半袋麦子驮到河对岸去。小马来到河边，看到河水哗哗地流着。小松鼠说："河水很深，不能过！我的一个朋友就是被淹死的。"老牛说："河水很浅，才到我的小腿。"小马不知道该怎么办，跑回家问妈妈。妈妈说："你自己试试就知道了。"小马回到河边，小心地下河。原来河水没有松鼠说的那么深，也没有老牛说的那么浅。小马安全地过了河。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '小松鼠说河水怎么样？', options: JSON.stringify(['很浅', '很深', '很冷', '很热']), answer: '很深', explanation: '小松鼠说河水很深', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '老牛说河水怎么样？', options: JSON.stringify(['很深', '很浅', '很宽', '很窄']), answer: '很浅', explanation: '老牛说河水很浅才到他的小腿', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '妈妈告诉小马什么道理？', options: JSON.stringify(['听松鼠的话', '听老牛的话', '自己试试就知道了', '不要过河']), answer: '自己试试就知道了', explanation: '妈妈让小马自己去试试', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '龟兔赛跑',
    description: '一个关于坚持就是胜利的故事',
    content: '有一天，兔子和乌龟要比赛跑步。兔子跑得很快，乌龟爬得很慢。比赛开始了，兔子一下子跑出去很远。兔子回头一看，乌龟才爬了一点点路。兔子心想："乌龟爬得太慢了，我睡一觉再跑也来得及。"于是兔子就在路边睡着了。乌龟虽然爬得慢，但它一直没有停下来。乌龟爬呀爬呀，超过了睡觉的兔子，第一个到达了终点。兔子醒来发现乌龟已经赢了，后悔极了。',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '兔子为什么在路上睡觉？', options: JSON.stringify(['太累了', '觉得乌龟太慢睡一觉也来得及', '生病了', '天黑了']), answer: '觉得乌龟太慢睡一觉也来得及', explanation: '兔子觉得乌龟太慢就睡觉了', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '乌龟是怎么赢得比赛的？', options: JSON.stringify(['跑得很快', '一直没有停下来', '抄近路', '兔子让它的']), answer: '一直没有停下来', explanation: '乌龟虽然慢但一直没有停下来', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '故事告诉我们什么道理？', options: JSON.stringify(['跑得快很重要', '坚持就能胜利', '睡觉不好', '乌龟比兔子厉害']), answer: '坚持就能胜利', explanation: '坚持不懈才能成功', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '狼来了',
    description: '一个关于诚实的故事',
    content: '有一个放羊的小孩，每天在山上放羊。他觉得一个人很无聊，就想了一个恶作剧。他对着山下大喊："狼来了！狼来了！"山下的农民们听到喊声，赶紧拿着工具跑上山来。他们发现根本没有狼，小孩笑着说："哈哈，你们被骗了！"农民们生气地走了。第二天，小孩又喊"狼来了"，农民们又上当了。过了几天，狼真的来了。小孩害怕地大喊："狼来了！救命！"可是这次没有人相信他了。他的羊都被狼吃掉了。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '小孩为什么要喊狼来了？', options: JSON.stringify(['真的有狼', '觉得无聊恶作剧', '做噩梦了', '想回家']), answer: '觉得无聊恶作剧', explanation: '小孩觉得无聊就想恶作剧', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '狼真的来了时发生了什么？', options: JSON.stringify(['农民们来帮忙了', '没有人相信他了', '狼被赶走了', '小孩把狼打跑了']), answer: '没有人相信他了', explanation: '因为小孩之前骗人，这次没人相信他了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '故事告诉我们什么？', options: JSON.stringify(['要放羊', '不能撒谎要诚实', '狼很可怕', '要大声喊叫']), answer: '不能撒谎要诚实', explanation: '撒谎骗人最终会害了自己', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小壁虎借尾巴',
    description: '一个关于动物尾巴作用的故事',
    content: '小壁虎在墙上爬，一条蛇咬住了它的尾巴。小壁虎一挣，尾巴断了，小壁虎逃走了。小壁虎想：没有尾巴真难看，去借一条尾巴吧。小壁虎向小鱼借尾巴。小鱼说："不行呀，我要用尾巴游泳。"小壁虎向老牛借尾巴。老牛说："不行呀，我要用尾巴赶苍蝇。"小壁虎向燕子借尾巴。燕子说："不行呀，我要用尾巴掌握方向。"小壁虎借不到尾巴，伤心地回家了。妈妈笑着说："傻孩子，你回头看看。"小壁虎回头一看，呀，它已经长出新尾巴了！',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '小壁虎的尾巴怎么了？', options: JSON.stringify(['被蛇咬断了', '自己掉了', '被人剪了', '被风吹断了']), answer: '被蛇咬断了', explanation: '蛇咬住了小壁虎的尾巴，它一挣尾巴断了', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小鱼为什么不能把尾巴借给小壁虎？', options: JSON.stringify(['它要用尾巴游泳', '它的尾巴太小', '它不喜欢小壁虎', '它在睡觉']), answer: '它要用尾巴游泳', explanation: '小鱼要用尾巴游泳', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小壁虎最后怎么样了？', options: JSON.stringify(['借到了尾巴', '长出了新尾巴', '没有尾巴了', '找到了断尾巴']), answer: '长出了新尾巴', explanation: '小壁虎的尾巴可以再生，长出了新尾巴', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小蝌蚪找妈妈',
    description: '一个关于成长的故事',
    content: '池塘里有一群小蝌蚪，大大的脑袋，黑灰色的身子。他们游来游去想找妈妈。他们看到鸭子，叫"妈妈，妈妈！"鸭子说："我不是你们的妈妈。你们的妈妈有大眼睛和宽嘴巴。"他们看到大鱼，叫"妈妈，妈妈！"大鱼说："我不是你们的妈妈。你们的妈妈有四条腿。"他们看到乌龟，叫"妈妈，妈妈！"乌龟说："我不是你们的妈妈。你们的妈妈穿绿衣服白肚皮。"最后他们找到了青蛙妈妈。青蛙妈妈笑着说："孩子们，你们已经长成小青蛙了！"',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '小蝌蚪先遇到了谁？', options: JSON.stringify(['大鱼', '鸭子', '乌龟', '青蛙']), answer: '鸭子', explanation: '小蝌蚪先遇到了鸭子', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '青蛙妈妈长什么样子？', options: JSON.stringify(['大眼睛宽嘴巴四条腿', '长尾巴', '长脖子', '大翅膀']), answer: '大眼睛宽嘴巴四条腿', explanation: '青蛙妈妈有大眼睛宽嘴巴和四条腿', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小蝌蚪找到妈妈时变成了什么？', options: JSON.stringify(['小鱼', '小乌龟', '小青蛙', '小鸭子']), answer: '小青蛙', explanation: '小蝌蚪已经长成小青蛙了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '两只羊过桥',
    description: '一个关于谦让的故事',
    content: '河上有一座独木桥，只能一个人通过。有一天，一只白羊从东边走上桥，一只黑羊从西边走上桥。它们在桥中间碰到了。白羊说："你退回去，让我先过！"黑羊说："你退回去，让我先过！"两只羊都不肯让，就在桥上顶起来了。结果，"扑通"一声，两只羊都掉进了河里。如果它们互相让一让，就不会掉进河里了。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '桥是什么样子的？', options: JSON.stringify(['很宽的桥', '独木桥只能一个人通过', '石头桥', '铁桥']), answer: '独木桥只能一个人通过', explanation: '这是一座独木桥只能一个人通过', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '两只羊都不肯让，最后怎么样了？', options: JSON.stringify(['都过去了', '都掉进河里了', '白羊过去了', '黑羊过去了']), answer: '都掉进河里了', explanation: '两只羊顶起来都掉进了河里', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '故事告诉我们什么？', options: JSON.stringify(['要互相谦让', '不要过桥', '羊会游泳', '桥不好走']), answer: '要互相谦让', explanation: '互相让一让就不会掉进河里了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小猴子下山',
    description: '一个关于不要贪心的故事',
    content: '有一天，一只小猴子下山来。它走到一片玉米地里，掰了一个大玉米。它抱着玉米往前走，看到一棵桃树，就扔了玉米去摘桃子。它捧着桃子往前走，看到一片西瓜地，就扔了桃子去摘西瓜。它抱着大西瓜往前走，看到一只小兔子，就扔了西瓜去追兔子。兔子跑进树林里不见了。小猴子只好空着手回家了。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '小猴子先摘了什么？', options: JSON.stringify(['桃子', '玉米', '西瓜', '苹果']), answer: '玉米', explanation: '小猴子先掰了一个大玉米', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小猴子最后追什么去了？', options: JSON.stringify(['蝴蝶', '小鸟', '兔子', '松鼠']), answer: '兔子', explanation: '小猴子扔了西瓜去追兔子', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小猴子最后带什么回家了？', options: JSON.stringify(['玉米', '桃子', '西瓜', '什么都没带']), answer: '什么都没带', explanation: '小猴子空着手回家了什么都没有', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '咕咚来了',
    description: '一个关于不要盲目跟从的故事',
    content: '小白兔在湖边玩。突然听到"咕咚"一声，小白兔吓了一大跳。它不知道那是什么声音，吓得撒腿就跑。一只狐狸看见了，问："你跑什么呀？"小白兔说："咕咚来了！快跑吧！"狐狸一听也害怕了，跟着跑起来。猴子、梅花鹿、狗熊，大家一个接一个地跟着跑起来。最后大象拦住了大家，问清楚后，带着大家到湖边去看。原来"咕咚"是一个大木瓜掉进了水里。大家都不好意思地笑了。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '小白兔为什么跑？', options: JSON.stringify(['看到了老虎', '听到了咕咚声', '被蜜蜂蜇了', '迷路了']), answer: '听到了咕咚声', explanation: '小白兔听到咕咚一声吓跑了', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '是谁带着大家去看真相的？', options: JSON.stringify(['猴子', '大象', '狐狸', '梅花鹿']), answer: '大象', explanation: '大象拦住了大家带着大家去看', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '咕咚到底是什么声音？', options: JSON.stringify(['怪兽', '木瓜掉进水里的声音', '打雷', '石头落水']), answer: '木瓜掉进水里的声音', explanation: '原来是一个大木瓜掉进了水里', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小兔乖乖',
    description: '一个关于不能给陌生人开门的故事',
    content: '兔妈妈有三个孩子，一个叫红眼睛，一个叫长耳朵，一个叫短尾巴。有一天，兔妈妈要去拔萝卜，对孩子们说："妈妈不在家，不要给陌生人开门。"兔妈妈走后，大灰狼来了。大灰狼学着兔妈妈的声音唱："小兔子乖乖，把门开开。"红眼睛想去开门，长耳朵说："不对不对，不是妈妈的声音。"小兔子们从门缝里一看，是大灰狼！他们齐声说："不开不开就不开，妈妈没回来！"兔妈妈回来了，大灰狼吓跑了。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '兔妈妈走前说了什么？', options: JSON.stringify(['好好吃饭', '不要给陌生人开门', '不要打架', '早点睡觉']), answer: '不要给陌生人开门', explanation: '妈妈说不在了不要给陌生人开门', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '谁来了？', options: JSON.stringify(['狐狸', '大灰狼', '老虎', '大熊']), answer: '大灰狼', explanation: '大灰狼来了学着兔妈妈唱歌', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小兔子们开门了吗？', options: JSON.stringify(['开了', '没开', '只开了一点点', '红眼睛开了']), answer: '没开', explanation: '小兔子们说不开不开就不开', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小羊过生日',
    description: '一个关于分享快乐的故事',
    content: '今天是小羊的生日。小羊早早地起床了，把家里打扫得干干净净。朋友们都来给小羊过生日。小兔子送了一篮胡萝卜，小猫送了一条小鱼干，小狗送了一根肉骨头，小鸡送了一把米。小羊很感动，说："谢谢你们！"妈妈端来了一个大蛋糕，上面插着蜡烛。大家一起唱生日歌，小羊吹灭了蜡烛。小羊把蛋糕切好分给大家吃。大家都很开心。小羊说："和朋友们一起过生日真快乐！"',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '今天是谁的生日？', options: JSON.stringify(['小兔', '小羊', '小猫', '小狗']), answer: '小羊', explanation: '今天是小羊的生日', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小兔送了什么礼物？', options: JSON.stringify(['一篮胡萝卜', '一条小鱼干', '一根肉骨头', '一把米']), answer: '一篮胡萝卜', explanation: '小兔子送了一篮胡萝卜', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小羊把蛋糕怎么了？', options: JSON.stringify(['自己全吃了', '切好分给大家', '藏起来了', '给妈妈了']), answer: '切好分给大家', explanation: '小羊把蛋糕切好分给大家吃', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小蚂蚁搬粮食',
    description: '一个关于勤劳准备的故事',
    content: '夏天到了，太阳火辣辣的。小蚂蚁们排着队在搬粮食。它们搬的搬，扛的扛，个个都很忙碌。一只小蚂蚁搬着一粒米，走得很慢，满头大汗。一只蟋蟀看见了，笑着说："大热天的，你们怎么不休息一下？快来和我唱歌跳舞吧！"小蚂蚁说："现在多搬点粮食，冬天才不会饿肚子。"蟋蟀听了，不说话了。冬天到了，外面下着大雪，小蚂蚁们在洞里吃粮食，又暖和又幸福。蟋蟀却冻得瑟瑟发抖，肚子也饿了。',
    wordCount: 135,
    questions: [
      { order: 1, type: 'CHOICE', question: '夏天小蚂蚁们在做什么？', options: JSON.stringify(['唱歌', '搬粮食', '睡觉', '跳舞']), answer: '搬粮食', explanation: '小蚂蚁们在搬粮食准备过冬', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '蟋蟀在做什么？', options: JSON.stringify(['也搬粮食', '唱歌跳舞', '睡觉', '吃饭']), answer: '唱歌跳舞', explanation: '蟋蟀在唱歌跳舞不肯劳动', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '冬天来了小蚂蚁和蟋蟀谁过得好？', options: JSON.stringify(['蟋蟀', '小蚂蚁', '都好', '都不好']), answer: '小蚂蚁', explanation: '小蚂蚁在洞里吃粮食又暖和又幸福', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '大公鸡和花蝴蝶',
    description: '一个关于友好的故事',
    content: '大公鸡在院子里找虫子吃。一只花蝴蝶飞过来，想和大公鸡做朋友。大公鸡说："你的翅膀真漂亮！你会飞，真了不起。"花蝴蝶说："你的羽毛好漂亮，红红的冠子也很好看。"它们都很喜欢对方。花蝴蝶说："我带你飞吧！"大公鸡说："我不会飞呀。"花蝴蝶说："没关系，我可以飞到你的头上。"于是花蝴蝶停在大公鸡的头上，它们一起在院子里玩。',
    wordCount: 105,
    questions: [
      { order: 1, type: 'CHOICE', question: '大公鸡在院子里做什么？', options: JSON.stringify(['唱歌', '找虫子吃', '睡觉', '散步']), answer: '找虫子吃', explanation: '大公鸡在院子里找虫子吃', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '花蝴蝶想和大公鸡做什么？', options: JSON.stringify(['做朋友', '比赛', '打架', '比美']), answer: '做朋友', explanation: '花蝴蝶想和大公鸡做朋友', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '花蝴蝶最后停在了哪里？', options: JSON.stringify(['花朵上', '大公鸡的头上', '树上', '房子上']), answer: '大公鸡的头上', explanation: '花蝴蝶停在大公鸡的头上一起玩', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小鸭学游泳',
    description: '一个关于勇敢尝试的故事',
    content: '鸭妈妈带着小鸭子们去学游泳。小鸭子们都高兴地跳进了水里，只有一只小鸭子站在岸边不敢下水。鸭妈妈说："孩子，别害怕，下水来，妈妈教你。"小鸭子摇摇头说："水太深了，我害怕。"鸭妈妈游到岸边，耐心地说："你看，你的羽毛是防水的，你的脚是像船桨，你会自然浮起来的。"小鸭子鼓起勇气，慢慢走进水里。呀，真的浮起来了！小鸭子开心地跟着妈妈学游泳。',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '小鸭子为什么不下水？', options: JSON.stringify(['水太冷了', '害怕水', '不想学游泳', '生病了']), answer: '害怕水', explanation: '小鸭子害怕不敢下水', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '鸭妈妈怎么鼓励小鸭子？', options: JSON.stringify(['骂它', '说它的羽毛是防水的会浮起来', '把它推下水', '不管它']), answer: '说它的羽毛是防水的会浮起来', explanation: '妈妈说羽毛防水脚像船桨会浮起来', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '最后小鸭子怎么样了？', options: JSON.stringify(['还是不敢下水', '开心地学会了游泳', '被妈妈拉下水了', '回家了']), answer: '开心地学会了游泳', explanation: '小鸭子鼓起勇气学会了游泳', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小松鼠的大尾巴',
    description: '一个关于发现自身优点的故事',
    content: '小松鼠有一条毛茸茸的大尾巴。可是小松鼠觉得大尾巴不好看。它看到小鸟有好看的翅膀，小兔子有短尾巴，它很羡慕。有一天，小松鼠在树上跳来跳去，一不小心踩空了。它的大尾巴像降落伞一样张开了，让它慢慢落到了地上，一点也没摔疼。冬天到了，很冷很冷。小松鼠把大尾巴卷在身上，像一条大围巾，暖和极了。小松鼠终于知道了：自己的大尾巴是最好的！',
    wordCount: 125,
    questions: [
      { order: 1, type: 'CHOICE', question: '小松鼠一开始觉得自己的尾巴怎么样？', options: JSON.stringify(['很好看', '不好看', '很有用', '很大']), answer: '不好看', explanation: '小松鼠觉得大尾巴不好看', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小松鼠从树上掉下来时大尾巴有什么作用？', options: JSON.stringify(['像降落伞让它慢慢落下', '没有用', '让它摔疼了', '挂住了树枝']), answer: '像降落伞让它慢慢落下', explanation: '大尾巴像降落伞一样张开了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '冬天大尾巴有什么作用？', options: JSON.stringify(['当被子盖', '当围巾保暖', '当帽子戴', '当手套']), answer: '当围巾保暖', explanation: '小松鼠把大尾巴卷在身上很暖和', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小刺猬的果子',
    description: '一个关于动脑筋的故事',
    content: '秋天到了，树上的果子熟了。小刺猬来到果树下，看着红红的果子，很想吃。可是树太高了，小刺猬够不着。小刺猬使劲跳了跳，还是够不着。它想了想，找来了猴子帮忙。猴子爬上了树，摘了很多果子扔下来。果子落在草地上，小刺猬开心极了。可是这么多果子怎么带回家呢？小刺猬在地上打了个滚，果子就扎在了它的刺上。小刺猬背着果子高高兴兴地回家了。',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '小刺猬够不到果子，它找了谁帮忙？', options: JSON.stringify(['小鸟', '猴子', '大象', '长颈鹿']), answer: '猴子', explanation: '小刺猬找来了猴子帮忙摘果子', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小刺猬怎么把果子带回家的？', options: JSON.stringify(['用袋子装', '在地上打滚扎在刺上', '用嘴巴叼着', '一个一个搬']), answer: '在地上打滚扎在刺上', explanation: '小刺猬打了个滚果子就扎在刺上了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '果子是从哪儿来的？', options: JSON.stringify(['地上捡的', '树上摘的', '买的', '别人送的']), answer: '树上摘的', explanation: '猴子爬上树把果子摘了下来', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '雪孩子',
    description: '一个关于善良和友情的温暖故事',
    content: '下雪了，小白兔和妈妈堆了一个雪人，给它取名叫雪孩子。雪孩子白白胖胖的，很可爱。妈妈出门去了，小白兔在屋里烤火。火越烧越旺，烧着了旁边的柴堆。小白兔害怕极了。雪孩子看到着火了，飞快地跑过来救小白兔。雪孩子冲进屋里，抱起小白兔就跑到了外面。小白兔得救了，可是雪孩子却被火烤化了，变成了一滩水。太阳出来了，水变成了水蒸气，水蒸气飞上天变成了白云。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '雪孩子是怎么来的？', options: JSON.stringify(['小白兔堆的雪人', '从天上掉下来的', '妈妈做的', '自己变出来的']), answer: '小白兔堆的雪人', explanation: '小白兔和妈妈堆了一个雪人', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '雪孩子是怎么救小白兔的？', options: JSON.stringify(['叫人来帮忙', '冲进屋里抱起小白兔', '用水灭火', '去找妈妈']), answer: '冲进屋里抱起小白兔', explanation: '雪孩子冲进屋里抱起小白兔就跑', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '雪孩子最后怎样了？', options: JSON.stringify(['融化了', '变成了白云', '消失了', '被烧了']), answer: '融化了', explanation: '雪孩子被火烤化变成了水', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小燕子学飞',
    description: '一个关于成长需要勇敢的故事',
    content: '小燕子出生了，它和哥哥姐姐们住在屋檐下的窝里。有一天，燕子妈妈说："孩子们，今天我要教你们学飞。"哥哥姐姐们都勇敢地飞了出去。小燕子站在窝边，看着下面好高呀，它的腿都发抖了。妈妈鼓励它说："别怕，张开翅膀，妈妈会接住你的。"小燕子闭上眼睛，张开翅膀，一下子跳了出去。它的翅膀用力地拍打着，真的飞起来了！小燕子高兴地叫着："我会飞了！我会飞了！"',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '小燕子住在哪里？', options: JSON.stringify(['树上', '屋檐下的窝里', '山洞里', '草丛里']), answer: '屋檐下的窝里', explanation: '小燕子住在屋檐下的窝里', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小燕子为什么不敢飞？', options: JSON.stringify(['生病了', '觉得太高害怕', '太小了', '不想学']), answer: '觉得太高害怕', explanation: '小燕子看着下面好高腿都发抖了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '最后小燕子学会飞了吗？', options: JSON.stringify(['学会了', '没有', '摔下去了', '被妈妈接住了']), answer: '学会了', explanation: '小燕子张开翅膀飞起来了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小猪盖房子',
    description: '一个关于勤劳和智慧的故事',
    content: '有三只小猪，它们要盖自己的房子。第一只小猪懒得很，用稻草搭了一间草房子。第二只小猪用木头搭了一间木房子。第三只小猪最勤劳，用砖头盖了一间砖房子。一天，一只大灰狼来了。它对着草房子吹了一口气，草房子就倒了。第一只小猪跑到木房子里。大灰狼用力一撞，木房子也倒了。两只小猪又跑到砖房子里。大灰狼吹也吹不倒，撞也撞不倒，只好灰溜溜地走了。',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '第三只小猪用什么盖房子？', options: JSON.stringify(['稻草', '木头', '砖头', '泥巴']), answer: '砖头', explanation: '第三只小猪用砖头盖房子', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '草房子被什么弄倒了？', options: JSON.stringify(['风吹倒了', '大灰狼吹倒了', '雨淋倒了', '小猪推倒了']), answer: '大灰狼吹倒了', explanation: '大灰狼吹了一口气草房子就倒了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '大灰狼为什么没能弄倒砖房子？', options: JSON.stringify(['砖房子太硬了', '大灰狼累了', '大灰狼走了', '有人帮忙']), answer: '砖房子太硬了', explanation: '砖房子吹也吹不倒撞也撞不倒', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '狐狸和乌鸦',
    description: '一个关于不能轻信花言巧语的故事',
    content: '乌鸦找到了一块肉，叼在嘴里，站在树枝上，心里美滋滋的。一只狐狸从树下走过，看到乌鸦嘴里的肉，很想吃。狐狸想了想，对乌鸦说："亲爱的乌鸦，你长得真漂亮！"乌鸦没出声。狐狸又说："你的羽毛真好看，比别的鸟都漂亮！"乌鸦还是没出声。狐狸又说："你的歌声一定也很好听吧？唱一首给我听听吧！"乌鸦听了很得意，张嘴就要唱。"哇"的一声，肉掉了下来。狐狸叼起肉跑了。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '乌鸦嘴里叼着什么？', options: JSON.stringify(['虫子', '一块肉', '果子', '树枝']), answer: '一块肉', explanation: '乌鸦找到了一块肉叼在嘴里', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '狐狸怎么让乌鸦张嘴的？', options: JSON.stringify(['吓唬乌鸦', '夸乌鸦唱歌好听', '用石头扔乌鸦', '爬树抢']), answer: '夸乌鸦唱歌好听', explanation: '狐狸夸乌鸦唱歌好听，乌鸦一得意就张嘴了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '故事告诉我们什么？', options: JSON.stringify(['乌鸦很笨', '不能轻信花言巧语', '狐狸很聪明', '肉很好吃']), answer: '不能轻信花言巧语', explanation: '不要因为别人的夸奖而得意忘形', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小白兔和小灰兔',
    description: '一个关于勤劳的故事',
    content: '老山羊收了很多白菜，要送给小白兔和小灰兔。小白兔说："谢谢您，我不要白菜，请您给我一些菜籽吧。"老山羊给了小白兔一包菜籽。小灰兔拿了白菜高高兴兴地回家了。小白兔把菜籽种在地里，天天浇水施肥。白菜长得又大又多。小灰兔把白菜吃完了，又没吃的了。小白兔送了一车白菜给小灰兔。小灰兔不好意思地说："以后我也要自己种菜。"',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '小白兔要了什么？', options: JSON.stringify(['白菜', '菜籽', '萝卜', '青菜']), answer: '菜籽', explanation: '小白兔要了一包菜籽', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小灰兔拿了什么？', options: JSON.stringify(['菜籽', '白菜', '萝卜', '种子']), answer: '白菜', explanation: '小灰兔拿了白菜高高兴兴回家了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小灰兔最后明白了什么？', options: JSON.stringify(['要自己劳动', '要去借菜', '要买白菜', '要种萝卜']), answer: '要自己劳动', explanation: '小灰兔说以后我也要自己种菜', difficulty: 1 },
    ],
  },
  // ==================== Chinese Level 1 - 365夜幼儿小故事 ====================
  {
    language: 'Chinese',
    level: 1,
    title: '小星星找朋友',
    description: '一颗小星星找朋友的故事',
    content: '天空中有一颗小星星，它觉得很孤单。它想找朋友一起玩。小星星看到月亮姐姐，说："月亮姐姐，你能和我一起玩吗？"月亮姐姐说："好呀，你和我一起照亮夜空吧。"小星星开心地眨着眼睛，和月亮姐姐一起把夜空照得更亮了。地上的人们看到了，都说："今晚的星星真美！"小星星再也不孤单了。',
    wordCount: 85,
    questions: [
      { order: 1, type: 'CHOICE', question: '小星星为什么觉得孤单？', options: JSON.stringify(['天太黑了', '没有朋友一起玩', '被云遮住了', '天亮了']), answer: '没有朋友一起玩', explanation: '小星星想找朋友一起玩', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '月亮姐姐让小星星做什么？', options: JSON.stringify(['回家睡觉', '一起照亮夜空', '和云朵玩', '去地上玩']), answer: '一起照亮夜空', explanation: '月亮姐姐说一起照亮夜空', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小星星最后还孤单吗？', options: JSON.stringify(['还孤单', '不孤单了', '更孤单了', '睡着了']), answer: '不孤单了', explanation: '小星星再也不孤单了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小蜗牛去旅行',
    description: '一个关于慢也有慢的好处的故事',
    content: '小蜗牛想去山顶看风景。它慢慢地爬呀爬。蝴蝶飞过来说："你太慢了，像我这样飞才快。"小鸟飞过来说："你太慢了，像我这样飞才快。"小蜗牛说："没关系，我虽然慢，但我会一直往前爬。"小蜗牛爬过了草地，爬过了小树林。它看到了路边的小花，听到了溪水的声音。慢慢地，它终于爬到了山顶。山上的风景真美呀！小蜗牛开心地笑了。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '小蜗牛想去哪里？', options: JSON.stringify(['河边', '山顶', '公园', '超市']), answer: '山顶', explanation: '小蜗牛想去山顶看风景', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '别人说小蜗牛慢时它怎么说的？', options: JSON.stringify(['放弃不去了', '说没关系会一直爬', '哭了', '跑起来了']), answer: '说没关系会一直爬', explanation: '小蜗牛说虽然慢但会一直往前爬', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小蜗牛最后看到山顶的风景了吗？', options: JSON.stringify(['看到了', '没有', '天黑了', '睡着了']), answer: '看到了', explanation: '小蜗牛终于爬到了山顶看到了美景', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小水滴历险记',
    description: '一个小水滴变成水蒸气的故事',
    content: '小水滴在大海里和朋友们一起玩。太阳公公出来了，阳光照在小水滴身上，小水滴觉得身体轻飘飘的，慢慢飞到了天上。小水滴变成了云。风婆婆一吹，云飘到了山上。山上好冷，小水滴变成了雨，落到了地上。小水滴顺着小河流啊流，又流回了大海。小水滴的旅行真有趣！',
    wordCount: 85,
    questions: [
      { order: 1, type: 'CHOICE', question: '小水滴被太阳照到后变成了什么？', options: JSON.stringify(['冰', '云', '雪', '雾']), answer: '云', explanation: '小水滴飞到天上变成了云', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '云飘到山上变成了什么？', options: JSON.stringify(['雪', '冰雹', '雨', '雾']), answer: '雨', explanation: '山上好冷小水滴变成了雨', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小水滴最后流到了哪里？', options: JSON.stringify(['大海', '小河', '水塘', '水井']), answer: '大海', explanation: '小水滴顺着小河流回了大海', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小兔子的胡萝卜',
    description: '小兔子分享胡萝卜的故事',
    content: '小白兔种了很多胡萝卜。秋天到了，胡萝卜都长大了。小白兔拔了很多胡萝卜，装了满满一篮子。小白兔心想："这么多胡萝卜，我一个人吃不完，分一些给朋友吧。"小白兔给小山羊送了一篮，给小猪送了一篮，给小松鼠也送了一篮。朋友们都很感激。为了感谢小白兔，小山羊送了青菜，小猪送了苹果，小松鼠送了松果。小白兔开心极了。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '小白兔种了什么？', options: JSON.stringify(['白菜', '萝卜', '胡萝卜', '青菜']), answer: '胡萝卜', explanation: '小白兔种了很多胡萝卜', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小白兔把胡萝卜怎么了？', options: JSON.stringify(['自己全吃了', '分给了朋友', '卖掉了', '藏起来了']), answer: '分给了朋友', explanation: '小白兔把胡萝卜分给朋友们吃', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '朋友们送了小白兔什么？', options: JSON.stringify(['花', '青菜苹果和松果', '玩具', '书']), answer: '青菜苹果和松果', explanation: '朋友们送了小白兔青菜苹果和松果', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小雨伞找主人',
    description: '一把小雨伞找家的故事',
    content: '有一把小雨伞，它被主人遗忘在了公园的长椅上。小雨伞很想回家。一个小女孩走过来说："这把伞真漂亮，可是不是我的。"一个小男孩走过来说："这把伞好可爱，可是不是我的。"小雨伞很难过。这时候，一个小姑娘跑过来，高兴地说："啊，我的伞！谢谢你帮我保管！"小雨伞终于找到主人了，它开心地跳了起来。',
    wordCount: 90,
    questions: [
      { order: 1, type: 'CHOICE', question: '小雨伞被遗忘在了哪里？', options: JSON.stringify(['公交车', '公园的长椅上', '教室', '超市']), answer: '公园的长椅上', explanation: '小雨伞被遗忘在公园的长椅上', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '最后谁拿走了小雨伞？', options: JSON.stringify(['小女孩', '小男孩', '小姑娘主人', '没有人']), answer: '小姑娘主人', explanation: '小姑娘跑过来说这是我的伞', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小雨伞最后的心情怎么样？', options: JSON.stringify(['很难过', '很开心', '很生气', '很平静']), answer: '很开心', explanation: '小雨伞找到主人了开心地跳了起来', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小熊刷牙',
    description: '一个关于养成好习惯的故事',
    content: '小熊最爱吃蜂蜜了。可是它有个坏习惯，吃完蜂蜜从来不刷牙。有一天，小熊的牙突然疼了起来，疼得它在地上直打滚。熊妈妈赶紧带它去看牙医。牙医看了看说："你的牙齿被虫子蛀了，以后要记得刷牙。"小熊害怕了，说："我以后一定天天刷牙！"从此，小熊每天早上和晚上都认真刷牙，牙齿再也不疼了。',
    wordCount: 90,
    questions: [
      { order: 1, type: 'CHOICE', question: '小熊最爱吃什么？', options: JSON.stringify(['糖', '蜂蜜', '蛋糕', '水果']), answer: '蜂蜜', explanation: '小熊最爱吃蜂蜜', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小熊的牙为什么疼？', options: JSON.stringify(['被虫子蛀了', '摔倒了', '被打了', '过敏了']), answer: '被虫子蛀了', explanation: '牙医说牙齿被虫子蛀了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小熊后来养成了什么好习惯？', options: JSON.stringify(['天天刷牙', '不吃蜂蜜', '不吃饭', '多睡觉']), answer: '天天刷牙', explanation: '小熊每天早晚都认真刷牙', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小动物的雨伞',
    description: '小动物们用不同的东西挡雨',
    content: '下雨了，小动物们都要回家。小青蛙跳进水里说："我不怕雨，我会游泳。"小乌龟缩进壳里说："我有房子，不怕雨。"小兔子找了一片大叶子顶在头上说："我的叶子伞。"小松鼠把大尾巴举在头顶上说："我的尾巴伞。"小熊跑进山洞里说："山洞就是我的大伞。"小动物们都有了自己的雨伞，高高兴兴地回家了。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '小兔子用什么挡雨？', options: JSON.stringify(['荷叶', '大叶子', '雨伞', '帽子']), answer: '大叶子', explanation: '小兔子找了一片大叶子顶在头上', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小乌龟为什么不怕雨？', options: JSON.stringify(['它有雨伞', '它缩进壳里', '它喜欢淋雨', '它在水里']), answer: '它缩进壳里', explanation: '小乌龟缩进壳里说我有房子不怕雨', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小熊去哪里躲雨了？', options: JSON.stringify(['树下', '山洞里', '房子里', '桥下']), answer: '山洞里', explanation: '小熊跑进山洞里说山洞就是我的大伞', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小鸭子找颜色',
    description: '小鸭子认识颜色的故事',
    content: '小鸭子想知道世界上都有什么颜色。它走到花园里，看到红红的花，说："红色真好看。"走到草地上，看到绿绿的草，说："绿色真好看。"走到太阳下，看到黄黄的太阳，说："黄色真好看。"走到大海边，看到蓝蓝的海水，说："蓝色真好看。"天黑了，小鸭子抬头一看，天上有一颗金色的小星星。小鸭子说："原来世界有这么多的颜色呀！"',
    wordCount: 105,
    questions: [
      { order: 1, type: 'CHOICE', question: '小鸭子在花园里看到了什么颜色？', options: JSON.stringify(['红色', '绿色', '黄色', '蓝色']), answer: '红色', explanation: '花园里有红红的花', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '大海是什么颜色的？', options: JSON.stringify(['红色的', '绿色的', '蓝色的', '黄色的']), answer: '蓝色的', explanation: '大海边有蓝蓝的海水', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '天黑了小鸭子看到了什么？', options: JSON.stringify(['月亮', '金色的小星星', '白云', '彩虹']), answer: '金色的小星星', explanation: '天上一颗金色的小星星', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小象的长鼻子',
    description: '小象用长鼻子帮助大家的故事',
    content: '小象有一条长长的鼻子。可是小象觉得长鼻子很麻烦，走路的时候老是碰到地上。有一天，小鸡的皮球掉进了坑里。小鸡急得快要哭了。小象说："我来帮你。"小象把长鼻子伸进坑里，一下子就把皮球卷了出来。小鸡高兴地说："谢谢你，你的鼻子真有用！"后来，小象还用长鼻子帮小猴子摘香蕉，帮小兔子浇花。小象再也不觉得长鼻子麻烦了。',
    wordCount: 115,
    questions: [
      { order: 1, type: 'CHOICE', question: '小象一开始觉得长鼻子怎么样？', options: JSON.stringify(['很漂亮', '很麻烦', '很有用', '很可爱']), answer: '很麻烦', explanation: '小象觉得长鼻子很麻烦', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小象用鼻子帮小鸡做了什么？', options: JSON.stringify(['捡皮球', '摘香蕉', '浇花', '提水']), answer: '捡皮球', explanation: '小象用鼻子帮小鸡从坑里卷出皮球', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小象后来觉得长鼻子怎么样？', options: JSON.stringify(['还是麻烦', '很有用', '想剪掉', '不好看']), answer: '很有用', explanation: '小象觉得长鼻子能帮助大家很有用', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小猫咪学本领',
    description: '小猫咪学捉老鼠的故事',
    content: '小猫咪长大了，该跟妈妈学本领了。第一天，猫妈妈教小猫咪爬树。小猫咪很害怕，不敢爬。妈妈说："别怕，用爪子抓紧树干。"小猫咪试了试，终于爬了上去。第二天，猫妈妈教小猫咪捉老鼠。小猫咪躲在墙角，听到窸窸窣窣的声音，猛地扑了过去。老鼠吓得逃走了。小猫咪没有灰心，它每天都练习。慢慢地，小猫咪学会了捉老鼠的本领。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '猫妈妈第一天教小猫咪什么？', options: JSON.stringify(['捉老鼠', '爬树', '抓鱼', '跑步']), answer: '爬树', explanation: '猫妈妈第一天教小猫咪爬树', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小猫咪第一次捉老鼠成功了吗？', options: JSON.stringify(['成功了', '没有', '老鼠受伤了', '捉到两只']), answer: '没有', explanation: '老鼠吓得逃走了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '最后小猫咪学会了什么？', options: JSON.stringify(['捉老鼠', '游泳', '飞', '唱歌']), answer: '捉老鼠', explanation: '小猫咪学会了捉老鼠的本领', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '太阳和月亮',
    description: '太阳和月亮谁更好的故事',
    content: '太阳和月亮都说自己更好。太阳说："白天我出来，给大家光明和温暖。小朋友可以在外面玩。"月亮说："晚上我出来，给大家美丽的月光。小朋友可以看星星。"这时，一个小女孩说："太阳公公，谢谢你让我们白天能玩耍。月亮姐姐，谢谢你晚上给我们亮光。"太阳和月亮听了，都不好意思地笑了。它们说："我们都很重要。"',
    wordCount: 105,
    questions: [
      { order: 1, type: 'CHOICE', question: '太阳觉得自己给了大家什么？', options: JSON.stringify(['凉爽', '光明和温暖', '雨水', '风']), answer: '光明和温暖', explanation: '太阳说给大家光明和温暖', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '月亮什么时候出来？', options: JSON.stringify(['白天', '晚上', '下雨天', '中午']), answer: '晚上', explanation: '月亮说晚上我出来给大家月光', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '太阳和月亮最后明白了什么？', options: JSON.stringify(['太阳更好', '月亮更好', '都很重要', '都不重要']), answer: '都很重要', explanation: '太阳和月亮都说我们都很重要', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小竹笋长大',
    description: '小竹笋努力长高的故事',
    content: '春天来了，小竹笋从地里钻出了小脑袋。小竹笋看到外面的世界真美呀！它想快点长大。小竹笋使劲地往上长。一天，下起了大雨。小竹笋被雨打得东摇西晃，但是它紧紧地抓住泥土。雨停了，太阳出来了，小竹笋又继续往上长。小竹笋越长越高，终于长成了一棵高大挺拔的竹子。小鸟在它身上唱歌，小竹笋开心极了。',
    wordCount: 95,
    questions: [
      { order: 1, type: 'CHOICE', question: '小竹笋从哪儿钻出来？', options: JSON.stringify(['石头里', '地里', '树上', '墙上']), answer: '地里', explanation: '小竹笋从地里钻出了小脑袋', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '下雨的时候小竹笋是怎么做的？', options: JSON.stringify(['躲起来了', '紧紧地抓住泥土', '被雨打倒了', '哭了']), answer: '紧紧地抓住泥土', explanation: '小竹笋紧紧抓住泥土没有被吹倒', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小竹笋最后变成了什么？', options: JSON.stringify(['一棵大树', '一棵高大的竹子', '一朵花', '小草']), answer: '一棵高大的竹子', explanation: '小竹笋长成了一棵高大挺拔的竹子', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小蚂蚁搬饼干',
    description: '小蚂蚁团结合作搬饼干的故事',
    content: '小蚂蚁在草地上发现了一块大饼干。它想自己把饼干搬回家，可是饼干太重了，它搬不动。小蚂蚁想了想，赶紧跑回家叫来了伙伴们。大家分工合作，有的在前面拉，有的在后面推。大家一起喊着："一二一，一二一。"终于把大饼干搬回了家。蚂蚁妈妈夸奖它们说："你们真团结！"小蚂蚁们吃到了香香的饼干，开心极了。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '小蚂蚁发现了什么？', options: JSON.stringify(['一块糖', '一块饼干', '一粒米', '一片叶子']), answer: '一块饼干', explanation: '小蚂蚁发现了一块大饼干', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小蚂蚁是怎么把饼干搬回家的？', options: JSON.stringify(['自己搬的', '叫伙伴们一起搬', '请别人帮忙', '用车子推']), answer: '叫伙伴们一起搬', explanation: '小蚂蚁叫来伙伴们大家一起搬', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '蚂蚁妈妈夸小蚂蚁们什么？', options: JSON.stringify(['很聪明', '很团结', '很勤劳', '很勇敢']), answer: '很团结', explanation: '蚂蚁妈妈夸你们真团结', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小鸟的窝',
    description: '小鸟保护自己家的故事',
    content: '小鸟在树上建了一个漂亮的窝。有一天，一只大蛇想要爬上来偷鸟蛋。小鸟看到蛇来了，急得大声叫。鸟妈妈听到了，飞快地飞回来。鸟妈妈用尖尖的嘴巴啄大蛇，用翅膀拍打大蛇。大蛇被啄疼了，灰溜溜地逃走了。小鸟高兴地说："妈妈真勇敢！"鸟妈妈说："我们要保护好自己的家。"',
    wordCount: 90,
    questions: [
      { order: 1, type: 'CHOICE', question: '小鸟的窝建在哪里？', options: JSON.stringify(['屋顶上', '树上', '草地上', '山洞里']), answer: '树上', explanation: '小鸟在树上建了一个漂亮的窝', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '谁想要偷鸟蛋？', options: JSON.stringify(['老鼠', '大蛇', '猫', '松鼠']), answer: '大蛇', explanation: '一只大蛇想要爬上来偷鸟蛋', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '鸟妈妈是怎么保护家的？', options: JSON.stringify(['用嘴巴啄用翅膀拍', '叫来了其他鸟', '搬家', '求饶']), answer: '用嘴巴啄用翅膀拍', explanation: '鸟妈妈啄大蛇用翅膀拍打大蛇', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小青蛙的歌声',
    description: '小青蛙不再害羞的故事',
    content: '小青蛙很会唱歌，可是它很害羞，从来不敢在大家面前唱。夏天到了，森林里要举办音乐会。小兔子来邀请小青蛙参加。小青蛙说："我不行，我会唱不好的。"小兔子说："你唱歌很好听，要相信自己。"小青蛙鼓起勇气参加了音乐会。站在台上，看到大家都笑眯眯地看着自己，小青蛙张开嘴唱了起来。歌声真好听！大家热烈地鼓掌。小青蛙再也不害羞了。',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '小青蛙为什么不敢在大家面前唱歌？', options: JSON.stringify(['不会唱歌', '很害羞', '嗓子哑了', '不喜欢唱歌']), answer: '很害羞', explanation: '小青蛙很害羞不敢在大家面前唱', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '谁来邀请小青蛙参加音乐会？', options: JSON.stringify(['小羊', '小兔子', '小熊', '小猴子']), answer: '小兔子', explanation: '小兔子来邀请小青蛙参加音乐会', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小青蛙唱完后大家觉得怎么样？', options: JSON.stringify(['不好听', '很好听热烈鼓掌', '一般般', '睡着了']), answer: '很好听热烈鼓掌', explanation: '大家热烈地鼓掌说真好听', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小花猫的小鱼缸',
    description: '小花猫养鱼的有趣故事',
    content: '小花猫生日的时候，妈妈送了一个小鱼缸。鱼缸里有三条小金鱼，红红的，真好看。小花猫每天都要看好几遍小金鱼。它想和小金鱼一起玩，就把手伸进鱼缸里。小金鱼吓得到处乱窜。妈妈说："金鱼的家在水里，你不能用手去抓它们。"小花猫点点头说："我知道了，我就在旁边看它们游。"小花猫每天给金鱼喂食，和金鱼做了好朋友。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '妈妈送给了小花猫什么？', options: JSON.stringify(['一只猫', '一个鱼缸', '一条狗', '一只鸟']), answer: '一个鱼缸', explanation: '妈妈送了一个小鱼缸', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小花猫把手伸进鱼缸时金鱼怎么了？', options: JSON.stringify(['游过来', '吓得乱窜', '跳出鱼缸', '吃手']), answer: '吓得乱窜', explanation: '金鱼吓得到处乱窜', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '妈妈告诉小花猫什么？', options: JSON.stringify(['不能用手抓金鱼', '要把鱼放走', '要多买鱼', '换个鱼缸']), answer: '不能用手抓金鱼', explanation: '妈妈说金鱼的家在水里不能用手抓', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小黄鸡和小黑鸡',
    description: '两个小鸡互相帮助的故事',
    content: '小黄鸡和小黑鸡是好朋友。有一天，它们一起去草地上捉虫子吃。突然，天下起了大雨。小黄鸡吓得直叫："叽叽叽，好害怕！"小黑鸡说："别怕，跟我来！"小黑鸡带着小黄鸡躲到了一片大蘑菇下。雨停了，太阳出来了。地上出现了很多小水坑。小黄鸡不小心踩进了水坑里，脚上都是泥。小黑鸡帮小黄鸡擦干净了脚。小黄鸡说："谢谢你！你真是我的好朋友。"',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '下雨了小黄鸡和小黑鸡躲在哪里？', options: JSON.stringify(['树下', '大蘑菇下', '房子里', '山洞里']), answer: '大蘑菇下', explanation: '小黑鸡带着小黄鸡躲在大蘑菇下', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小黄鸡不小心怎么了？', options: JSON.stringify(['滑倒了', '踩进水坑里', '摔跤了', '淋湿了']), answer: '踩进水坑里', explanation: '小黄鸡踩进了水坑里脚上都是泥', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小黑鸡是怎么帮助小黄鸡的？', options: JSON.stringify(['背它回家', '擦干净泥', '给它鞋子', '抱它起来']), answer: '擦干净泥', explanation: '小黑鸡帮小黄鸡擦干净了脚', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小蘑菇的伞',
    description: '小蘑菇为小蚂蚁挡雨的故事',
    content: '森林里有一个小蘑菇。有一天，下起了大雨。一只小蚂蚁急急忙忙地跑过来，想找个地方躲雨。小蘑菇说："小蚂蚁，快来我下面躲雨吧！"小蚂蚁钻到蘑菇下面，高兴地说："谢谢你，小蘑菇！"雨越下越大，小蝴蝶也飞来说："能让我也躲一下吗？"小蘑菇说："快进来吧！"小蘑菇使劲撑大自己。雨停了，小蚂蚁和小蝴蝶向小蘑菇道了谢。小蘑菇也很开心。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '小蘑菇让谁到它下面躲雨？', options: JSON.stringify(['小蚂蚁', '小兔子', '小松鼠', '小猴子']), answer: '小蚂蚁', explanation: '小蘑菇叫小蚂蚁来下面躲雨', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小蝴蝶也来躲雨时小蘑菇是怎么做的？', options: JSON.stringify(['说不行', '说快进来吧并撑大自己', '不理它', '叫它走']), answer: '说快进来吧并撑大自己', explanation: '小蘑菇说快进来吧使劲撑大自己', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小蘑菇帮了大家后开心吗？', options: JSON.stringify(['不开心', '很开心', '很累', '不知道']), answer: '很开心', explanation: '小蘑菇也很开心', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小熊猫学骑车',
    description: '小熊猫学骑自行车的故事',
    content: '小熊猫看到别的小朋友都骑自行车玩，它也很想学。爸爸给它买了一辆小自行车。小熊猫高兴极了，马上骑了上去。可是刚骑了两下，就摔倒了。小熊猫爬起来又骑上去，又摔倒了。小熊猫有点想哭。爸爸说："学骑车都会摔跤的，多练练就好了。"小熊猫擦擦眼泪，又练了起来。摔了一次又一次，终于学会了。小熊猫骑着自行车在广场上快乐地飞驰。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '爸爸给小熊猫买了什么？', options: JSON.stringify(['滑板车', '小自行车', '三轮车', '电动车']), answer: '小自行车', explanation: '爸爸给它买了一辆小自行车', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小熊猫学骑车时经常怎么样？', options: JSON.stringify(['摔倒', '哭', '放弃', '偷懒']), answer: '摔倒', explanation: '小熊猫骑了两下就摔倒了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小熊猫最后学会骑车了吗？', options: JSON.stringify(['学会了', '没有', '放弃了', '改学别的了']), answer: '学会了', explanation: '小熊猫终于学会了骑自行车', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小狐狸的葡萄',
    description: '关于不要找借口的故事',
    content: '有一只小狐狸路过一片葡萄园。它看到架子上挂着一串串紫色的葡萄，馋得直流口水。它踮起脚想去摘葡萄，可是葡萄架太高了，够不着。它跳起来去够，还是够不着。小狐狸试了好多次，都够不到葡萄。它累得坐在地上，喘着气说："这些葡萄肯定是酸的，不好吃！"说完就摇着头走了。这个故事告诉我们，不要因为自己做不到就说东西不好。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '小狐狸看到了什么？', options: JSON.stringify(['糖葫芦', '葡萄', '草莓', '苹果']), answer: '葡萄', explanation: '小狐狸看到架子上挂着紫色的葡萄', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小狐狸为什么说葡萄是酸的？', options: JSON.stringify(['葡萄本来就是酸的', '它够不着葡萄', '它不喜欢吃葡萄', '葡萄坏了']), answer: '它够不着葡萄', explanation: '它够不到葡萄就说葡萄是酸的', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '这个故事告诉我们什么？', options: JSON.stringify(['葡萄是酸的', '不要找借口', '狐狸不喜欢葡萄', '要多吃水果']), answer: '不要找借口', explanation: '不要因为自己做不到就说东西不好', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小老虎的大喷嚏',
    description: '一个关于讲卫生的有趣故事',
    content: '小老虎感冒了，打了一个大喷嚏。"阿嚏！"这个喷嚏太厉害了，把小兔子的花帽子吹飞了。小兔子追着帽子跑啊跑。小老虎又打了一个喷嚏，"阿嚏！"把小猴子的香蕉吹飞了。小猴子跳起来去接香蕉。小老虎不好意思地说："对不起，我感冒了。"大家都说："没关系，你快点去看医生吧。"小老虎去看了医生，吃了药，感冒好了。它又开开心心和小伙伴们一起玩了。',
    wordCount: 115,
    questions: [
      { order: 1, type: 'CHOICE', question: '小老虎怎么了？', options: JSON.stringify(['发烧了', '感冒了', '肚子疼', '摔倒了']), answer: '感冒了', explanation: '小老虎感冒了', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小老虎的喷嚏把什么吹飞了？', options: JSON.stringify(['帽子香蕉', '气球', '树叶', '纸张']), answer: '帽子香蕉', explanation: '把小兔子的花帽子和小猴子的香蕉吹飞了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小老虎最后去做了什么？', options: JSON.stringify(['看了医生', '道歉了', '回家了', '找妈妈']), answer: '看了医生', explanation: '小老虎去看医生吃了药感冒好了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小刺猬的苹果',
    description: '小刺猬捡苹果的故事',
    content: '秋天来了，森林里的苹果熟了。小刺猬来到苹果树下，看到满地都是红红的苹果。小刺猬想：我要多捡一些，留着冬天吃。小刺猬在地上打起滚来，苹果就扎在了它的刺上。扎了一个又一个，背上背满了苹果。它高高兴兴地往家走。走在路上，苹果香味飘出来，小刺猬忍不住想尝一个。它扭了扭身子，一个苹果掉了下来。小刺猬开心地吃了起来。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '小刺猬用什么方法捡苹果？', options: JSON.stringify(['用袋子装', '在地上打滚让苹果扎在刺上', '用手拿', '用嘴咬']), answer: '在地上打滚让苹果扎在刺上', explanation: '小刺猬打滚苹果就扎在刺上了', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小刺猬为什么想多捡苹果？', options: JSON.stringify(['送朋友', '留着冬天吃', '卖钱', '做苹果酱']), answer: '留着冬天吃', explanation: '小刺猬要多捡一些留着冬天吃', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小刺猬在回家的路上做了什么？', options: JSON.stringify(['睡觉了', '吃了一个苹果', '和朋友玩', '迷路了']), answer: '吃了一个苹果', explanation: '小刺猬扭了扭身子一个苹果掉下来吃了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小兔子的菜园',
    description: '小兔子辛勤劳动的故事',
    content: '小兔子在屋后开了一块菜园。它撒下了青菜种子。每天小兔子都去菜园看看，给种子浇水、拔草。太阳出来了，小兔子怕种子晒坏，给它们搭了小棚子。下雨了，小兔子怕种子淹坏，给它们挖了排水沟。种子慢慢发芽了，长出了绿绿的小苗。小兔子更加用心了。终于，青菜长大了。小兔子收了很多青菜，请朋友们来一起吃。大家都说："自己种的菜最好吃！"',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '小兔子的菜园里种了什么？', options: JSON.stringify(['萝卜', '青菜', '番茄', '土豆']), answer: '青菜', explanation: '小兔子撒下了青菜种子', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '太阳出来时小兔子做了什么？', options: JSON.stringify(['浇水', '搭棚子遮阳', '把菜拔了', '收菜']), answer: '搭棚子遮阳', explanation: '小兔子怕种子晒坏给它们搭了小棚子', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '青菜长大后小兔子做了什么？', options: JSON.stringify(['自己吃了', '请朋友们一起吃', '卖掉了', '存起来了']), answer: '请朋友们一起吃', explanation: '小兔子请朋友们来一起吃青菜', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小海豚顶球',
    description: '小海豚学顶球表演的故事',
    content: '海洋馆里有一只小海豚，它学会了一个新本领——顶球。训练员把球挂在空中，小海豚跳起来用嘴巴顶到了球。观众们都鼓掌欢呼。有一天，训练员把球挂得更高了。小海豚跳了几次都顶不到。它有点泄气。训练员鼓励它说："加油，你一定可以的！"小海豚深吸一口气，用尽全力一跃，终于顶到了球。观众们又一次热烈鼓掌。小海豚开心地在水中翻了个跟头。',
    wordCount: 115,
    questions: [
      { order: 1, type: 'CHOICE', question: '小海豚学会了什么本领？', options: JSON.stringify(['跳舞', '顶球', '唱歌', '画画']), answer: '顶球', explanation: '小海豚学会用嘴巴顶球', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '球被挂更高时小海豚怎么了？', options: JSON.stringify(['放弃了', '有点泄气', '很开心', '不学了']), answer: '有点泄气', explanation: '小海豚跳了几次都顶不到有点泄气', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '训练员怎么鼓励小海豚的？', options: JSON.stringify(['说加油一定可以的', '把球放低了', '不练了', '批评它']), answer: '说加油一定可以的', explanation: '训练员说加油你一定可以的', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小松鼠采果子',
    description: '小松鼠为冬天准备食物的故事',
    content: '秋天到了，小松鼠开始忙碌起来了。它在森林里跑来跑去，找了好多松果和坚果。小松鼠把果子一颗一颗地搬到一个大树洞里藏起来。小鸟飞过来说："你在做什么呀？"小松鼠说："我在储存冬天的食物。"小鸟说："冬天还早呢，先玩一会儿吧。"小松鼠说："等冬天来了再找就来不及了。"冬天到了，外面下着大雪，小松鼠在树洞里吃着储存的果子，心里美滋滋的。',
    wordCount: 115,
    questions: [
      { order: 1, type: 'CHOICE', question: '秋天小松鼠在忙什么？', options: JSON.stringify(['玩', '储存冬天的食物', '睡觉', '旅游']), answer: '储存冬天的食物', explanation: '小松鼠在储存冬天的食物', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小松鼠把果子藏在哪里？', options: JSON.stringify(['树洞里', '地下', '山洞里', '房子里']), answer: '树洞里', explanation: '小松鼠把果子搬到大树洞里藏起来', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '冬天小松鼠过得怎么样？', options: JSON.stringify(['饿肚子', '很冷', '吃着果子心里美滋滋', '后悔了']), answer: '吃着果子心里美滋滋', explanation: '小松鼠在树洞里吃着果子心里美滋滋', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小兔子过河',
    description: '小兔子想办法过河的故事',
    content: '小兔子要去河对岸看望奶奶。可是河上的小桥被大水冲断了。小兔子过不了河，急得团团转。一只大白鹅游过来说："小兔子，我驮你过河吧！"小兔子高兴地跳到大白鹅的背上。大白鹅稳稳地游到了河对岸。小兔子说："谢谢你，大白鹅！"到了奶奶家，奶奶听说大白鹅帮了小兔子，夸大白鹅是乐于助人的好孩子。',
    wordCount: 90,
    questions: [
      { order: 1, type: 'CHOICE', question: '小兔子为什么要过河？', options: JSON.stringify(['去买菜', '去看望奶奶', '去玩', '去上学']), answer: '去看望奶奶', explanation: '小兔子要去河对岸看望奶奶', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '桥怎么样了？', options: JSON.stringify(['桥坏了', '桥被水冲断了', '桥被拆了', '桥在修']), answer: '桥被水冲断了', explanation: '小桥被大水冲断了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '谁帮小兔子过了河？', options: JSON.stringify(['小鱼', '大白鹅', '乌龟', '鸭子']), answer: '大白鹅', explanation: '大白鹅驮小兔子过了河', difficulty: 1 },
    ],
  },
  // ==================== Chinese Level 1 - 中国民间小故事 幼儿版 ====================
  {
    language: 'Chinese',
    level: 1,
    title: '年兽的故事',
    description: '关于过年的传说故事',
    content: '很久很久以前，有一只叫"年"的怪兽。每到除夕，年兽就会从海底出来吃人。人们都很害怕。有一年除夕，一位老爷爷来到了村子。老爷爷穿着红衣服，在门上贴了红纸，还放了鞭炮。年兽来了，看到红色，听到鞭炮声，吓得转身就跑。从此，每年除夕，人们都穿红衣、贴红纸、放鞭炮来赶走年兽。这就是过年的来历。',
    wordCount: 110,
    questions: [
      { order: 1, type: 'CHOICE', question: '年兽什么时候出来？', options: JSON.stringify(['中秋节', '春节', '除夕', '元宵节']), answer: '除夕', explanation: '每年除夕年兽会从海底出来', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '年兽最怕什么？', options: JSON.stringify(['红色和鞭炮声', '水和火', '刀和枪', '烟和雾']), answer: '红色和鞭炮声', explanation: '年兽看到红色听到鞭炮声就吓跑了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '人们用什么方式赶走年兽？', options: JSON.stringify(['穿红衣贴红纸放鞭炮', '躲在家里', '点灯笼', '拜年']), answer: '穿红衣贴红纸放鞭炮', explanation: '人们穿红衣贴红纸放鞭炮赶走年兽', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '牛郎织女',
    description: '关于七夕节的传说故事',
    content: '古时候，有一个叫牛郎的小伙子。他和一头老牛是好朋友。有一天，老牛说："今天会有仙女下凡洗澡，你拿走一件仙女的衣服，她就会做你的妻子。"牛郎按照老牛说的做了。那个仙女叫织女，她留在人间和牛郎结婚了。他们生了两个孩子，生活很幸福。可是王母娘娘把织女带回了天上。牛郎带着孩子追了上去。王母娘娘用银河把他们隔开了。喜鹊被感动了，每年七月初七，喜鹊会在银河上搭一座桥，让牛郎织女相会。',
    wordCount: 150,
    questions: [
      { order: 1, type: 'CHOICE', question: '谁帮牛郎娶到了织女？', options: JSON.stringify(['喜鹊', '老牛', '王母娘娘', '织女自己']), answer: '老牛', explanation: '老牛告诉牛郎怎么找到妻子', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '王母娘娘用什么东西隔开了牛郎和织女？', options: JSON.stringify(['大河', '银河', '高山', '大海']), answer: '银河', explanation: '王母娘娘用银河把他们隔开了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '每年什么时候牛郎织女才能见面？', options: JSON.stringify(['七月初七', '八月十五', '正月十五', '五月初五']), answer: '七月初七', explanation: '每年七月初七喜鹊搭桥让他们相会', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '哪吒闹海',
    description: '小英雄哪吒的故事',
    content: '古时候，陈塘关总兵李靖的夫人生了一个肉球。李靖用剑劈开，里面跳出一个小孩，他就是哪吒。太乙真人收哪吒为徒弟，送给他乾坤圈和混天绫。有一天，哪吒去东海边玩。他用混天绫在水里一搅，龙宫晃动起来。龙王派夜叉去看，被哪吒打死了。龙王三太子去抓哪吒，也被哪吒打死了。龙王大怒，要李靖交出哪吒。哪吒为了不连累父母，自己承担了责任。后来太乙真人用莲花让哪吒复活了。',
    wordCount: 150,
    questions: [
      { order: 1, type: 'CHOICE', question: '哪吒是从什么里面跳出来的？', options: JSON.stringify(['石头', '肉球', '莲花', '蛋']), answer: '肉球', explanation: '李靖劈开肉球里面跳出了哪吒', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '哪吒有哪些法宝？', options: JSON.stringify(['乾坤圈和混天绫', '金箍棒和筋斗云', '宝剑和盾牌', '弓箭和长枪']), answer: '乾坤圈和混天绫', explanation: '太乙真人送了哪吒乾坤圈和混天绫', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '太乙真人用什么让哪吒复活的？', options: JSON.stringify(['仙丹', '莲花', '仙水', '桃子']), answer: '莲花', explanation: '太乙真人用莲花让哪吒复活了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '大禹治水',
    description: '大禹治水的故事',
    content: '很久以前，黄河发大水了。大水淹没了田地，冲倒了房子。人们生活很痛苦。舜帝派大禹去治水。大禹的父亲以前也治过水，他用堵的方法，没有成功。大禹用疏导的方法，挖了很多河道，把水引到大海里。大禹治水很辛苦，十三年里，三次经过自己家门口都没有进去。有一次，他的妻子生了儿子，大禹经过家门口，听到儿子在哭，但还是没有进去。最后，大禹终于治好了洪水。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '大禹用了什么方法治水？', options: JSON.stringify(['堵住水', '疏导引水入海', '求神', '搬家']), answer: '疏导引水入海', explanation: '大禹挖河道把水引到大海', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '大禹治水花了多少年？', options: JSON.stringify(['三年', '十年', '十三年', '八年']), answer: '十三年', explanation: '大禹治水花了十三年', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '大禹几次经过家门口没有进去？', options: JSON.stringify(['一次', '两次', '三次', '四次']), answer: '三次', explanation: '大禹三次经过家门口都没有进去', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '孟姜女哭长城',
    description: '一个感人的民间故事',
    content: '古时候，有一个叫孟姜女的姑娘。她刚结婚，丈夫范喜良就被抓去修长城了。孟姜女在家等了很久很久，丈夫一直没有回来。冬天到了，孟姜女给丈夫做了寒衣，决定去长城找他。孟姜女走了很远很远的路，终于到了长城。可是找来找去都找不到丈夫。有人告诉她，范喜良已经累死了，被埋在长城下面。孟姜女听了，伤心地哭了起来。她哭了三天三夜，泪水把长城冲倒了。她终于看到了丈夫的尸骨。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '孟姜女的丈夫被抓去做什么？', options: JSON.stringify(['种田', '修长城', '打仗', '当官']), answer: '修长城', explanation: '范喜良被抓去修长城了', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '孟姜女为什么哭长城？', options: JSON.stringify(['找不到回家的路', '找不到丈夫', '长城太长了', '天气太冷了']), answer: '找不到丈夫', explanation: '丈夫已经累死被埋在长城下面', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '孟姜女哭了多久？', options: JSON.stringify(['一天一夜', '三天三夜', '七天七夜', '一个月']), answer: '三天三夜', explanation: '孟姜女哭了三天三夜', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '白蛇传',
    description: '白蛇和许仙的故事',
    content: '很久以前，有一条白蛇修炼成了人，她叫白素贞。她和一条青蛇小青一起到人间玩。白素贞遇到了一个叫许仙的年轻人，他们结婚了。他们开了一家药铺，给人治病。可是有个法海和尚说白素贞是蛇妖，要把她抓走。端午节那天，白素贞喝了雄黄酒，变成了一条大白蛇，许仙被吓死了。白素贞去昆仑山偷了仙草救活了许仙。后来法海把白素贞关在了雷峰塔下。小青修炼了很多年，打败了法海，救出了白素贞。',
    wordCount: 150,
    questions: [
      { order: 1, type: 'CHOICE', question: '白素贞是什么变的？', options: JSON.stringify(['白蛇', '白鹤', '白莲', '白狐']), answer: '白蛇', explanation: '白蛇修炼成了人叫白素贞', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '法海为什么要把白素贞抓走？', options: JSON.stringify(['她是坏人', '她是蛇妖', '她犯了法', '她偷了东西']), answer: '她是蛇妖', explanation: '法海说白素贞是蛇妖要把她抓走', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '白素贞被关在了哪里？', options: JSON.stringify(['雷锋塔下', '山洞里', '大海里', '天宫里']), answer: '雷锋塔下', explanation: '法海把白素贞关在了雷峰塔下', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '后羿射日',
    description: '后羿射太阳的故事',
    content: '古时候，天上有十个太阳。十个太阳一起照在大地上，太热了。河水被晒干了，庄稼被晒死了，人们热得没法活。有一个叫后羿的人，他的箭法很准。他决定把多余的太阳射下来。后羿爬到了高山顶上，拉满弓，对准太阳射去。一个太阳被射中了，掉了下来。后羿一箭一个，射了九个太阳。最后一个太阳害怕了，躲了起来。天上只剩下一个太阳了。从此，天气不热不冷，人们过上了好日子。',
    wordCount: 135,
    questions: [
      { order: 1, type: 'CHOICE', question: '天上原来有几个太阳？', options: JSON.stringify(['一个', '五个', '十个', '十二个']), answer: '十个', explanation: '天上原来有十个太阳', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '后羿射了几个太阳？', options: JSON.stringify(['十个', '八个', '九个', '七个']), answer: '九个', explanation: '后羿射了九个太阳', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '最后一个太阳怎么样了？', options: JSON.stringify(['也被射了', '躲起来了', '回家睡觉了', '变暗了']), answer: '躲起来了', explanation: '最后一个太阳害怕躲了起来', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '嫦娥奔月',
    description: '嫦娥飞到月亮上的故事',
    content: '后羿射下九个太阳后，很多人来向他学本领。后羿有一个徒弟叫蓬蒙，他是个坏人。西王母给了后羿一颗仙药，吃了可以飞到天上。后羿不舍得吃，把仙药交给妻子嫦娥保管。有一天，蓬蒙趁后羿不在家，逼嫦娥交出仙药。嫦娥不肯，一口气把仙药吞了下去。嫦娥吃了仙药后，身体变得轻轻的，飞了起来。她一直飞到了月亮上。后羿回来后，看到嫦娥飞走了，非常伤心。从此，嫦娥就住在月亮上的广寒宫里。',
    wordCount: 145,
    questions: [
      { order: 1, type: 'CHOICE', question: '嫦娥吃了什么飞到了月亮上？', options: JSON.stringify(['仙丹', '仙药', '灵芝', '仙草']), answer: '仙药', explanation: '嫦娥把仙药吞了下去就飞到了月亮上', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '嫦娥为什么吃仙药？', options: JSON.stringify(['想飞到月亮上', '被坏人逼的', '不小心吃了', '她想成仙']), answer: '被坏人逼的', explanation: '蓬蒙逼嫦娥交出仙药', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '嫦娥最后住在哪里？', options: JSON.stringify(['广寒宫', '天宫', '月宫', '云朵上']), answer: '广寒宫', explanation: '嫦娥住在月亮上的广寒宫里', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '精卫填海',
    description: '精卫鸟填海的故事',
    content: '很久以前，炎帝有一个小女儿，叫女娃。女娃很喜欢到东海边玩。有一天，女娃在海上划船，突然起了大风浪。小船被打翻了，女娃被淹死了。女娃死后，变成了一只小鸟。这只小鸟叫精卫，长着花脑袋、白嘴巴、红脚丫。精卫很恨大海，它决心要把大海填平。精卫每天从西山上叼树枝和石头，飞到东海上空扔下去。大海嘲笑它说："你就算叼一百万年，也填不平我。"精卫说："我填一千年一万年，总有一天会把你填平的。"',
    wordCount: 145,
    questions: [
      { order: 1, type: 'CHOICE', question: '女娃死后变成了什么？', options: JSON.stringify(['一只小鸟', '一条小鱼', '一朵花', '一颗星星']), answer: '一只小鸟', explanation: '女娃死后变成了一只叫精卫的小鸟', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '精卫每天做什么？', options: JSON.stringify(['唱歌', '叼树枝石头填海', '抓鱼吃', '飞来飞去玩']), answer: '叼树枝石头填海', explanation: '精卫每天叼树枝和石头扔到海里填海', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '精卫为什么要填海？', options: JSON.stringify(['报仇', '大海淹死了它', '它恨大海', '想造陆地']), answer: '大海淹死了它', explanation: '女娃被大海淹死变精卫决心填平大海', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '八仙过海',
    description: '八位神仙过海的故事',
    content: '传说有八位神仙：铁拐李、汉钟离、张果老、吕洞宾、何仙姑、蓝采和、韩湘子和曹国舅。有一天，八位神仙要去参加蟠桃会。他们来到东海边，大海很宽，过不去。吕洞宾说："我们各显神通过海吧。"铁拐李把拐杖扔到海里，站在拐杖上过了海。汉钟离坐在大扇子上过了海。张果老倒骑着毛驴下了海。何仙姑把荷花扔到水上，踩着荷花过了海。八位神仙都用各自的法宝渡过了大海。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '故事里有几位神仙？', options: JSON.stringify(['四位', '六位', '八位', '十位']), answer: '八位', explanation: '故事里有八位神仙', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '铁拐李怎么过海的？', options: JSON.stringify(['坐船', '站在拐杖上', '飞过去', '游泳']), answer: '站在拐杖上', explanation: '铁拐李把拐杖扔到海里站在上面过海', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '何仙姑用什么法宝过海？', options: JSON.stringify(['扇子', '荷花', '毛驴', '箫']), answer: '荷花', explanation: '何仙姑把荷花扔到水上踩着过海', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '神笔马良',
    description: '善良的马良用神笔帮助穷人的故事',
    content: '古时候，有一个穷孩子叫马良。他很喜欢画画，可是买不起笔。他用树枝在地上画，用石头在墙上画。有一天晚上，一位白胡子老爷爷送给马良一支神笔。这支笔画什么就能变成真的。马良用神笔给穷人画耕牛、画水车。皇帝听说了，让马良画金山。马良画了大海，又画了金山和船。皇帝坐上船去搬金子，马良又画了几笔大风。大风吹翻了船，皇帝掉进海里淹死了。从此，马良继续用神笔帮助穷人。',
    wordCount: 145,
    questions: [
      { order: 1, type: 'CHOICE', question: '马良用什么画画？', options: JSON.stringify(['毛笔', '神笔', '铅笔', '蜡笔']), answer: '神笔', explanation: '老爷爷送给马良一支神笔', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '马良用神笔帮穷人画了什么？', options: JSON.stringify(['黄金', '耕牛和水车', '房子', '衣服']), answer: '耕牛和水车', explanation: '马良用神笔给穷人画耕牛和水车', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '皇帝最后怎么样了？', options: JSON.stringify(['得到了金山', '掉海里淹死了', '很开心', '把笔抢走了']), answer: '掉海里淹死了', explanation: '皇帝坐船去搬金子被大风吹翻船淹死了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小鲤鱼跳龙门',
    description: '小鲤鱼勇敢跳龙门的故事',
    content: '小鲤鱼们听奶奶说，在大河的尽头有一个龙门。如果谁能跳过龙门，就能变成一条大龙。小鲤鱼们决定去找龙门。它们游啊游，游了很久很久。路上遇到了水草缠住了身子，遇到了大石头挡住了路。小鲤鱼们团结合作，一起克服了困难。终于，它们来到了一个大瀑布前。奶奶说，这个瀑布就是龙门。瀑布好高好高，水好急好急。小鲤鱼们一条一条地跳。跳啊跳，终于有一条小鲤鱼跳过了龙门。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '跳过龙门会变成什么？', options: JSON.stringify(['大鱼', '大龙', '神仙', '飞鸟']), answer: '大龙', explanation: '跳过龙门就能变成一条大龙', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '龙门是什么？', options: JSON.stringify(['一座桥', '一个大瀑布', '一扇门', '一座山']), answer: '一个大瀑布', explanation: '龙门是一个好高好高的大瀑布', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小鲤鱼们是怎么到达龙门的？', options: JSON.stringify(['团结合作克服困难', '请人帮忙', '坐船', '飞过去的']), answer: '团结合作克服困难', explanation: '小鲤鱼们团结合作一起克服了困难', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '人参娃娃',
    description: '人参娃娃帮助穷人的故事',
    content: '在大山里，住着一个人参娃娃。他穿着红肚兜，头上扎着小辫子，可爱极了。有一个姓王的财主，对长工们很坏。人参娃娃想帮助长工们。有一天，长工小虎子在山上砍柴，遇到了人参娃娃。人参娃娃和小虎子成了好朋友。人参娃娃帮小虎子砍柴，还给他人参吃。财主知道了，想抓住人参娃娃。人参娃娃很聪明，带着财主在山上转来转去。最后，财主掉进了山沟里。从此，长工们过上了好日子。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '人参娃娃长得什么样？', options: JSON.stringify(['穿红肚兜扎小辫', '穿绿衣服', '戴帽子', '光着脚']), answer: '穿红肚兜扎小辫', explanation: '人参娃娃穿着红肚兜扎着小辫子', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '人参娃娃和谁成了好朋友？', options: JSON.stringify(['财主', '小虎子', '老爷爷', '小兔子']), answer: '小虎子', explanation: '人参娃娃和小虎子成了好朋友', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '财主最后怎么样了？', options: JSON.stringify(['抓到了人参娃娃', '掉进了山沟里', '很开心', '回家了']), answer: '掉进了山沟里', explanation: '财主掉进了山沟里', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '金斧头和银斧头',
    description: '一个关于诚实的故事',
    content: '有一个穷樵夫，他的斧头掉进了河里。樵夫很伤心，因为那是他唯一的斧头。河神出现了，从河里捞出一把金斧头问："这是你的斧头吗？"樵夫说："不是。"河神又捞出一把银斧头问："这是你的吗？"樵夫说："不是。"河神又捞出一把铁斧头。樵夫高兴地说："这把是我的！"河神被他的诚实感动了，把金斧头和银斧头也送给了他。一个贪心的人听说了，也到河边把斧头扔进河里。河神捞出一把金斧头，贪心的人说："是我的。"河神生气地说："你不诚实！"说完就不见了。',
    wordCount: 165,
    questions: [
      { order: 1, type: 'CHOICE', question: '樵夫丢的是什么斧头？', options: JSON.stringify(['金斧头', '银斧头', '铁斧头', '铜斧头']), answer: '铁斧头', explanation: '樵夫丢的是自己唯一的铁斧头', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '河神为什么把金斧头和银斧头也送给樵夫？', options: JSON.stringify(['樵夫很穷', '樵夫很诚实', '樵夫很聪明', '河神很开心']), answer: '樵夫很诚实', explanation: '河神被樵夫的诚实感动了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '贪心的人说金斧头是他的，河神怎么做了？', options: JSON.stringify(['把金斧头给他了', '生气地走了', '教训了他', '给了他银斧头']), answer: '生气地走了', explanation: '河神生气地说你不诚实就不见了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '老虎学艺',
    description: '老虎向猫学本领的故事',
    content: '从前，老虎虽然很大，但什么本领都没有。它听说猫很厉害，就去拜猫做老师。猫教老虎学本领，教它扑、教它抓、教它咬。老虎学了本领后，觉得自己很厉害了。它想：如果我把猫吃掉，我才是最厉害的。老虎趁猫不注意，向猫扑了过去。猫早有防备，一下子爬到了一棵大树上。老虎不会爬树，只能在树下干瞪眼。猫说："幸亏我留了一手，没有教你爬树。"',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '老虎拜谁做老师？', options: JSON.stringify(['狮子', '猫', '豹子', '狗']), answer: '猫', explanation: '老虎拜猫做老师学本领', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '猫教了老虎哪些本领？', options: JSON.stringify(['跑跳滚', '扑抓咬', '游泳潜水', '爬树飞翔']), answer: '扑抓咬', explanation: '猫教老虎扑抓咬', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '猫留了一手是什么本领？', options: JSON.stringify(['跑步', '爬树', '游泳', '飞']), answer: '爬树', explanation: '猫没有教老虎爬树', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '猫和老鼠',
    description: '猫和老鼠为什么是仇人的故事',
    content: '很久以前，玉皇大帝要选十二种动物做生肖。猫和老鼠是好朋友，它们说好一起去报名。可是老鼠很狡猾。第二天早上，老鼠自己偷偷跑去了。猫睡觉醒来，发现老鼠已经走了。它赶紧追到天宫，可是十二生肖已经选完了。猫很生气，从此见到老鼠就追，要吃掉老鼠。这就是猫和老鼠为什么是仇人的故事。',
    wordCount: 100,
    questions: [
      { order: 1, type: 'CHOICE', question: '玉皇大帝要选什么？', options: JSON.stringify(['神仙', '十二生肖', '大臣', '将军']), answer: '十二生肖', explanation: '玉皇大帝要选十二种动物做生肖', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '老鼠做了什么坏事？', options: JSON.stringify(['自己偷偷去报名', '打了猫', '偷了东西', '骗了猫']), answer: '自己偷偷去报名', explanation: '老鼠自己偷偷跑去了没有叫猫', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '猫为什么见到老鼠就追？', options: JSON.stringify(['老鼠偷吃了猫的食物', '老鼠没有叫猫去报名', '老鼠打了猫', '老鼠骂了猫']), answer: '老鼠没有叫猫去报名', explanation: '老鼠没有叫猫一起去报名猫很生气', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '猴子捞月',
    description: '猴子们捞月亮的有趣故事',
    content: '一天晚上，猴子们在山上玩。一只小猴子看到水井里有个月亮，吓了一跳。它大叫："不好了！月亮掉到井里了！"老猴子跑过来一看，井里真的有一个月亮。老猴子说："我们快把月亮捞上来吧！"于是，猴子们一个接一个倒挂在树上，最下面的小猴子伸手去捞月亮。手刚碰到水，月亮就碎了。小猴子吓得缩回手。老猴子一抬头，看到月亮还在天上挂着呢。它说："不用捞了，月亮好好的在天上挂着呢！井里的是月亮的影子。"',
    wordCount: 150,
    questions: [
      { order: 1, type: 'CHOICE', question: '小猴子在井里看到了什么？', options: JSON.stringify(['月亮', '太阳', '星星', '石头']), answer: '月亮', explanation: '小猴子看到水井里有个月亮', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '猴子们怎么捞月亮？', options: JSON.stringify(['用网捞', '倒挂在树上捞', '伸手捞', '用棍子捞']), answer: '倒挂在树上捞', explanation: '猴子们一个接一个倒挂在树上捞月亮', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '井里的月亮到底是什么？', options: JSON.stringify(['真的月亮', '月亮的影子', '一个圆饼', '一条鱼']), answer: '月亮的影子', explanation: '井里的是月亮的影子', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '田螺姑娘',
    description: '田螺变成姑娘报恩的故事',
    content: '有一个年轻人叫谢端，他从小父母双亡，一个人生活。他每天种地很辛苦，但家里很穷。有一天，他在路上捡到一个大田螺，把田螺养在了水缸里。从此，他每天回家都能看到桌子上摆着热腾腾的饭菜。谢端很奇怪。有一天，他假装出门，偷偷躲起来看。只见水缸里走出来一个美丽的姑娘，开始做饭。原来田螺是个仙女。田螺姑娘说："你勤劳善良，我是来报答你的。"后来谢端和田螺姑娘结婚了，过上了幸福的生活。',
    wordCount: 145,
    questions: [
      { order: 1, type: 'CHOICE', question: '谢端在路边捡到了什么？', options: JSON.stringify(['一个田螺', '一块金子', '一个鸡蛋', '一朵花']), answer: '一个田螺', explanation: '谢端在路上捡到一个大田螺', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '谁在给谢端做饭？', options: JSON.stringify(['邻居', '田螺姑娘', '妈妈', '姐姐']), answer: '田螺姑娘', explanation: '田螺变成了美丽的姑娘给谢端做饭', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '田螺姑娘为什么来帮谢端？', options: JSON.stringify(['他有钱', '他勤劳善良', '他长得帅', '他救了她']), answer: '他勤劳善良', explanation: '田螺姑娘说谢端勤劳善良是来报答他的', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '宝莲灯',
    description: '沉香救母的故事',
    content: '古时候，有一个叫沉香的孩子。他的妈妈是三圣母，被舅舅二郎神压在华山下面。沉香长大后，决心要救出妈妈。他拜霹雳大仙为师，苦练本领。大仙送给他一把神斧。沉香来到华山，可是华山那么大，他找不到妈妈。沉香急得大哭。他的哭声感动了土地公公。土地公公告诉他妈妈被压在什么地方。沉香举起神斧，用力劈向华山。只听轰隆一声巨响，华山被劈开了。沉香终于救出了妈妈，他们幸福地生活在一起了。',
    wordCount: 135,
    questions: [
      { order: 1, type: 'CHOICE', question: '沉香的妈妈被压在哪里？', options: JSON.stringify(['华山', '泰山', '黄山', '峨眉山']), answer: '华山', explanation: '沉香的妈妈被压在华山下面', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '谁帮沉香找到了妈妈的位置？', options: JSON.stringify(['孙悟空', '土地公公', '二郎神', '大仙']), answer: '土地公公', explanation: '土地公公被哭声感动告诉了沉香', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '沉香用什么劈开了华山？', options: JSON.stringify(['宝剑', '神斧', '大锤', '大刀']), answer: '神斧', explanation: '沉香举起神斧用力劈向华山', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '百鸟朝凤',
    description: '凤凰成为百鸟之王的故事',
    content: '很久以前，凤凰只是一只很普通的鸟，没有漂亮的羽毛。别的鸟都嘲笑它丑。凤凰不生气，它每天勤劳地工作。它把别的鸟扔掉的果实收集起来，藏在山洞里。有一年，森林里大旱，鸟儿们找不到食物，都要饿死了。凤凰打开山洞，把储存的果实分给大家吃。鸟儿们得救了。为了感谢凤凰，每只鸟都从身上拔下一根最漂亮的羽毛，做成了一件五彩的羽毛衣服送给凤凰。凤凰穿上后，变成了最漂亮的鸟。大家推举凤凰做百鸟之王。',
    wordCount: 150,
    questions: [
      { order: 1, type: 'CHOICE', question: '以前凤凰长什么样？', options: JSON.stringify(['很漂亮', '很普通很丑', '很特别', '五彩的']), answer: '很普通很丑', explanation: '凤凰以前只是一只很普通的鸟', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '凤凰用什么救了大家？', options: JSON.stringify(['食物', '水', '羽毛', '钱']), answer: '食物', explanation: '凤凰把储存的果实分给大家吃', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '凤凰是怎么变漂亮的？', options: JSON.stringify(['自己长出了羽毛', '鸟儿们送它羽毛衣', '神仙帮了它', '变魔术']), answer: '鸟儿们送它羽毛衣', explanation: '鸟儿们拔下羽毛做成衣服送给凤凰', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '十二生肖的故事',
    description: '十二生肖排名的传说',
    content: '玉皇大帝要选十二种动物当生肖。谁先到天宫，谁就排在前面。动物们都出发了。老鼠和牛一起走。牛走得快，老鼠走得很慢。老鼠说："牛大哥，让我坐在你的背上吧。"牛同意了。到了天宫门口，老鼠从牛背上跳下来，第一个跑了进去。玉皇大帝说："老鼠第一，牛第二。"接着，老虎、兔子、龙、蛇、马、羊、猴子、鸡、狗、猪都到了。从此，十二生肖的排名就是这样来的。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '玉皇大帝要选什么？', options: JSON.stringify(['神仙', '十二生肖', '将军', '大臣']), answer: '十二生肖', explanation: '玉皇大帝要选十二种动物当生肖', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '谁是第一个到达的？', options: JSON.stringify(['牛', '老鼠', '老虎', '兔子']), answer: '老鼠', explanation: '老鼠从牛背上跳下来第一个跑了进去', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '老鼠用了什么方法拿到第一？', options: JSON.stringify(['跑得最快', '坐在牛背上最后跳下来', '飞过来的', '抄近路']), answer: '坐在牛背上最后跳下来', explanation: '老鼠坐在牛背上最后跳下来第一个进去', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '米芾学书',
    description: '书法家米芾学写字的故事',
    content: '米芾小时候家里很穷，但他很喜欢写字。他买不起纸，就在地上用树枝练字。后来，村里有一位老先生教他写字。老先生说："你要用心写，一笔一画都要认真。"米芾很用功，每天都练字。他练了三年，字写得越来越好了。有一天，老先生拿出一块布说："你现在可以在这块布上写了。"米芾在布上写了一首诗，每一个字都写得非常好。老先生很高兴。后来，米芾成了大书法家。',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: '米芾小时候喜欢做什么？', options: JSON.stringify(['画画', '写字', '读书', '唱歌']), answer: '写字', explanation: '米芾小时候很喜欢写字', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '买不起纸的时候米芾用什么练字？', options: JSON.stringify(['树枝在地上写', '在墙上写', '用木炭写', '用手指写']), answer: '树枝在地上写', explanation: '米芾买不起纸就在地上用树枝练字', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '米芾后来成了什么？', options: JSON.stringify(['画家', '书法家', '诗人', '作家']), answer: '书法家', explanation: '米芾后来成了大书法家', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '七色花',
    description: '一朵神奇的七色花的故事',
    content: '有一个小女孩叫珍妮。她得到了一朵七色花，有七片不同颜色的花瓣。只要撕下一片花瓣，说出愿望，愿望就能实现。珍妮先用花瓣回到了家，又用花瓣去了北极，还用花瓣得到了很多玩具。可是珍妮并不开心。最后，她看到一个小男孩不能走路。珍妮撕下最后一片花瓣说："让这个小男孩健康起来吧！"小男孩站起来了，和珍妮开心地玩了起来。珍妮这才发现，帮助别人的快乐才是真正的快乐。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '七色花有几片花瓣？', options: JSON.stringify(['五片', '六片', '七片', '八片']), answer: '七片', explanation: '七色花有七片不同颜色的花瓣', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '珍妮用最后一片花瓣做了什么？', options: JSON.stringify(['要了很多玩具', '让小男孩健康起来', '去了北极', '回家了']), answer: '让小男孩健康起来', explanation: '珍妮让小男孩站起来了', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '故事告诉我们什么是真正的快乐？', options: JSON.stringify(['得到玩具', '帮助别人', '去旅游', '吃美食']), answer: '帮助别人', explanation: '帮助别人的快乐才是真正的快乐', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '渔夫和金鱼',
    description: '一个关于不要贪心的故事',
    content: '渔夫在海里捕到了一条金鱼。金鱼说："你放了我，我可以满足你的愿望。"渔夫放了金鱼，回家告诉了老太婆。老太婆说："去要一个新木盆。"金鱼给了。老太婆又说："要一座新房子。"金鱼又给了。老太婆越来越贪心，要当女皇，金鱼也答应了。最后，老太婆要当海上的女霸王，让金鱼来服侍她。金鱼一句话也没说，游走了。渔夫回到家，发现一切又变回了原来的样子：破房子、破木盆。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '渔夫捕到了什么？', options: JSON.stringify(['一条金鱼', '一条大鱼', '一只乌龟', '一只虾']), answer: '一条金鱼', explanation: '渔夫捕到了一条金鱼', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '老太婆最后一个愿望是什么？', options: JSON.stringify(['当女皇', '当海上的女霸王', '要大房子', '要很多钱']), answer: '当海上的女霸王', explanation: '老太婆要当海上的女霸王', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '最后一切变回了原样，说明了什么？', options: JSON.stringify(['金鱼很小气', '太贪心最终什么也得不到', '老太婆很可怜', '渔夫没本事']), answer: '太贪心最终什么也得不到', explanation: '因为老太婆太贪心所以一切都没了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小红帽',
    description: '小红帽智斗大灰狼的故事',
    content: '有一个小姑娘，她总戴着一顶红帽子，大家叫她小红帽。有一天，妈妈让小红帽去看望生病的外婆。小红帽在路上遇到了大灰狼。大灰狼问小红帽去哪里，小红帽说去外婆家。大灰狼先跑到外婆家，把外婆吞进了肚子里，然后装成外婆躺在床上。小红帽到了以后，看到"外婆"的嘴巴很大，说："外婆，你的嘴巴怎么这么大？"大灰狼说："为了吃掉你！"这时，一个猎人冲了进来，打死了大灰狼，救出了外婆。',
    wordCount: 145,
    questions: [
      { order: 1, type: 'CHOICE', question: '小红帽要去哪里？', options: JSON.stringify(['学校', '外婆家', '公园', '超市']), answer: '外婆家', explanation: '小红帽要去看望生病的外婆', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '大灰狼先把谁吞进了肚子里？', options: JSON.stringify(['小红帽', '外婆', '猎人', '妈妈']), answer: '外婆', explanation: '大灰狼把外婆吞进了肚子里', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '谁救了小红帽和外婆？', options: JSON.stringify(['妈妈', '爸爸', '猎人', '邻居']), answer: '猎人', explanation: '猎人冲进来打死了大灰狼救出了外婆', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '白雪公主',
    description: '白雪公主和七个小矮人的故事',
    content: '从前，有一个美丽的公主叫白雪公主。她的后母王后嫉妒她的美丽，派人要把白雪公主杀掉。那个人不忍心，放了白雪公主。白雪公主逃到了森林里，遇到了七个小矮人。小矮人让白雪公主住在他们家里。王后知道白雪公主还活着，就扮成老婆婆，拿毒苹果给白雪公主吃。白雪公主吃了毒苹果后昏过去了。一位王子路过，吻了白雪公主。白雪公主醒了过来。王子和白雪公主结婚了，过上了幸福的生活。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '白雪公主逃到了哪里？', options: JSON.stringify(['森林里', '城堡里', '河边', '山上']), answer: '森林里', explanation: '白雪公主逃到了森林里', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '白雪公主遇到了几个小矮人？', options: JSON.stringify(['六个', '七个', '八个', '五个']), answer: '七个', explanation: '白雪公主遇到了七个小矮人', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '王后用什么东西害白雪公主？', options: JSON.stringify(['毒苹果', '毒花', '毒药', '毒蛇']), answer: '毒苹果', explanation: '王后拿毒苹果给白雪公主吃', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '丑小鸭',
    description: '丑小鸭变成白天鹅的故事',
    content: '鸭妈妈孵出了一窝小鸭子。有一只小鸭子长得很丑，大家都叫它丑小鸭。哥哥姐姐们都欺负它，连小鸡也笑它。丑小鸭很难过，离开了家。它独自在外面流浪。秋天到了，丑小鸭看到一群白天鹅从天上飞过，它很羡慕。冬天很冷，丑小鸭差点冻僵了。春天来了，丑小鸭长大了。它走到水边，看到自己的倒影。它不再是一只丑小鸭了，它变成了一只美丽的白天鹅！',
    wordCount: 115,
    questions: [
      { order: 1, type: 'CHOICE', question: '丑小鸭为什么被大家欺负？', options: JSON.stringify(['它很丑', '它很笨', '它很懒', '它很坏']), answer: '它很丑', explanation: '丑小鸭长得丑所以被欺负', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '丑小鸭在秋天看到了什么？', options: JSON.stringify(['大雁', '白天鹅', '老鹰', '孔雀']), answer: '白天鹅', explanation: '丑小鸭看到一群白天鹅从天上飞过', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '春天到了丑小鸭变成了什么？', options: JSON.stringify(['大黄鸭', '白天鹅', '大雁', '孔雀']), answer: '白天鹅', explanation: '丑小鸭变成了一只美丽的白天鹅', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '卖火柴的小女孩',
    description: '一个让人感动的故事',
    content: '圣诞节的晚上，天很冷，还下着大雪。一个小女孩在街上卖火柴。她没有鞋子，穿得很单薄。可是没有人买她的火柴。她又冷又饿，不敢回家，因为爸爸会打她。小女孩点燃了一根火柴取暖。火光里，她看到了一个大火炉。火柴灭了，火炉不见了。她又点燃一根火柴，看到了香喷喷的烤鹅。火柴又灭了。她点燃了第三根火柴，看到了慈祥的奶奶。奶奶带着她飞到了没有寒冷、没有饥饿的地方。',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: '小女孩在卖什么？', options: JSON.stringify(['火柴', '花', '面包', '玩具']), answer: '火柴', explanation: '小女孩在街上卖火柴', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '点燃第一根火柴小女孩看到了什么？', options: JSON.stringify(['烤鹅', '火炉', '奶奶', '圣诞树']), answer: '火炉', explanation: '她看到一个大火炉', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '第三根火柴小女孩看到了谁？', options: JSON.stringify(['妈妈', '奶奶', '爸爸', '姐姐']), answer: '奶奶', explanation: '她看到了慈祥的奶奶', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '皇帝的新装',
    description: '皇帝被骗穿新衣服的有趣故事',
    content: '有一个皇帝非常喜欢穿新衣服。有两个骗子说能织出世界上最漂亮的布，而且笨人看不到。皇帝给了他们很多金子。两个骗子假装在织布，其实什么也没织。皇帝派大臣去看，大臣怕别人说自己笨，都说布很漂亮。皇帝穿着"新衣服"上街了。其实皇帝什么也没穿，光着身子在街上走。大人们都不敢说。一个小孩子喊道："皇帝什么也没穿呀！"大家这才敢笑。皇帝知道自己被骗了，只好硬着头皮走完了。',
    wordCount: 145,
    questions: [
      { order: 1, type: 'CHOICE', question: '两个骗子说谁看不到他们织的布？', options: JSON.stringify(['坏人', '笨人', '小孩', '老人']), answer: '笨人', explanation: '骗子说笨人看不到布', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '谁说出皇帝没穿衣服的真相？', options: JSON.stringify(['大臣', '一个小孩', '皇帝自己', '皇后']), answer: '一个小孩', explanation: '一个小孩子喊皇帝什么也没穿', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '大臣为什么说布很漂亮？', options: JSON.stringify(['布真的很漂亮', '怕别人说自己笨', '骗子威胁他们', '他们收了钱']), answer: '怕别人说自己笨', explanation: '大臣怕别人说自己笨所以都说布漂亮', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '小拇指',
    description: '一个小小的小男孩的冒险故事',
    content: '有一对穷夫妻生了七个儿子。最小的儿子生下来只有拇指那么大，大家叫他小拇指。家里太穷了，养不起这么多孩子。爸爸妈妈把孩子们带到森林里扔掉了。别的哥哥都很害怕，小拇指很聪明。他一路扔小石子做记号，带着哥哥们回到了家。第二次，爸爸妈妈又把孩子们扔到了更远的森林里。小拇指用面包屑做记号，可是面包屑被小鸟吃掉了。他们迷路了，走到了一个巨人的家里。小拇指用智慧打败了巨人，还得到了巨人的财宝，一家人过上了幸福的生活。',
    wordCount: 160,
    questions: [
      { order: 1, type: 'CHOICE', question: '小拇指有多大？', options: JSON.stringify(['拇指那么大', '手掌那么大', '拳头那么大', '手指那么长']), answer: '拇指那么大', explanation: '小拇指只有拇指那么大', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '第一次小拇指用什么方法带哥哥们回家？', options: JSON.stringify(['面包屑', '小石子', '记号笔', '记忆路']), answer: '小石子', explanation: '小拇指一路扔小石子做记号', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '小拇指打败了谁？', options: JSON.stringify(['大灰狼', '巨人', '老虎', '妖怪']), answer: '巨人', explanation: '小拇指用智慧打败了巨人', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '三个小矮人',
    description: '善良的小女孩被三个小矮人帮助的故事',
    content: '有一个善良的小女孩，她的继母对她很不好。冬天，继母让小女孩到森林里采草莓。小女孩来到了森林里，遇到了三个小矮人。小矮人问她："这么冷的天，你在找什么？"小女孩说："我在找草莓。"小矮人见她很有礼貌，就给了她一些草莓，还祝福她越来越漂亮、越来越富有。小女孩回到家，果然变美了。继母的亲生女儿很嫉妒，也去森林里找小矮人。可是她没礼貌，小矮人什么也没给她。她回到家更丑了。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '继母让小女孩冬天去森林里做什么？', options: JSON.stringify(['采蘑菇', '采草莓', '砍柴', '找花']), answer: '采草莓', explanation: '继母让小女孩到森林里采草莓', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '小矮人为什么祝福小女孩？', options: JSON.stringify(['她长得漂亮', '她很有礼貌', '她送礼物了', '她哭了']), answer: '她很有礼貌', explanation: '小矮人见小女孩很有礼貌就祝福了她', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '继母的女儿去找小矮人结果怎样？', options: JSON.stringify(['变漂亮了', '什么也没得到变得更丑了', '得到了很多礼物', '成了公主']), answer: '什么也没得到变得更丑了', explanation: '因为她没礼貌小矮人什么也没给她', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '睡美人',
    description: '公主沉睡百年被王子唤醒的故事',
    content: '从前，有一位公主出生了。一位坏仙女诅咒说："公主十五岁时会被纺车刺破手指，然后睡一百年。"另一位好仙女把诅咒改为："沉睡一百年后，会有一位王子唤醒她。"公主十五岁时，果然被纺车刺破了手指，沉睡了过去。整个城堡的人都跟着睡着了。城堡周围长满了荆棘。一百年后，一位王子穿过荆棘，来到了城堡。他看到了公主，公主很美很美。王子轻轻吻了公主。公主醒了过来，整个城堡的人都醒了。王子和公主结婚了。',
    wordCount: 150,
    questions: [
      { order: 1, type: 'CHOICE', question: '坏仙女诅咒公主会怎么样？', options: JSON.stringify(['会消失', '沉睡一百年', '变成青蛙', '会飞走']), answer: '沉睡一百年', explanation: '坏仙女诅咒公主会睡一百年', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '公主是被什么刺破手指的？', options: JSON.stringify(['针', '纺车', '刀', '刺']), answer: '纺车', explanation: '公主被纺车刺破了手指', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '公主是怎么醒过来的？', options: JSON.stringify(['被王子吻醒', '自己醒了', '被仙女叫醒', '一百年到了']), answer: '被王子吻醒', explanation: '王子轻轻吻了公主公主就醒了', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '阿里巴巴和四十大盗',
    description: '阿里巴巴智斗四十大盗的故事',
    content: '有一个穷人叫阿里巴巴。有一天，他在山上看到四十个大盗在喊："芝麻开门！"山洞口就打开了。大盗们把金银财宝放进去后，喊"芝麻关门"就走了。等大盗走后，阿里巴巴也喊"芝麻开门"，进去拿了一些金币回家。哥哥知道后也去拿金币，却忘了开门的口令，被大盗关在了山洞里。大盗们发现有人进来过，就去找阿里巴巴报仇。阿里巴巴的女仆很聪明，她用热水烫死了藏在油罐里的大盗们。阿里巴巴把财宝分给了穷人。',
    wordCount: 160,
    questions: [
      { order: 1, type: 'CHOICE', question: '打开山洞的口令是什么？', options: JSON.stringify(['西瓜开门', '芝麻开门', '黄豆开门', '花生开门']), answer: '芝麻开门', explanation: '大盗喊芝麻开门山洞口就打开了', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '大盗们怎么藏身来报仇？', options: JSON.stringify(['躲在树后', '藏在油罐里', '躲在房间里', '藏在山洞里']), answer: '藏在油罐里', explanation: '大盗藏在油罐里想报仇', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '谁消灭了大盗们？', options: JSON.stringify(['阿里巴巴', '哥哥', '女仆', '国王']), answer: '女仆', explanation: '聪明的女仆用热水烫死了大盗', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '渔童',
    description: '一个神奇的渔童帮助渔民的故事',
    content: '老渔夫在河里捕鱼，捕到了一个白玉做的鱼盆。鱼盆上刻着一个渔童。晚上，渔童从鱼盆里跳出来，手里拿着鱼竿。渔童甩了甩鱼竿，鱼钩上就挂着一粒金豆子。渔童每天夜里都出来，老渔夫有了很多金豆子。外国传教士知道了，想抢走鱼盆。传教士说鱼盆是他的，把老渔夫告上了公堂。在公堂上，老渔夫把鱼盆打碎了。渔童从鱼盆里跳出来，用鱼竿把传教士和县官都扔进了河里。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '老渔夫捕到了什么？', options: JSON.stringify(['一条大鱼', '一个白玉鱼盆', '一只乌龟', '一块金子']), answer: '一个白玉鱼盆', explanation: '老渔夫捕到了一个白玉做的鱼盆', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '渔童甩鱼竿会变出什么？', options: JSON.stringify(['金豆子', '银元宝', '珍珠', '宝石']), answer: '金豆子', explanation: '渔童甩鱼竿钩上就挂着一粒金豆子', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '渔童最后怎么惩罚了坏人？', options: JSON.stringify(['把他们变成了石头', '扔进了河里', '打死了他们', '把他们变小了']), answer: '扔进了河里', explanation: '渔童把传教士和县官都扔进了河里', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '聚宝盆',
    description: '一个神奇的聚宝盆的故事',
    content: '有一个农夫叫张良。他在山上挖到了一个瓦盆。这个瓦盆很神奇，放进去一个东西，就会变成很多一样的东西。张良放进去一粒米，就出来一盆米。放进去一块金子，就出来一盆金子。地主知道了，要来抢聚宝盆。张良的爸爸不小心掉进了盆里，结果出来了很多张爸爸。地主说："怎么有这么多一模一样的人？"张良说："这些都是我的爸爸。"地主没有办法，只好走了。张良用聚宝盆帮助了很多穷人。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '张良挖到了什么？', options: JSON.stringify(['一个瓦盆', '一块金子', '一个花瓶', '一口锅']), answer: '一个瓦盆', explanation: '张良在山上挖到了一个瓦盆', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '聚宝盆有什么神奇之处？', options: JSON.stringify(['能变出食物', '能变出很多同样的东西', '能治病', '能说话']), answer: '能变出很多同样的东西', explanation: '放进去一个东西就会变出很多一样的东西', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '张良用聚宝盆做了什么？', options: JSON.stringify(['自己发财了', '帮助了很多穷人', '交给了皇帝', '藏起来了']), answer: '帮助了很多穷人', explanation: '张良用聚宝盆帮助了很多穷人', difficulty: 1 },
    ],
  },
  {
    language: 'Chinese',
    level: 1,
    title: '花木兰替父从军',
    description: '花木兰女扮男装的故事',
    content: '汉朝的时候，匈奴来侵犯我们的国家。皇帝要每家每户都出一名男子去打仗。木兰的父亲年纪大了，弟弟还很小。木兰很难过，她决定女扮男装替父亲去当兵。木兰买了马，穿上盔甲，告别了家人出发了。在军营里，木兰和男兵们一起训练。她不怕苦不怕累，练得比男兵还好。在战场上，木兰非常勇敢，立了很多功劳。打了十二年仗，没人发现她是女孩子。战争胜利后，木兰回到了家乡，穿上了女儿装。伙伴们看了都很惊讶。',
    wordCount: 165,
    questions: [
      { order: 1, type: 'CHOICE', question: '木兰为什么要替父亲从军？', options: JSON.stringify(['父亲年纪大了弟弟还小', '她想去玩', '家里没人', '她喜欢打仗']), answer: '父亲年纪大了弟弟还小', explanation: '父亲年纪大了弟弟还很小', difficulty: 1 },
      { order: 2, type: 'CHOICE', question: '木兰当了几年兵？', options: JSON.stringify(['五年', '八年', '十二年', '十五年']), answer: '十二年', explanation: '木兰打了十二年仗', difficulty: 1 },
      { order: 3, type: 'CHOICE', question: '战友们知道木兰是女孩子吗？', options: JSON.stringify(['知道', '不知道', '有人知道', '后来才知道']), answer: '不知道', explanation: '十二年来没人发现她是女孩子', difficulty: 1 },
    ],
  },
  // ==================== English Level 2 ====================
  {
    language: 'English',
    level: 2,
    title: 'My Pet Dog',
    description: 'A story about taking care of a pet dog',
    content: 'I have a pet dog named Buddy. He is a golden retriever with shiny fur. Every morning, I feed him and take him for a walk in the neighborhood. Buddy loves to fetch the ball at the park. He is very smart and knows many tricks. When I come home from school, Buddy always wags his tail happily. Last weekend, we went to the beach. Buddy swam in the sea for the first time. He was so excited! Taking care of a dog is a big responsibility, but it brings me so much joy.',
    wordCount: 95,
    questions: [
      { order: 1, type: 'CHOICE', question: 'What kind of dog is Buddy?', options: JSON.stringify(['Golden retriever', 'German shepherd', 'Poodle', 'Husky']), answer: 'Golden retriever', explanation: 'Buddy is a golden retriever with shiny fur.', difficulty: 2 },
      { order: 2, type: 'CHOICE', question: 'What does Buddy do when the owner comes home?', options: JSON.stringify(['Barks loudly', 'Wags his tail', 'Hides', 'Sleeps']), answer: 'Wags his tail', explanation: 'Buddy always wags his tail happily when I come home.', difficulty: 2 },
      { order: 3, type: 'CHOICE', question: 'Where did they go last weekend?', options: JSON.stringify(['Park', 'Beach', 'School', 'Store']), answer: 'Beach', explanation: 'Last weekend, we went to the beach.', difficulty: 2 },
      { order: 4, type: 'CHOICE', question: 'What did Buddy do for the first time at the beach?', options: JSON.stringify(['Ran', 'Jumped', 'Swam', 'Flew']), answer: 'Swam', explanation: 'Buddy swam in the sea for the first time.', difficulty: 2 },
    ],
  },
  {
    language: 'English',
    level: 2,
    title: 'The Little Chef',
    description: 'A story about a girl learning to cook with her grandmother',
    content: 'Emma loved spending time in the kitchen with her grandmother. One Saturday, Grandma said, "Let\'s make apple pie together!" Emma was very excited. First, they washed the apples. Then, Emma learned how to peel and cut them carefully. Grandma showed her how to make the dough. Emma mixed flour, butter, and sugar in a big bowl. After baking for forty minutes, the kitchen smelled wonderful. The pie was golden brown and delicious. Emma felt proud. She learned that cooking takes patience and practice, but the result is always rewarding.',
    wordCount: 98,
    questions: [
      { order: 1, type: 'CHOICE', question: 'What did Emma and Grandma decide to make?', options: JSON.stringify(['Chocolate cake', 'Apple pie', 'Bread', 'Cookies']), answer: 'Apple pie', explanation: 'Grandma said "Let\'s make apple pie together!"', difficulty: 2 },
      { order: 2, type: 'CHOICE', question: 'How long did they bake the pie?', options: JSON.stringify(['Twenty minutes', 'Thirty minutes', 'Forty minutes', 'One hour']), answer: 'Forty minutes', explanation: 'After baking for forty minutes, the kitchen smelled wonderful.', difficulty: 2 },
      { order: 3, type: 'CHOICE', question: 'How did Emma feel after making the pie?', options: JSON.stringify(['Tired', 'Proud', 'Sad', 'Bored']), answer: 'Proud', explanation: 'Emma felt proud.', difficulty: 2 },
    ],
  },
  // ==================== Chinese Level 2 ====================
  {
    language: 'Chinese',
    level: 2,
    title: '我的宠物',
    description: '关于照顾宠物的故事',
    content: '我有一只宠物猫，名叫花花。它是一只橘色的花猫，有着明亮的眼睛。每天早上，我给花花准备早餐。它最喜欢吃鱼和猫粮。下午放学回家，花花总是在门口等我。它会蹭我的腿，发出咕噜咕噜的声音。上个周末，我带着花花去宠物医院打疫苗。它有点害怕，但是很勇敢。医生说花花很健康。照顾小动物需要耐心和爱心，但看到它快乐的样子，我觉得很幸福。',
    wordCount: 135,
    questions: [
      { order: 1, type: 'CHOICE', question: '花花的颜色是什么？', options: JSON.stringify(['白色', '黑色', '橘色', '灰色']), answer: '橘色', explanation: '花花是一只橘色的花猫', difficulty: 2 },
      { order: 2, type: 'CHOICE', question: '花花最喜欢吃什么？', options: JSON.stringify(['肉', '鱼和猫粮', '蔬菜', '水果']), answer: '鱼和猫粮', explanation: '它最喜欢吃鱼和猫粮', difficulty: 2 },
      { order: 3, type: 'CHOICE', question: '上个周末，作者带花花去了哪里？', options: JSON.stringify(['公园', '宠物医院', '超市', '学校']), answer: '宠物医院', explanation: '我带着花花去宠物医院打疫苗', difficulty: 2 },
      { order: 4, type: 'CHOICE', question: '医生怎么说？', options: JSON.stringify(['花花需要吃药', '花花很健康', '花花生病了', '花花需要住院']), answer: '花花很健康', explanation: '医生说花花很健康', difficulty: 2 },
    ],
  },
  {
    language: 'Chinese',
    level: 2,
    title: '小厨师',
    description: '关于孩子跟奶奶学习做饭的故事',
    content: '小红喜欢和奶奶一起在厨房里做饭。一个星期六，奶奶说："我们来包饺子吧！"小红非常开心。首先，奶奶教小红和面。面团软软的，摸起来很舒服。然后，她们一起准备饺子馅。有猪肉、白菜和葱花。小红学着奶奶的样子，把馅放在饺子皮上，然后捏紧。虽然有些饺子包得不好看，但是奶奶一直鼓励她。饺子煮熟后，全家人一起吃。大家都说好吃。小红明白了，做饭需要耐心和练习。',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: '小红和奶奶一起做什么？', options: JSON.stringify(['做蛋糕', '包饺子', '炒菜', '煮汤']), answer: '包饺子', explanation: '奶奶说"我们来包饺子吧！"', difficulty: 2 },
      { order: 2, type: 'CHOICE', question: '饺子馅里有什么？', options: JSON.stringify(['牛肉和萝卜', '猪肉、白菜和葱花', '鸡肉和蘑菇', '虾和鸡蛋']), answer: '猪肉、白菜和葱花', explanation: '有猪肉、白菜和葱花', difficulty: 2 },
      { order: 3, type: 'CHOICE', question: '小红包的饺子怎么样？', options: JSON.stringify(['非常漂亮', '有些不好看', '全都破了', '特别大']), answer: '有些不好看', explanation: '虽然有些饺子包得不好看', difficulty: 2 },
    ],
  },
  // ==================== Chinese Level 2 (新增) ====================
  {
    language: 'Chinese',
    level: 2,
    title: '生日惊喜',
    description: '关于为家人准备生日惊喜的温馨故事',
    content: '今天是小明的生日。他早上起床，发现家里很安静。爸爸妈妈都不在家。小明有点难过，以为大家忘记了他的生日。这时，门铃响了。他跑去开门，看到爸爸妈妈站在门口，手里拿着一个大大的蛋糕。爸爸笑着说："生日快乐！"妈妈说："我们想给你一个惊喜！"小明开心得跳了起来。晚上，全家人一起吃了晚饭，然后小明吹灭了生日蜡烛。他闭上眼睛，许了一个愿望："我希望永远和爸爸妈妈在一起快乐地生活。"爸爸妈妈听了，感动地抱住了他。这是一个难忘的生日。',
    wordCount: 165,
    questions: [
      { order: 1, type: 'CHOICE', question: '今天是谁的生日？', options: JSON.stringify(['妈妈', '爸爸', '小明', '爷爷']), answer: '小明', explanation: '今天是小明的生日', difficulty: 2 },
      { order: 2, type: 'CHOICE', question: '早上起床后，小明为什么有点难过？', options: JSON.stringify(['他生病了', '家里很安静，以为大家忘了他的生日', '他不想过生日', '他要去上学']), answer: '家里很安静，以为大家忘了他的生日', explanation: '他有点难过，以为大家忘记了他的生日', difficulty: 2 },
      { order: 3, type: 'CHOICE', question: '爸爸妈妈给了小明什么惊喜？', options: JSON.stringify(['一个新玩具', '一个大蛋糕', '一本书', '一只小狗']), answer: '一个大蛋糕', explanation: '爸爸妈妈拿着一个大大的蛋糕', difficulty: 2 },
      { order: 4, type: 'CHOICE', question: '小明许了什么愿望？', options: JSON.stringify(['想要很多玩具', '想永远和爸爸妈妈在一起', '想去游乐园', '想养一只宠物']), answer: '想永远和爸爸妈妈在一起', explanation: '他希望永远和爸爸妈妈在一起快乐地生活', difficulty: 2 },
    ],
  },
  // ==================== English Level 3 ====================
  {
    language: 'English',
    level: 3,
    title: 'The Secret Garden',
    description: 'A story about discovering a hidden garden and making new friends',
    content: 'Lily moved to a new town and felt lonely. One afternoon, while exploring the woods behind her house, she discovered an old iron gate hidden behind thick ivy. With great effort, she pushed it open. Inside was a beautiful but neglected garden. Colorful wildflowers grew among the weeds, and a small fountain stood in the center. Lily decided to restore the garden. She came every day after school to water the plants and remove the weeds. Soon, a boy named Jack noticed her and offered to help. Together, they brought the garden back to life. They planted roses, fixed the fountain, and built a small bench. The garden became a wonderful place where new friendships bloomed.',
    wordCount: 130,
    questions: [
      { order: 1, type: 'CHOICE', question: 'How did Lily feel after moving to a new town?', options: JSON.stringify(['Happy', 'Excited', 'Lonely', 'Angry']), answer: 'Lonely', explanation: 'Lily moved to a new town and felt lonely.', difficulty: 3 },
      { order: 2, type: 'CHOICE', question: 'What was hidden behind the thick ivy?', options: JSON.stringify(['A house', 'An iron gate', 'A tree', 'A wall']), answer: 'An iron gate', explanation: 'She discovered an old iron gate hidden behind thick ivy.', difficulty: 3 },
      { order: 3, type: 'CHOICE', question: 'Who offered to help Lily with the garden?', options: JSON.stringify(['Her mother', 'Her teacher', 'Jack', 'An old man']), answer: 'Jack', explanation: 'A boy named Jack noticed her and offered to help.', difficulty: 3 },
      { order: 4, type: 'CHOICE', question: 'What did they build in the garden?', options: JSON.stringify(['A playhouse', 'A small bench', 'A fence', 'A treehouse']), answer: 'A small bench', explanation: 'They planted roses, fixed the fountain, and built a small bench.', difficulty: 3 },
    ],
  },
  {
    language: 'English',
    level: 3,
    title: 'The Science Fair',
    description: 'A story about teamwork and creativity at a school science fair',
    content: 'The annual science fair was approaching, and Sarah had an ambitious idea. She wanted to build a model of a solar-powered car. Her friend Michael joined the project. They researched different types of solar panels and learned about renewable energy. After several failed attempts, they finally created a small car that could move using sunlight. On the day of the fair, their project attracted many visitors. The judges were impressed by their creativity and technical knowledge. Sarah and Michael won the first prize. More importantly, they learned that teamwork and perseverance are the keys to success. They also became more aware of the importance of protecting our environment.',
    wordCount: 120,
    questions: [
      { order: 1, type: 'CHOICE', question: 'What did Sarah want to build for the science fair?', options: JSON.stringify(['A robot', 'A solar-powered car', 'A rocket', 'A volcano']), answer: 'A solar-powered car', explanation: 'She wanted to build a model of a solar-powered car.', difficulty: 3 },
      { order: 2, type: 'CHOICE', question: 'What did they learn about during their research?', options: JSON.stringify(['Fossil fuels', 'Nuclear energy', 'Renewable energy', 'Wind power']), answer: 'Renewable energy', explanation: 'They researched about renewable energy.', difficulty: 3 },
      { order: 3, type: 'CHOICE', question: 'What prize did they win?', options: JSON.stringify(['Second prize', 'First prize', 'Third prize', 'Special award']), answer: 'First prize', explanation: 'Sarah and Michael won the first prize.', difficulty: 3 },
      { order: 4, type: 'CHOICE', question: 'What important lesson did they learn?', options: JSON.stringify(['Winning is everything', 'Teamwork and perseverance are important', 'Solar energy is expensive', 'Science is difficult']), answer: 'Teamwork and perseverance are important', explanation: 'They learned that teamwork and perseverance are the keys to success.', difficulty: 3 },
    ],
  },
  // ==================== Chinese Level 3 ====================
  {
    language: 'Chinese',
    level: 3,
    title: '秘密花园',
    description: '关于发现隐藏花园并结交新朋友的故事',
    content: '小美搬到了一个新城市，觉得很孤单。一天下午，她在家后面的树林里探索时，发现了一个被茂密常春藤遮住的旧铁门。她费了很大的力气推开了门。里面是一个美丽但被荒废的花园。五颜六色的野花在杂草中生长，中间有一个小喷泉。小美决定修复这个花园。她每天放学后都来浇水、除草。不久，一个叫小明的男孩注意到了她，主动提出帮忙。他们一起让花园恢复了生机。他们种了玫瑰，修好了喷泉，还做了一张小长椅。花园成了一个美好的地方，新的友谊在这里绽放。',
    wordCount: 190,
    questions: [
      { order: 1, type: 'CHOICE', question: '小美为什么觉得孤单？', options: JSON.stringify(['她丢了玩具', '她搬到了新城市', '她考试没考好', '她生病了']), answer: '她搬到了新城市', explanation: '小美搬到了一个新城市，觉得很孤单', difficulty: 3 },
      { order: 2, type: 'CHOICE', question: '小美发现了什么？', options: JSON.stringify(['一座房子', '一个旧铁门', '一棵大树', '一条小河']), answer: '一个旧铁门', explanation: '发现了一个被茂密常春藤遮住的旧铁门', difficulty: 3 },
      { order: 3, type: 'CHOICE', question: '谁主动提出帮助小美？', options: JSON.stringify(['妈妈', '老师', '小明', '邻居']), answer: '小明', explanation: '一个叫小明的男孩注意到了她，主动提出帮忙', difficulty: 3 },
      { order: 4, type: 'CHOICE', question: '他们一起做了什么？', options: JSON.stringify(['建了一个游乐场', '种花、修喷泉、做长椅', '盖了一间房子', '挖了一个游泳池']), answer: '种花、修喷泉、做长椅', explanation: '他们种了玫瑰，修好了喷泉，还做了一张小长椅', difficulty: 3 },
    ],
  },
  {
    language: 'Chinese',
    level: 3,
    title: '科技展览',
    description: '关于团队合作和创造力的学校科技展故事',
    content: '一年一度的科技展览即将到来，小华有一个大胆的想法。他想制作一个太阳能小车模型。他的好朋友小丽加入了项目。他们一起研究了不同类型的太阳能板，学习了可再生能源的知识。经过几次失败的尝试，他们终于造出了一辆能用阳光驱动的小车。展览当天，他们的项目吸引了很多参观者。评委们对他们的创造力和技术知识印象深刻。小华和小丽获得了一等奖。更重要的是，他们明白了团队合作和坚持不懈是成功的关键，也更加意识到保护环境的重要性。',
    wordCount: 180,
    questions: [
      { order: 1, type: 'CHOICE', question: '小华想为科技展做什么？', options: JSON.stringify(['机器人', '太阳能小车', '火箭模型', '火山模型']), answer: '太阳能小车', explanation: '他想制作一个太阳能小车模型', difficulty: 3 },
      { order: 2, type: 'CHOICE', question: '他们的项目获得了什么奖？', options: JSON.stringify(['二等奖', '一等奖', '三等奖', '特别奖']), answer: '一等奖', explanation: '小华和小丽获得了一等奖', difficulty: 3 },
      { order: 3, type: 'CHOICE', question: '从这次经历中学到了什么？', options: JSON.stringify(['科技很难', '获奖最重要', '团队合作和坚持很重要', '太阳能很贵']), answer: '团队合作和坚持很重要', explanation: '他们明白了团队合作和坚持不懈是成功的关键', difficulty: 3 },
    ],
  },
  // ==================== Chinese Level 3 (新增) ====================
  {
    language: 'Chinese',
    level: 3,
    title: '环保小卫士',
    description: '关于保护环境的校园故事',
    content: '学校组织了环保活动，号召同学们保护环境。小丽和她的同学们决定从身边的小事做起。他们首先在校园里捡垃圾，把垃圾分类放进垃圾桶。然后，他们制作了环保宣传海报，贴在学校的公告栏上，提醒大家爱护环境。周末，小丽还在家里和父母一起种了一棵小树苗。她告诉爸爸妈妈："种树可以让空气变得更清新。"小树苗一天天长大，小丽非常开心。慢慢地，越来越多的人加入了环保行动。老师在全班同学面前表扬了小丽，说她是一个真正的环保小卫士。小丽说："保护环境，人人有责。每个人做一点小事，世界就会变得更美好。"',
    wordCount: 220,
    questions: [
      { order: 1, type: 'CHOICE', question: '学校组织了什么活动？', options: JSON.stringify(['文艺表演', '环保活动', '体育比赛', '春游']), answer: '环保活动', explanation: '学校组织了环保活动', difficulty: 3 },
      { order: 2, type: 'CHOICE', question: '小丽和同学们首先做了什么？', options: JSON.stringify(['种树', '捡垃圾', '画画', '打扫教室']), answer: '捡垃圾', explanation: '他们首先在校园里捡垃圾', difficulty: 3 },
      { order: 3, type: 'CHOICE', question: '小丽周末和父母一起做了什么？', options: JSON.stringify(['去公园玩', '种了一棵小树苗', '买了很多东西', '去奶奶家']), answer: '种了一棵小树苗', explanation: '小丽在家里和父母一起种了一棵小树苗', difficulty: 3 },
      { order: 4, type: 'CHOICE', question: '小丽说了什么道理？', options: JSON.stringify(['学习很重要', '保护环境人人有责', '种树很难', '环保很无聊']), answer: '保护环境人人有责', explanation: '小丽说"保护环境，人人有责"', difficulty: 3 },
    ],
  },
  // ==================== English Level 4 ====================
  {
    language: 'English',
    level: 4,
    title: 'The Digital Revolution',
    description: 'An exploration of how technology has transformed human communication',
    content: 'The digital revolution has fundamentally transformed the way humans communicate, work, and live. In the past few decades, we have witnessed an unprecedented acceleration in technological innovation. From the invention of the internet to the proliferation of smartphones, each breakthrough has brought us closer together while simultaneously creating new challenges. Social media platforms have given voice to millions, enabling global conversations about important issues. However, concerns about privacy, misinformation, and digital addiction have also emerged. Artificial intelligence is now reshaping industries, from healthcare to education. As we stand at the crossroads of further technological advancement, we must carefully consider how to harness these tools for the benefit of all humanity while mitigating potential risks.',
    wordCount: 125,
    questions: [
      { order: 1, type: 'CHOICE', question: 'What has the digital revolution fundamentally transformed?', options: JSON.stringify(['Transportation', 'Communication and living', 'Agriculture', 'Manufacturing']), answer: 'Communication and living', explanation: 'The digital revolution has transformed the way humans communicate, work, and live.', difficulty: 4 },
      { order: 2, type: 'CHOICE', question: 'What concerns have emerged from social media?', options: JSON.stringify(['Better education', 'Privacy and misinformation', 'More jobs', 'Cheaper products']), answer: 'Privacy and misinformation', explanation: 'Concerns about privacy, misinformation, and digital addiction have emerged.', difficulty: 4 },
      { order: 3, type: 'CHOICE', question: 'Which industry is NOT mentioned as being reshaped by AI?', options: JSON.stringify(['Healthcare', 'Education', 'Agriculture', 'All are mentioned']), answer: 'All are mentioned', explanation: 'AI is reshaping industries from healthcare to education.', difficulty: 4 },
      { order: 4, type: 'CHOICE', question: 'What does the author suggest we need to do?', options: JSON.stringify(['Stop technological progress', 'Harness technology for benefit while mitigating risks', 'Ignore the challenges', 'Return to old ways']), answer: 'Harness technology for benefit while mitigating risks', explanation: 'We must harness these tools for benefit while mitigating potential risks.', difficulty: 4 },
      { order: 5, type: 'CHOICE', question: 'What does "proliferation" most likely mean in this context?', options: JSON.stringify(['Disappearance', 'Rapid increase', 'Slow growth', 'Rejection']), answer: 'Rapid increase', explanation: 'Proliferation means rapid increase or spread.', difficulty: 4 },
    ],
  },
  {
    language: 'English',
    level: 4,
    title: 'The Art of Negotiation',
    description: 'Understanding effective negotiation strategies in business',
    content: 'Negotiation is an essential skill in both professional and personal life. Successful negotiators understand that the goal is not to defeat the other party, but to find a mutually beneficial solution. This approach, known as win-win negotiation, focuses on interests rather than positions. Preparation is crucial: research the other party\'s needs, establish your priorities, and determine your alternatives. Active listening plays a vital role—understanding what the other party truly values can reveal creative solutions. Emotional intelligence is equally important; recognizing and managing emotions can prevent conflicts from escalating. Finally, effective negotiators know when to walk away. Having a strong BATNA (Best Alternative to a Negotiated Agreement) gives you confidence and leverage. Mastering these principles can dramatically improve your negotiation outcomes.',
    wordCount: 140,
    questions: [
      { order: 1, type: 'CHOICE', question: 'What is the goal of successful negotiation according to the text?', options: JSON.stringify(['To defeat the other party', 'To find a mutually beneficial solution', 'To get the best price', 'To prove you are right']), answer: 'To find a mutually beneficial solution', explanation: 'The goal is to find a mutually beneficial solution.', difficulty: 4 },
      { order: 2, type: 'CHOICE', question: 'What does BATNA stand for?', options: JSON.stringify(['Business Agreement Termination Notice', 'Best Alternative to a Negotiated Agreement', 'Basic Approach to Negotiation Analysis', 'Balanced Assessment of Terms']), answer: 'Best Alternative to a Negotiated Agreement', explanation: 'BATNA stands for Best Alternative to a Negotiated Agreement.', difficulty: 4 },
      { order: 3, type: 'CHOICE', question: 'Which of the following is NOT mentioned as important in negotiation?', options: JSON.stringify(['Preparation', 'Active listening', 'Emotional intelligence', 'Physical appearance']), answer: 'Physical appearance', explanation: 'Preparation, active listening, and emotional intelligence are mentioned.', difficulty: 4 },
      { order: 4, type: 'CHOICE', question: 'What does win-win negotiation focus on?', options: JSON.stringify(['Positions', 'Interests', 'Rules', 'History']), answer: 'Interests', explanation: 'Win-win negotiation focuses on interests rather than positions.', difficulty: 4 },
    ],
  },
  // ==================== Chinese Level 4 ====================
  {
    language: 'Chinese',
    level: 4,
    title: '数字革命',
    description: '探讨科技如何改变人类沟通方式',
    content: '数字革命从根本上改变了人类沟通、工作和生活方式。在过去的几十年里，我们见证了技术创新的空前加速。从互联网的发明到智能手机的普及，每一个突破都让我们更加紧密地联系在一起，同时也带来了新的挑战。社交媒体平台为数百万人提供了发声的机会，促进了关于重要议题的全球对话。然而，关于隐私、信息造假和数字成瘾的担忧也随之出现。人工智能正在重塑从医疗到教育的各个行业。当我们站在技术进步的十字路口时，必须认真思考如何利用这些工具造福全人类，同时降低潜在风险。',
    wordCount: 195,
    questions: [
      { order: 1, type: 'CHOICE', question: '数字革命从根本上改变了什么？', options: JSON.stringify(['交通运输', '沟通和生活方式', '农业生产', '制造业']), answer: '沟通和生活方式', explanation: '数字革命改变了人类沟通、工作和生活方式', difficulty: 4 },
      { order: 2, type: 'CHOICE', question: '社交媒体带来的担忧不包括什么？', options: JSON.stringify(['隐私问题', '信息造假', '数字成瘾', '环境污染']), answer: '环境污染', explanation: '关于隐私、信息造假和数字成瘾的担忧', difficulty: 4 },
      { order: 3, type: 'CHOICE', question: '人工智能正在重塑哪些行业？', options: JSON.stringify(['只有医疗', '只有教育', '从医疗到教育等多个行业', '只有科技']), answer: '从医疗到教育等多个行业', explanation: '人工智能正在重塑从医疗到教育的各个行业', difficulty: 4 },
      { order: 4, type: 'CHOICE', question: '作者建议我们应该怎么做？', options: JSON.stringify(['停止技术进步', '利用技术造福并降低风险', '忽视挑战', '回到过去']), answer: '利用技术造福并降低风险', explanation: '必须思考如何利用这些工具造福全人类，同时降低潜在风险', difficulty: 4 },
      { order: 5, type: 'CHOICE', question: '文中"空前"的意思是？', options: JSON.stringify(['普通地', '前所未有地', '缓慢地', '重复地']), answer: '前所未有地', explanation: '"空前"意思是前所未有', difficulty: 4 },
    ],
  },
  {
    language: 'Chinese',
    level: 4,
    title: '谈判的艺术',
    description: '理解有效的商务谈判策略',
    content: '谈判是职业和生活中必不可少的技能。成功的谈判者明白，目标不是打败对方，而是找到互利的解决方案。这种被称为"双赢谈判"的方法，关注的是利益而不是立场。准备工作至关重要：研究对方的需求，确定自己的优先事项，并评估备选方案。积极倾听发挥着重要作用——理解对方真正重视的东西可以揭示创造性的解决方案。情商同样重要；识别和管理情绪可以防止冲突升级。最后，高效的谈判者知道何时该放弃。拥有强有力的最佳替代方案能给你自信和筹码。掌握这些原则可以显著提升你的谈判成果。',
    wordCount: 215,
    questions: [
      { order: 1, type: 'CHOICE', question: '成功谈判的目标是什么？', options: JSON.stringify(['打败对方', '找到互利的解决方案', '获得最低价格', '证明自己正确']), answer: '找到互利的解决方案', explanation: '目标不是打败对方，而是找到互利的解决方案', difficulty: 4 },
      { order: 2, type: 'CHOICE', question: '"双赢谈判"关注的是什么？', options: JSON.stringify(['立场', '利益', '规则', '历史']), answer: '利益', explanation: '关注的是利益而不是立场', difficulty: 4 },
      { order: 3, type: 'CHOICE', question: '以下哪项不是文中提到的谈判技巧？', options: JSON.stringify(['准备工作', '积极倾听', '情商', '外貌打扮']), answer: '外貌打扮', explanation: '准备工作、积极倾听和情商都被提到了', difficulty: 4 },
      { order: 4, type: 'CHOICE', question: '高效的谈判者知道什么很重要？', options: JSON.stringify(['何时该放弃', '何时该发怒', '何时该说谎', '何时该离开']), answer: '何时该放弃', explanation: '高效的谈判者知道何时该放弃', difficulty: 4 },
    ],
  },
  // ==================== Chinese Level 4 (新增) ====================
  {
    language: 'Chinese',
    level: 4,
    title: '中国传统文化',
    description: '了解中国传统节日和文化习俗',
    content: '中国有着丰富多彩的传统节日，每个节日都有独特的历史和文化内涵。春节是中国最重要的节日，人们在除夕夜吃年夜饭、贴春联、放鞭炮，全家团圆迎接新年。元宵节有赏花灯和猜灯谜的习俗，街上到处都是五彩缤纷的灯笼。端午节是为了纪念古代诗人屈原，人们赛龙舟、吃粽子。中秋节象征着团圆，家人聚在一起赏月、吃月饼。这些传统节日不仅承载着中华民族的文化记忆，也传递着人们对美好生活的向往。随着时代的发展，传统节日的庆祝方式也在不断创新，但其核心价值——家庭团聚和文化传承——始终不变。',
    wordCount: 240,
    questions: [
      { order: 1, type: 'CHOICE', question: '中国最重要的传统节日是什么？', options: JSON.stringify(['元宵节', '春节', '端午节', '中秋节']), answer: '春节', explanation: '春节是中国最重要的节日', difficulty: 4 },
      { order: 2, type: 'CHOICE', question: '端午节是为了纪念谁？', options: JSON.stringify(['孔子', '屈原', '李白', '杜甫']), answer: '屈原', explanation: '端午节是为了纪念古代诗人屈原', difficulty: 4 },
      { order: 3, type: 'CHOICE', question: '中秋节有什么习俗？', options: JSON.stringify(['赛龙舟', '放鞭炮', '赏月吃月饼', '猜灯谜']), answer: '赏月吃月饼', explanation: '中秋节家人聚在一起赏月、吃月饼', difficulty: 4 },
      { order: 4, type: 'CHOICE', question: '元宵节人们做什么？', options: JSON.stringify(['吃粽子', '赏花灯猜灯谜', '贴春联', '吃年夜饭']), answer: '赏花灯猜灯谜', explanation: '元宵节有赏花灯和猜灯谜的习俗', difficulty: 4 },
      { order: 5, type: 'CHOICE', question: '文中说传统节日的核心价值是什么？', options: JSON.stringify(['美食和礼物', '家庭团聚和文化传承', '放假休息', '旅游购物']), answer: '家庭团聚和文化传承', explanation: '核心价值是家庭团聚和文化传承', difficulty: 4 },
    ],
  },
]

async function main() {
  for (const courseData of courses) {
    const existingCourse = await prisma.course.findFirst({
      where: { title: courseData.title },
    })
    
    if (!existingCourse) {
      const course = await prisma.course.create({
        data: {
          title: courseData.title,
          description: courseData.description,
          language: courseData.language,
          level: courseData.level,
          category: courseData.category,
          duration: courseData.duration,
        },
      })
      
      for (const lessonData of courseData.lessons) {
        const lesson = await prisma.lesson.create({
          data: {
            courseId: course.id,
            title: lessonData.title,
            content: lessonData.content,
            order: lessonData.order,
            type: lessonData.type,
          },
        })
        
        for (const exerciseData of lessonData.exercises) {
          await prisma.exercise.create({
            data: {
              lessonId: lesson.id,
              type: exerciseData.type,
              question: exerciseData.question,
              options: JSON.stringify(exerciseData.options),
              answer: exerciseData.answer,
              feedback: exerciseData.feedback,
            },
          })
        }
      }
    }
  }
  
  // 插入考试数据
  for (const examData of exams) {
    const existingExam = await prisma.exam.findFirst({
      where: { 
        language: examData.language,
        level: examData.level 
      },
    })
    
    if (!existingExam) {
      const exam = await prisma.exam.create({
        data: {
          language: examData.language,
          level: examData.level,
          title: examData.title,
          description: examData.description,
          passingScore: examData.passingScore,
          totalQuestions: examData.questions.length,
        },
      })
      
      for (const questionData of examData.questions) {
        await prisma.examQuestion.create({
          data: {
            examId: exam.id,
            order: questionData.order,
            question: questionData.question,
            options: JSON.stringify(questionData.options),
            answer: questionData.answer,
            explanation: questionData.explanation,
          },
        })
      }
    }
  }
  
  // 插入专项训练数据
  for (const trainingData of specialTrainings) {
    const existingTraining = await prisma.specialTraining.findFirst({
      where: { 
        type: trainingData.type,
        language: trainingData.language,
        level: trainingData.level 
      },
    })
    
    if (!existingTraining) {
      const training = await prisma.specialTraining.create({
        data: {
          type: trainingData.type,
          language: trainingData.language,
          level: trainingData.level,
          title: trainingData.title,
          description: trainingData.description,
        },
      })
      
      for (const questionData of trainingData.questions) {
        await prisma.specialTrainingQuestion.create({
          data: {
            trainingId: training.id,
            order: questionData.order,
            type: trainingData.type,
            question: questionData.question,
            answer: questionData.answer,
            explanation: questionData.explanation,
            difficulty: questionData.difficulty,
          },
        })
      }
    }
  }
  
  // 插入绘本故事数据
  for (const storyData of stories) {
    const existingStory = await prisma.storyBook.findFirst({
      where: {
        language: storyData.language,
        level: storyData.level,
        title: storyData.title,
      },
    })
    
    if (!existingStory) {
      const story = await prisma.storyBook.create({
        data: {
          language: storyData.language,
          level: storyData.level,
          title: storyData.title,
          description: storyData.description,
          content: storyData.content,
          wordCount: storyData.wordCount,
          questions: {
            create: storyData.questions.map(q => ({
              order: q.order,
              type: q.type,
              question: q.question,
              options: q.options,
              answer: q.answer,
              explanation: q.explanation,
              difficulty: q.difficulty,
            })),
          },
        },
      })
      
      console.log(`Created story: ${storyData.title} (${storyData.language} Level ${storyData.level})`)
    }
  }
  
  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
