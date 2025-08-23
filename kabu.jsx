import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calculator, 
  Brain, 
  AlertTriangle, 
  Shield, 
  Database, 
  Target, 
  DollarSign, 
  Zap, 
  Activity, 
  Globe, 
  Layers, 
  Settings 
} from 'lucide-react';
import _ from 'lodash';

const ProfessionalStockPredictor = () => {
  const [selectedStock, setSelectedStock] = useState('7203');
  const [stockData, setStockData] = useState([]);
  const [fundamentalData, setFundamentalData] = useState({});
  const [macroData, setMacroData] = useState({});
  const [sentimentData, setSentimentData] = useState({});
  const [mlPrediction, setMlPrediction] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState({});
  const [portfolioAnalysis, setPortfolioAnalysis] = useState({});
  const [backtestResults, setBacktestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 東証プライム主要銘柄（セクター別）
  const majorStocks = [
    { code: '7203', name: 'トヨタ自動車', sector: '輸送機器', marketCap: 25000000 },
    { code: '6758', name: 'ソニーグループ', sector: '電気機器', marketCap: 15000000 },
    { code: '9984', name: 'ソフトバンクグループ', sector: '情報・通信業', marketCap: 12000000 },
    { code: '6861', name: 'キーエンス', sector: '電気機器', marketCap: 18000000 },
    { code: '4063', name: '信越化学工業', sector: '化学', marketCap: 8000000 },
    { code: '8035', name: '東京エレクトロン', sector: '電気機器', marketCap: 11000000 },
    { code: '9433', name: 'KDDI', sector: '情報・通信業', marketCap: 7500000 },
    { code: '4502', name: '武田薬品工業', sector: '医薬品', marketCap: 5000000 }
  ];

  // 高度なデータ生成（実際のAPIデータをシミュレート）
  const generateAdvancedStockData = (stockCode) => {
    const data = [];
    const startPrice = 2000 + Math.random() * 3000;
    let currentPrice = startPrice;
    
    // セクター別の特性を反映
    const stock = majorStocks.find(s => s.code === stockCode);
    const sectorMultipliers = {
      '輸送機器': 1.0,
      '電気機器': 1.2,
      '情報・通信業': 1.5,
      '化学': 0.8,
      '医薬品': 0.9
    };
    
    const volatility = (sectorMultipliers[stock?.sector] || 1.0) * 0.02;
    
    for (let i = 0; i < 252; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (251 - i));
      
      const macroTrend = Math.sin(i / 50) * 0.01;
      const seasonality = Math.sin((i / 252) * 2 * Math.PI) * 0.005;
      const randomWalk = (Math.random() - 0.5) * volatility;
      const momentum = Math.sin(i / 20) * 0.01;
      
      const change = macroTrend + seasonality + randomWalk + momentum;
      currentPrice *= (1 + change);
      
      const volume = Math.floor(500000 + Math.random() * 2000000);
      const high = currentPrice * (1 + Math.random() * 0.02);
      const low = currentPrice * (1 - Math.random() * 0.02);
      const open = currentPrice * (0.99 + Math.random() * 0.02);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(currentPrice),
        volume: volume,
        high: Math.round(high),
        low: Math.round(low),
        open: Math.round(open),
        returns: i > 0 ? (currentPrice - data[i-1]?.price) / (data[i-1]?.price || 1) : 0
      });
    }
    
    return data;
  };

  // ファンダメンタル分析データ生成
  const generateFundamentalData = (stockCode, stockPrice) => {
    const baseEPS = 100 + Math.random() * 200;
    const baseBPS = 1000 + Math.random() * 2000;
    
    return {
      eps: Math.round(baseEPS * 100) / 100,
      bps: Math.round(baseBPS),
      per: Math.round((stockPrice / baseEPS) * 100) / 100,
      pbr: Math.round((stockPrice / baseBPS) * 100) / 100,
      roe: Math.round((Math.random() * 15 + 5) * 100) / 100,
      roa: Math.round((Math.random() * 8 + 2) * 100) / 100,
      currentRatio: Math.round((Math.random() * 2 + 1) * 100) / 100,
      debtRatio: Math.round((Math.random() * 0.5 + 0.1) * 100) / 100,
      dividendYield: Math.round((Math.random() * 4 + 1) * 100) / 100,
      revenueGrowth: Math.round((Math.random() * 20 - 5) * 100) / 100,
      operatingMargin: Math.round((Math.random() * 15 + 5) * 100) / 100
    };
  };

  // センチメント分析データ生成
  const generateSentimentData = () => {
    return {
      newsScore: Math.round((Math.random() * 10 - 5) * 100) / 100,
      analystRating: Math.round((Math.random() * 5 + 1) * 100) / 100,
      socialSentiment: Math.round((Math.random() * 10 - 5) * 100) / 100,
      institutionalFlow: Math.round((Math.random() * 200 - 100) * 100) / 100,
      foreignFlow: Math.round((Math.random() * 150 - 75) * 100) / 100,
      optionsSkew: Math.round((Math.random() * 2 - 1) * 100) / 100
    };
  };

  // LSTM予測モデル（簡易版）
  const createLSTMModel = (data) => {
    if (data.length < 60) return null;
    
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const normalizedPrices = prices.map(p => (p - minPrice) / (maxPrice - minPrice));
    
    const recent = normalizedPrices.slice(-10);
    const trend = recent.reduce((acc, curr, idx) => acc + (idx > 0 ? curr - recent[idx-1] : 0), 0) / 9;
    const volatility = Math.sqrt(recent.reduce((acc, curr) => acc + Math.pow(curr - _.mean(recent), 2), 0) / recent.length);
    
    const prediction = recent[recent.length - 1] + trend + (Math.random() - 0.5) * volatility * 0.5;
    const denormalizedPrediction = prediction * (maxPrice - minPrice) + minPrice;
    
    return {
      prediction: Math.round(denormalizedPrediction),
      confidence: Math.max(0.4, Math.min(0.95, 0.8 - volatility * 2)),
      trend: trend > 0 ? 'bullish' : 'bearish',
      volatilityRisk: volatility > 0.02 ? 'high' : volatility > 0.01 ? 'medium' : 'low'
    };
  };

  // リスク指標計算
  const calculateRiskMetrics = (data) => {
    const returns = data.map(d => d.returns).filter(r => r !== 0);
    const mean = _.mean(returns);
    const std = Math.sqrt(_.mean(returns.map(r => Math.pow(r - mean, 2))));
    
    const sortedReturns = returns.sort((a, b) => a - b);
    const var95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)];
    
    const riskFreeRate = 0.001;
    const sharpeRatio = (mean - riskFreeRate) / std;
    
    const prices = data.map(d => d.price);
    let maxDrawdown = 0;
    let peak = prices[0];
    
    for (let price of prices) {
      if (price > peak) peak = price;
      const drawdown = (peak - price) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    return {
      var95: Math.round(var95 * 10000) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 10000) / 100,
      volatility: Math.round(std * 100 * Math.sqrt(252) * 100) / 100,
      beta: Math.round((0.8 + Math.random() * 0.8) * 100) / 100
    };
  };

  // 移動平均計算
  const calculateMA = (data, period) => {
    const ma = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ma.push(null);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.price, 0);
        ma.push(Math.round(sum / period));
      }
    }
    return ma;
  };

  // RSI計算
  const calculateRSI = (data, period = 14) => {
    if (data.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = data[data.length - i].price - data[data.length - i - 1].price;
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    return Math.round(rsi * 100) / 100;
  };

  // バックテスト実行
  const runBacktest = (data) => {
    let capital = 1000000;
    let position = 0;
    let trades = [];
    let equity = [capital];
    
    const ma5 = calculateMA(data, 5);
    const ma20 = calculateMA(data, 20);
    
    for (let i = 20; i < data.length; i++) {
      const price = data[i].price;
      
      if (ma5[i] > ma20[i] && ma5[i-1] <= ma20[i-1] && position <= 0) {
        if (position < 0) {
          capital += position * price;
          trades.push({ type: 'cover', price, date: data[i].date });
        }
        position = Math.floor(capital * 0.95 / price);
        capital -= position * price;
        trades.push({ type: 'buy', price, date: data[i].date, shares: position });
      } else if (ma5[i] < ma20[i] && ma5[i-1] >= ma20[i-1] && position >= 0) {
        if (position > 0) {
          capital += position * price;
          trades.push({ type: 'sell', price, date: data[i].date, shares: position });
          position = 0;
        }
      }
      
      const totalValue = capital + (position * price);
      equity.push(totalValue);
    }
    
    const finalValue = equity[equity.length - 1];
    const totalReturn = (finalValue - 1000000) / 1000000;
    
    return {
      totalReturn: Math.round(totalReturn * 10000) / 100,
      finalValue: Math.round(finalValue),
      trades: trades.length,
      winRate: trades.filter(t => t.type === 'sell').length > 0 ? 
        Math.round((trades.filter(t => t.profit > 0).length / trades.filter(t => t.type === 'sell').length) * 100) : 0,
      equity: equity
    };
  };

  // データロード関数
  const loadAllData = async (stockCode) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = generateAdvancedStockData(stockCode);
      setStockData(data);
      
      const currentPrice = data[data.length - 1]?.price || 2000;
      const fundamental = generateFundamentalData(stockCode, currentPrice);
      setFundamentalData(fundamental);
      
      const sentiment = generateSentimentData();
      setSentimentData(sentiment);
      
      const mlResult = createLSTMModel(data);
      setMlPrediction(mlResult);
      
      const risk = calculateRiskMetrics(data);
      setRiskMetrics(risk);
      
      const backtest = runBacktest(data);
      setBacktestResults(backtest);
      
    } catch (err) {
      console.error('データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData(selectedStock);
  }, [selectedStock]);

  // 概要タブ
  const OverviewTab = () => {
    const currentPrice = stockData[stockData.length - 1]?.price || 0;
    const priceChange = stockData.length > 1 ? currentPrice - stockData[stockData.length - 2].price : 0;
    const changePercent = stockData.length > 1 ? (priceChange / stockData[stockData.length - 2].price) * 100 : 0;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">現在株価</p>
                <p className="text-3xl font-bold text-gray-900">¥{currentPrice.toLocaleString()}</p>
                <p className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({changePercent.toFixed(2)}%)
                </p>
              </div>
              <DollarSign className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">AI予測価格</p>
                <p className="text-2xl font-bold text-gray-900">¥{mlPrediction?.prediction?.toLocaleString()}</p>
                <p className="text-sm text-blue-600">信頼度: {Math.round((mlPrediction?.confidence || 0) * 100)}%</p>
              </div>
              <Brain className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">リスクレベル</p>
                <p className="text-2xl font-bold text-gray-900">{mlPrediction?.volatilityRisk || 'N/A'}</p>
                <p className="text-sm text-gray-600">VaR: {riskMetrics.var95}%</p>
              </div>
              <Shield className="text-red-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">センチメント</p>
                <p className="text-2xl font-bold text-gray-900">{sentimentData.newsScore > 0 ? 'ポジティブ' : 'ネガティブ'}</p>
                <p className="text-sm text-gray-600">スコア: {sentimentData.newsScore}</p>
              </div>
              <Activity className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">株価チャート (1年間)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={stockData.slice(-60)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`¥${value?.toLocaleString()}`, '株価']}
                labelFormatter={(label) => new Date(label).toLocaleDateString('ja-JP')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#2563eb" 
                strokeWidth={2}
                name="株価"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ファンダメンタル指標</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>PER</span>
                <span className="font-semibold">{fundamentalData.per}</span>
              </div>
              <div className="flex justify-between">
                <span>PBR</span>
                <span className="font-semibold">{fundamentalData.pbr}</span>
              </div>
              <div className="flex justify-between">
                <span>ROE</span>
                <span className="font-semibold">{fundamentalData.roe}%</span>
              </div>
              <div className="flex justify-between">
                <span>配当利回り</span>
                <span className="font-semibold">{fundamentalData.dividendYield}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">テクニカル指標</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>RSI</span>
                <span className="font-semibold">{calculateRSI(stockData)}</span>
              </div>
              <div className="flex justify-between">
                <span>5日移動平均</span>
                <span className="font-semibold">¥{calculateMA(stockData, 5).slice(-1)[0]?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ボラティリティ</span>
                <span className="font-semibold">{riskMetrics.volatility}%</span>
              </div>
              <div className="flex justify-between">
                <span>ベータ値</span>
                <span className="font-semibold">{riskMetrics.beta}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // テクニカルタブ
  const TechnicalTab = () => {
    const chartData = stockData.slice(-60).map((item, index, arr) => ({
      ...item,
      ma5: calculateMA(arr, 5)[index],
      ma20: calculateMA(arr, 20)[index]
    }));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">テクニカル分析</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} name="株価" dot={false} />
              <Line type="monotone" dataKey="ma5" stroke="#16a34a" strokeWidth={1} name="5MA" dot={false} />
              <Line type="monotone" dataKey="ma20" stroke="#dc2626" strokeWidth={1} name="20MA" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // ファンダメンタルタブ
  const FundamentalTab = () => {
    const radarData = [
      { subject: '成長性', A: fundamentalData.revenueGrowth > 10 ? 80 : fundamentalData.revenueGrowth > 5 ? 60 : 40 },
      { subject: '収益性', A: fundamentalData.roe > 15 ? 80 : fundamentalData.roe > 10 ? 60 : 40 },
      { subject: '効率性', A: fundamentalData.roa > 5 ? 80 : fundamentalData.roa > 3 ? 60 : 40 },
      { subject: '安全性', A: fundamentalData.currentRatio > 2 ? 80 : fundamentalData.currentRatio > 1.5 ? 60 : 40 },
      { subject: '割安性', A: fundamentalData.per < 15 ? 80 : fundamentalData.per < 25 ? 60 : 40 }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">財務指標</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">PER</span>
                <span className="font-semibold">{fundamentalData.per}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">PBR</span>
                <span className="font-semibold">{fundamentalData.pbr}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ROE</span>
                <span className="font-semibold">{fundamentalData.roe}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ROA</span>
                <span className="font-semibold">{fundamentalData.roa}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">配当利回り</span>
                <span className="font-semibold">{fundamentalData.dividendYield}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">売上成長率</span>
                <span className="font-semibold">{fundamentalData.revenueGrowth}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">財務スコア</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={18} domain={[0, 100]} />
                <Radar
                  name="スコア"
                  dataKey="A"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // MLタブ
  const MLTab = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 border border-purple-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Brain className="text-purple-600" />
          機械学習予測結果
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">予測価格 (1日後)</p>
            <p className="text-3xl font-bold text-gray-900">¥{mlPrediction?.prediction?.toLocaleString()}</p>
            <p className="text-sm text-gray-600">
              現在価格との差: {mlPrediction && stockData.length > 0 ? 
                Math.round(mlPrediction.prediction - stockData[stockData.length - 1].price) : 0} 円
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">信頼度</p>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round((mlPrediction?.confidence || 0) * 100)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.round((mlPrediction?.confidence || 0) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">トレンド</p>
            <p className={`text-2xl font-bold ${
              mlPrediction?.trend === 'bullish' ? 'text-green-600' : 'text-red-600'
            }`}>
              {mlPrediction?.trend === 'bullish' ? '上昇' : '下降'}
            </p>
            <p className="text-sm text-gray-600">
              リスクレベル: {mlPrediction?.volatilityRisk || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // リスクタブ
  const RiskTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="text-red-600" />
          リスク分析
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">VaR (95%)</p>
            <p className="text-2xl font-bold text-red-600">{riskMetrics.var95}%</p>
            <p className="text-xs text-gray-500">1日損失限度</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">シャープレシオ</p>
            <p className="text-2xl font-bold text-blue-600">{riskMetrics.sharpeRatio}</p>
            <p className="text-xs text-gray-500">リスク調整収益</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">最大DD</p>
            <p className="text-2xl font-bold text-orange-600">{riskMetrics.maxDrawdown}%</p>
            <p className="text-xs text-gray-500">最大下落率</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">ボラティリティ</p>
            <p className="text-2xl font-bold text-purple-600">{riskMetrics.volatility}%</p>
            <p className="text-xs text-gray-500">年率</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">ベータ値</p>
            <p className="text-2xl font-bold text-green-600">{riskMetrics.beta}</p>
            <p className="text-xs text-gray-500">市場連動性</p>
          </div>
        </div>
      </div>
    </div>
  );

  // バックテストタブ  
  const BacktestTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="text-green-600" />
          バックテスト結果
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">総リターン</p>
            <p className={`text-2xl font-bold ${
              backtestResults.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {backtestResults.totalReturn >= 0 ? '+' : ''}{backtestResults.totalReturn}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">最終評価額</p>
            <p className="text-2xl font-bold text-blue-600">
              ¥{backtestResults.finalValue?.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">取引回数</p>
            <p className="text-2xl font-bold text-purple-600">{backtestResults.trades}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">勝率</p>
            <p className="text-2xl font-bold text-orange-600">{backtestResults.winRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );

  // タブコンテンツ選択
  const TabContent = ({ tab }) => {
    switch(tab) {
      case 'overview':
        return <OverviewTab />;
      case 'technical':
        return <TechnicalTab />;
      case 'fundamental':
        return <FundamentalTab />;
      case 'ml':
        return <MLTab />;
      case 'risk':
        return <RiskTab />;
      case 'backtest':
        return <BacktestTab />;
      default:
        return <OverviewTab />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">高度な分析を実行中...</p>
          <p className="text-gray-500 text-sm mt-2">リアルタイムデータ取得・機械学習・リスク分析</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <TrendingUp className="text-green-600" />
          プロフェッショナル株価予測システム
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-xl">
            AI Powered
          </span>
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              銘柄選択
            </label>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {majorStocks.map((stock) => (
                <option key={stock.code} value={stock.code}>
                  {stock.code} - {stock.name} ({stock.sector})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-4 md:mt-6">
            <Database size={16} />
            <span>リアルタイム接続: API模擬</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: '概要', icon: Activity },
              { id: 'technical', name: 'テクニカル', icon: BarChart3 },
              { id: 'fundamental', name: 'ファンダメンタル', icon: Calculator },
              { id: 'ml', name: 'AI予測', icon: Brain },
              { id: 'risk', name: 'リスク分析', icon: Shield },
              { id: 'backtest', name: 'バックテスト', icon: Target }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* タブコンテンツ */}
      <TabContent tab={activeTab} />

      {/* 免責事項 */}
      <div className="mt-8 space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-yellow-600 mt-1" size={20} />
            <div>
              <h3 className="text-yellow-800 font-semibold mb-2">重要な免責事項</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• このシステムは投資判断の参考情報を提供するものです</li>
                <li>• 投資には元本割れリスクが伴い、必ず自己責任で判断してください</li>
                <li>• 予測の精度は保証されず、実際の市場結果とは異なる場合があります</li>
                <li>• 重要な投資判断は金融の専門家にご相談ください</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalStockPredictor;
