import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, ChartDataPoint, Platform, WebSource } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate mock chart data with different curves for each platform
const generateMockChartData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  
  // Random base offsets for each platform to simulate different "viral" times
  const offsetWeibo = Math.random() * 5;
  const offsetDouyin = Math.random() * 5;
  const offsetKuaishou = Math.random() * 5;

  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() - (23 - i) * 3600 * 1000);
    const timeStr = time.getHours().toString().padStart(2, '0') + ':00';
    
    // Create organic looking curves using sine waves and randomness
    const baseHeat = 100000;
    
    data.push({
      time: timeStr,
      weibo: Math.floor(baseHeat * (1 + Math.sin((i + offsetWeibo) / 3) * 0.8 + Math.random() * 0.2)),
      douyin: Math.floor(baseHeat * 1.2 * (1 + Math.sin((i + offsetDouyin) / 2.5) * 0.9 + Math.random() * 0.3)),
      kuaishou: Math.floor(baseHeat * 0.8 * (1 + Math.sin((i + offsetKuaishou) / 4) * 0.6 + Math.random() * 0.2)),
    });
  }
  return data;
};

export const analyzeTrend = async (searchTerm: string): Promise<AnalysisResult> => {
  try {
    // 1. Text Analysis & Grounding
    const textPrompt = `
      你是一位博古通今的中国文人兼现代数据分析师。请使用Google搜索获取"${searchTerm}"的最新实时信息。
      
      任务：
      1. 分析该话题在当代中国社交媒体（微博、抖音、快手）上的流行趋势。
      2. 创作一首四句诗（五言或七言），以古风隐喻的形式描述这一现象（字段名：poem）。
      3. 寻找一个中国历史典故或古代哲学思想，与该热点事件进行类比（字段名：historicalAnalogy）。
      4. 尝试从搜索结果中提取一张主要相关图片的URL。
      
      请返回一个纯JSON对象。不要包含Markdown格式。
      JSON对象必须包含以下字段:
      {
        "summary": "一段简练、文雅的摘要（最多3句话）。",
        "intelligence": "一段深度的舆情分析，语言风格要客观但带有文人气息。",
        "keySources": ["列出4个具体的情报来源类型"],
        "keywords": ["提取4个核心关键词，最好是两个字的词"],
        "poem": "在这里填入创作的诗句，用换行符分隔每一句。",
        "historicalAnalogy": "在这里填入历史典故类比，解释它与当下的联系。",
        "sentimentScore": 0.5 (一个-1到1之间的数字),
        "extractedImageUrl": "如果找到相关新闻图片URL，填在这里，否则留空"
      }
      
      确保所有文本为中文。
    `;

    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: textPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let jsonStr = textResponse.text || "{}";
    jsonStr = jsonStr.replace(/```json\n?|\n?```/g, "").trim();
    
    let json;
    try {
      json = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("JSON Parse failed", e);
      json = {
        summary: "云深不知处，数据暂难寻。",
        intelligence: "网路繁忙，信息如雾里看花。建议稍后重试，以待云开雾散。",
        keySources: ["坊间传闻", "旧籍"],
        keywords: ["迷雾", "待定", "未知", "虚空"],
        poem: "云深山路远，\n信使未归家。\n暂且烹茶候，\n静待落灯花。",
        historicalAnalogy: "如古时烽火台暂熄，信息传递受阻。",
        sentimentScore: 0,
        extractedImageUrl: ""
      };
    }

    // Extract web sources
    const webSources: WebSource[] = [];
    if (textResponse.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      textResponse.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          webSources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    // 3. Chart Data & Metrics
    const chartData = generateMockChartData();
    let maxPeak = 0;
    let totalVol = 0;
    chartData.forEach(p => {
      const sum = p.weibo + p.douyin + p.kuaishou;
      totalVol += sum;
      maxPeak = Math.max(maxPeak, p.weibo, p.douyin, p.kuaishou);
    });

    return {
      summary: json.summary,
      intelligence: json.intelligence,
      keySources: json.keySources || ["官方通报", "民间舆论", "头部达人", "热搜榜单"],
      keywords: json.keywords || [],
      poem: json.poem,
      historicalAnalogy: json.historicalAnalogy,
      metrics: {
        peakValue: maxPeak,
        volatility: Math.floor(Math.random() * 40 + 40),
        sentimentScore: json.sentimentScore || 0,
        totalMentions: totalVol
      },
      chartData,
      webSources: webSources.slice(0, 5),
      imageUrl: json.extractedImageUrl // Using extracted URL if available
    };

  } catch (error) {
    console.error("Analysis failed", error);
    return {
      summary: "系统无法连接至情报核心。",
      intelligence: "数据链路受损。",
      keySources: ["系统错误"],
      metrics: { peakValue: 0, volatility: 0, sentimentScore: 0, totalMentions: 0 },
      chartData: generateMockChartData()
    };
  }
};

export const getMockHotList = (platform: Platform) => {
  const titles = {
    [Platform.Weibo]: [
      "AI开源模型解析", "国产芯片新突破", "火星探测新发现", "全球气候峰会", "故宫初雪摄影",
      "央行数字货币", "量子计算里程碑", "自动驾驶法规", "非遗文化传承", "脑机接口实验"
    ],
    [Platform.Douyin]: [
      "汉服变装挑战", "赛博长安概念视频", "AI绘画挑战赛", "非遗手工制作", "全息投影古风",
      "古镇生活Vlog", "国风舞蹈翻跳", "复古科幻混剪", "水墨动画特效", "茶道艺术展示"
    ],
    [Platform.Kuaishou]: [
      "乡村发明家木牛流马", "硬核手工榫卯结构", "无人机航拍长城", "传统陶瓷制作", "废旧零件改造机甲",
      "民间绝活展示", "皮影戏创新", "农耕文明展示", "微缩景观制作", "极客工作室探秘"
    ]
  };
  
  return titles[platform].map((title, index) => ({
    id: `${platform}-${index}`,
    rank: index + 1,
    title,
    heat: Math.floor(10000000 - (index * 800000) + Math.random() * 50000),
    platform,
    label: index < 3 ? "爆" : index < 6 ? "热" : "新"
  }));
};