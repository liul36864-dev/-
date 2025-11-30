import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, PenTool, Scroll, Wind, Compass } from 'lucide-react';
import { TrendItem, Platform, ViewState, AnalysisResult } from './types';
import { getMockHotList, analyzeTrend } from './services/geminiService';
import { PaperCard, RedSeal, InkButton, StatBox, InkVisualizer, CalligraphyText } from './components/TechComponents';
import { TrendChart } from './components/TrendChart';

// --- Sub-components for Views ---

// 1. Dashboard View (The Pavilion)
const DashboardView = ({ onSearchSelect }: { onSearchSelect: (term: string) => void }) => {
  const [data, setData] = useState<Record<Platform, TrendItem[]>>({
    [Platform.Weibo]: [],
    [Platform.Douyin]: [],
    [Platform.Kuaishou]: []
  });

  useEffect(() => {
    // Initial data load
    setData({
      [Platform.Weibo]: getMockHotList(Platform.Weibo),
      [Platform.Douyin]: getMockHotList(Platform.Douyin),
      [Platform.Kuaishou]: getMockHotList(Platform.Kuaishou),
    });
  }, []);

  const PlatformColumn = ({ platform, items, colorClass }: { platform: Platform, items: TrendItem[], colorClass: string }) => (
    <div className="flex flex-col h-full bg-white/40 border-r border-ink-light/10 last:border-0 p-4">
      <div className="flex items-center justify-center mb-6 relative">
         <h2 className={`font-calligraphy text-3xl ${colorClass} relative z-10`}>{platform}</h2>
         <div className="absolute inset-x-0 bottom-1 h-2 bg-ink-wash rounded-full opacity-50 z-0"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSearchSelect(item.title)}
            className="group relative p-4 cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-md border-b border-ink-light/10"
          >
            <div className="flex items-start gap-3">
               <span className={`font-serif font-bold text-lg leading-none ${item.rank <= 3 ? 'text-seal' : 'text-ink-light'}`}>
                 0{item.rank}
               </span>
               <div className="flex-1">
                 <div className="font-serif text-ink-base group-hover:text-ink-black transition-colors mb-1">
                   {item.title}
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-ink-light font-mono">{(item.heat / 10000).toFixed(1)}万热度</span>
                    {item.label && (
                      <span className={`text-[10px] px-1.5 py-0.5 border ${item.label === '爆' ? 'border-seal text-seal' : 'border-ink-light text-ink-light'}`}>
                        {item.label}
                      </span>
                    )}
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PaperCard className="h-[calc(100vh-140px)]" variant="bordered">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full divide-x divide-ink-light/10">
        <PlatformColumn platform={Platform.Weibo} items={data[Platform.Weibo]} colorClass="text-seal" />
        <PlatformColumn platform={Platform.Douyin} items={data[Platform.Douyin]} colorClass="text-ink-black" />
        <PlatformColumn platform={Platform.Kuaishou} items={data[Platform.Kuaishou]} colorClass="text-nature-ochre" />
      </div>
    </PaperCard>
  );
};

// 2. Analysis View (The Study Room)
const AnalysisView = ({ term, onBack }: { term: string, onBack: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      const data = await analyzeTrend(term);
      if (isMounted) {
        setResult(data);
        setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [term]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-rice-paper relative animate-fade-in-up">
        <div className="w-24 h-24 rounded-full border-4 border-ink-light/20 flex items-center justify-center animate-spin-slow">
           <Wind className="w-10 h-10 text-ink-base animate-pulse" />
        </div>
        <h2 className="mt-8 font-calligraphy text-3xl text-ink-black tracking-widest">寻 迹 中</h2>
        <p className="mt-2 font-serif text-ink-light">穿梭数据云海，探寻真知灼见...</p>
      </div>
    );
  }

  if (!result) return <div>Error loading data</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <InkButton onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">返回</span>
        </InkButton>
        <div className="font-serif text-ink-light text-sm tracking-widest">墨观天下 · 深度解析</div>
      </div>

      {/* Hero Section: Title & Poetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="relative pb-6 border-b-2 border-ink-black/10">
               <div className="flex items-center gap-4 mb-2">
                 <RedSeal text="聚焦" />
                 <span className="text-ink-light font-mono text-xs uppercase tracking-widest">TOPIC ANALYSIS</span>
               </div>
               <h1 className="font-calligraphy text-5xl md:text-6xl text-ink-black leading-tight mb-4">{term}</h1>
               <div className="flex flex-wrap gap-3">
                  {result.keywords?.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-ink-wash text-ink-dark font-serif text-sm border border-ink-light/20 rounded-sm">
                      #{kw}
                    </span>
                  ))}
               </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <PaperCard title="舆情综述" subTitle="SUMMARY">
                  <p className="font-serif text-ink-base leading-loose text-justify">
                    {result.summary}
                  </p>
               </PaperCard>
               
               <PaperCard title="七步成诗" subTitle="AI POETRY" className="bg-paper-accent/30">
                  <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                     <div className="font-calligraphy text-2xl text-ink-dark leading-relaxed space-y-2 relative">
                        {/* Decorative Quote Marks */}
                        <span className="absolute -top-4 -left-4 text-6xl text-ink-light/10 font-serif">“</span>
                        {result.poem ? (
                          result.poem.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))
                        ) : (
                          <div>暂无诗兴</div>
                        )}
                        <span className="absolute -bottom-8 -right-4 text-6xl text-ink-light/10 font-serif rotate-180">“</span>
                     </div>
                     <RedSeal text="AI作" className="mt-6 opacity-60 scale-75" />
                  </div>
               </PaperCard>
            </div>

            {/* Historical Analogy */}
            <PaperCard title="古今对照" subTitle="HISTORICAL REFLECTION" className="border-l-4 border-nature-ochre">
               <div className="flex items-start gap-4">
                  <Compass className="w-8 h-8 text-nature-ochre mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-serif font-bold text-ink-black mb-2 text-lg">历史的回响</h4>
                    <p className="font-serif text-ink-base leading-relaxed">
                       {result.historicalAnalogy || "暂无历史类比数据。"}
                    </p>
                  </div>
               </div>
            </PaperCard>

            {/* Chart */}
            <PaperCard title="热度山水" subTitle="TREND LANDSCAPE" className="h-[400px]">
               <TrendChart data={result.chartData} />
            </PaperCard>
         </div>

         {/* Sidebar: Metrics & Visuals */}
         <div className="lg:col-span-4 space-y-6">
            <PaperCard className="p-0 overflow-hidden" title="影像" subTitle="VISUAL">
               <div className="aspect-[4/3] w-full p-4 pt-0">
                  <InkVisualizer imageUrl={result.imageUrl} />
               </div>
            </PaperCard>

            <PaperCard title="关键指标" subTitle="METRICS">
               <div className="grid grid-cols-2 gap-4">
                  <StatBox label="峰值热度" value={(result.metrics.peakValue / 10000).toFixed(1)} unit="万" />
                  <StatBox label="全网声量" value={(result.metrics.totalMentions / 10000).toFixed(1)} unit="万" />
                  <div className="col-span-2 flex flex-col items-center p-4 border-t border-ink-light/20">
                     <span className="text-xs text-ink-light font-serif mb-2">情感倾向</span>
                     <div className="w-full h-2 bg-ink-wash rounded-full overflow-hidden relative">
                        <div 
                          className={`absolute top-0 bottom-0 w-2 h-2 rounded-full shadow-md transition-all duration-1000 ${result.metrics.sentimentScore > 0 ? 'bg-seal' : 'bg-ink-base'}`}
                          style={{ left: `${(result.metrics.sentimentScore + 1) * 50}%`, transform: 'translateX(-50%)' }}
                        ></div>
                        <div className="absolute top-[3px] left-0 w-full h-[1px] bg-ink-light/30"></div>
                     </div>
                     <div className="flex justify-between w-full mt-2 text-[10px] text-ink-light">
                        <span>消极</span>
                        <span>中性</span>
                        <span>积极</span>
                     </div>
                  </div>
               </div>
            </PaperCard>

            <PaperCard title="深度情报" subTitle="INTELLIGENCE">
               <div className="space-y-4">
                  <div className="font-serif text-sm text-ink-base leading-relaxed">
                     {result.intelligence}
                  </div>
                  <div className="border-t border-ink-light/10 pt-4">
                     <h4 className="text-xs text-ink-light mb-2 font-bold">信息来源</h4>
                     <ul className="space-y-2">
                        {result.webSources ? result.webSources.map((source, i) => (
                           <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="text-seal mt-0.5 font-mono">[{i+1}]</span>
                              <a href={source.uri} target="_blank" rel="noreferrer" className="text-ink-base hover:text-seal hover:underline truncate">
                                 {source.title}
                              </a>
                           </li>
                        )) : (
                          <li className="text-xs text-ink-light">数据来源正在校验...</li>
                        )}
                     </ul>
                  </div>
               </div>
            </PaperCard>
         </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      initiateSearch(searchTerm);
    }
  };

  const initiateSearch = (term: string) => {
    setActiveSearch(term);
    setSearchTerm(term);
    setView('ANALYSIS');
  };

  return (
    <div className="min-h-screen font-serif bg-rice-paper text-ink-base selection:bg-seal selection:text-white overflow-x-hidden">
      
      {/* Background Ink Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20 bg-ink-splatter mix-blend-multiply"></div>
      <div className="fixed -top-20 -right-20 w-96 h-96 bg-gradient-radial from-ink-light/10 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink-light/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo Area */}
          <div 
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => { setView('DASHBOARD'); setSearchTerm(''); }}
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
               <div className="absolute inset-0 bg-ink-black rounded-sm rotate-3 opacity-10 group-hover:rotate-6 transition-transform"></div>
               <div className="absolute inset-0 border-2 border-ink-black rounded-sm -rotate-3 group-hover:-rotate-6 transition-transform"></div>
               <Scroll className="w-6 h-6 text-ink-black relative z-10" />
            </div>
            <div className="flex flex-col">
                <span className="font-calligraphy text-2xl text-ink-black leading-none">
                  墨观<span className="text-seal">天下</span>
                </span>
                <span className="text-[10px] text-ink-light tracking-[0.4em] uppercase mt-1">OmniSentinel</span>
            </div>
          </div>

          {/* Search Bar (Center) */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 relative group hidden md:block">
             <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="输入关键词，寻觅数据踪迹..."
                  className="w-full bg-transparent border-b-2 border-ink-light/30 py-2 pl-2 pr-10 text-ink-black placeholder-ink-light/50 focus:outline-none focus:border-seal transition-colors font-serif"
                />
                <button type="submit" className="absolute right-0 top-2 text-ink-light hover:text-seal transition-colors">
                   <Search className="w-5 h-5" />
                </button>
             </div>
          </form>

          {/* Date Stamp */}
          <div className="flex flex-col items-end">
             <div className="font-calligraphy text-lg text-ink-black">
               {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
             </div>
             <div className="text-[10px] text-ink-light tracking-widest font-mono">
               {new Date().getFullYear()} YEAR
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-5rem)]">
        
        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mb-6">
          <div className="relative border border-ink-light/30 bg-white/50 p-1 rounded-sm">
             <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索..."
                className="w-full bg-transparent p-2 text-ink-black focus:outline-none"
              />
              <button type="submit" className="absolute right-3 top-3 text-ink-light">
                 <Search size={20} />
              </button>
          </div>
        </form>

        {view === 'DASHBOARD' ? (
           <div className="animate-fade-in-up">
              <div className="text-center mb-10 space-y-2">
                 <h1 className="font-calligraphy text-4xl text-ink-black">全网态势一览</h1>
                 <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-[1px] bg-ink-light/30"></div>
                    <PenTool className="w-4 h-4 text-ink-light" />
                    <div className="w-12 h-[1px] bg-ink-light/30"></div>
                 </div>
              </div>
              <DashboardView onSearchSelect={initiateSearch} />
           </div>
        ) : (
          <AnalysisView term={activeSearch} onBack={() => setView('DASHBOARD')} />
        )}
      </main>

    </div>
  );
};

export default App;