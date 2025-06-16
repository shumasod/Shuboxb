<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>阿部寛のホームページ SRE改善提案</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
            color: #333;
            line-height: 1.6;
        }
        .slide {
            min-height: 100vh;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: white;
            margin: 20px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }
        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71, #3498db);
        }
        h1 {
            font-size: 2.5em;
            margin: 0 0 20px 0;
            color: #2c3e50;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            font-size: 2em;
            margin: 0 0 30px 0;
            color: #34495e;
            border-bottom: 3px solid #e74c3c;
            padding-bottom: 10px;
        }
        h3 {
            font-size: 1.5em;
            color: #2c3e50;
            margin: 20px 0 15px 0;
        }
        .subtitle {
            font-size: 1.2em;
            color: #7f8c8d;
            margin-bottom: 40px;
        }
        .highlight {
            background: linear-gradient(120deg, #ff9a9e 0%, #fecfef 100%);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 5px solid #e74c3c;
        }
        .warning {
            background: linear-gradient(120deg, #ffeaa7 0%, #fab1a0 100%);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 5px solid #f39c12;
        }
        .success {
            background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 5px solid #2ecc71;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin: 30px 0;
            width: 100%;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-top: 4px solid #3498db;
        }
        .stat-number {
            font-size: 2.2em;
            font-weight: bold;
            color: #e74c3c;
            display: block;
        }
        .stat-label {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .improvement-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin: 30px 0;
            width: 100%;
        }
        .improvement-card {
            background: #ffffff;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            border-top: 4px solid #2ecc71;
            text-align: left;
        }
        .improvement-card h4 {
            color: #27ae60;
            margin: 0 0 15px 0;
            font-size: 1.3em;
        }
        .simple-list {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #3498db;
        }
        .before-after {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 30px 0;
            width: 100%;
        }
        .before, .after {
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        .before {
            background: #ffebee;
            border-top: 4px solid #f44336;
        }
        .after {
            background: #e8f5e8;
            border-top: 4px solid #4caf50;
        }
        .timeline {
            width: 100%;
            margin: 30px 0;
        }
        .timeline-item {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 10px;
            border-left: 5px solid #3498db;
            position: relative;
            text-align: left;
        }
        .timeline-item h4 {
            color: #2c3e50;
            margin: 0 0 10px 0;
        }
        .priority-high {
            border-left-color: #e74c3c !important;
        }
        .priority-medium {
            border-left-color: #f39c12 !important;
        }
        .priority-low {
            border-left-color: #2ecc71 !important;
        }
        .navigation {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        .nav-btn {
            background: #3498db;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }
        .nav-btn:hover {
            background: #2980b9;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
        }
        .nav-btn:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
            transform: none;
        }
        .slide-number {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(52, 152, 219, 0.1);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            color: #2c3e50;
        }
        .big-number {
            font-size: 3em;
            font-weight: bold;
            color: #e74c3c;
            margin: 10px 0;
        }
        .emoji {
            font-size: 1.5em;
            margin-right: 10px;
        }
        .problem-solution {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        .problem {
            background: #ffebee;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #f44336;
        }
        .solution {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #4caf50;
        }
    </style>
</head>
<body>

    <!-- スライド1: 自己紹介 -->
    <div class="slide">
        <div class="slide-number">1/9</div>
        <h1>👋 自己紹介</h1>
        
        <div class="stats">
            <div class="stat-card">
                <span class="stat-number">🧑‍💻</span>
                <div class="stat-label">SREエンジニア</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">📊</span>
                <div class="stat-label">システム監視・改善</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">⚡</span>
                <div class="stat-label">高速化マニア</div>
            </div>
        </div>

        <div class="improvement-card" style="text-align: left; max-width: 600px;">
            <h4>🎯 今日お話しすること</h4>
            <ul>
                <li>みんな大好き「阿部寛のホームページ」の現状分析</li>
                <li>2024年に実際起きた障害とその影響</li>
                <li>シンプルさを保ちながら安全性を向上させる方法</li>
                <li>阿部寛らしい現実的な改善提案</li>
            </ul>
        </div>

        <div class="highlight">
            <strong>目標：</strong>ITエンジニアじゃない方にも分かりやすく<br>
            「阿部寛のサイトをもっと安全にする方法」をお伝えします！
        </div>
    </div>

    <!-- スライド2: SRE基礎知識 -->
    <div class="slide">
        <div class="slide-number">2/9</div>
        <h2>🔧 今日使う用語の簡単説明</h2>
        
        <div class="improvement-grid">
            <div class="improvement-card">
                <h4>🏗️ SRE（エスアールイー）</h4>
                <p><strong>Site Reliability Engineering</strong></p>
                <div class="simple-list">
                    <strong>簡単に言うと...</strong><br>
                    Webサイトを「止めない」「遅くしない」「安全に動かす」技術のこと
                </div>
                <p><strong>例：</strong>銀行のATMが24時間動いているのもSREの技術</p>
            </div>
            
            <div class="improvement-card">
                <h4>📊 監視システム</h4>
                <p>サイトの状態を24時間チェックする仕組み</p>
                <div class="simple-list">
                    <strong>何をチェック？</strong><br>
                    • サイトが正常に表示されるか<br>
                    • 表示速度は遅くないか<br>
                    • エラーが発生していないか
                </div>
                <p><strong>例：</strong>お店の防犯カメラのようなもの</p>
            </div>
            
            <div class="improvement-card">
                <h4>🔄 冗長化（じょうちょうか）</h4>
                <p>予備を用意しておくこと</p>
                <div class="simple-list">
                    <strong>なぜ必要？</strong><br>
                    メインのサーバーが故障しても、予備があるから大丈夫！
                </div>
                <p><strong>例：</strong>車のスペアタイヤのようなもの</p>
            </div>
            
            <div class="improvement-card">
                <h4>🌐 CDN</h4>
                <p><strong>Content Delivery Network</strong></p>
                <div class="simple-list">
                    <strong>仕組み</strong><br>
                    世界中にサーバーを置いて、一番近い場所から配信
                </div>
                <p><strong>例：</strong>コンビニのように「近くの店舗」から商品をお届け</p>
            </div>
        </div>

        <div class="success">
            <strong>💡 覚えておいてほしいこと</strong><br>
            これらの技術は全て「ユーザーが快適にサイトを使えるように」するためのものです
        </div>
    </div>

    <!-- スライド3: タイトル -->
    <div class="slide">
        <div class="slide-number">3/9</div>
        <h1>💡 阿部寛のホームページを<br>もっと安全にする方法</h1>
        <p class="subtitle">～現状の問題点と具体的な改善策～</p>
        
        <div class="stats">
            <div class="stat-card">
                <span class="stat-number">0.7秒</span>
                <div class="stat-label">現在の表示速度</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">2024年</span>
                <div class="stat-label">サーバーダウン発生</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">24時間</span>
                <div class="stat-label">監視体制なし</div>
            </div>
        </div>

        <div class="highlight">
            <strong>目標：</strong>スピードはそのまま、安全性をアップ！
        </div>
    </div>

    <!-- スライド4: 現在の問題点 -->
    <div class="slide">
        <div class="slide-number">4/9</div>
        <h2>⚠️ 現在の問題点</h2>
        
        <div class="problem-solution">
            <div class="problem">
                <h3>😱 良くない現状</h3>
                <div class="simple-list">
                    <strong>🔧 技術面</strong><br>
                    • サーバーが1台だけ<br>
                    • 故障したら全部ストップ<br>
                    • セキュリティ対策が古い
                </div>
                <div class="simple-list">
                    <strong>👀 監視面</strong><br>
                    • 24時間監視なし<br>
                    • 障害に気づくのが遅い<br>
                    • 復旧手順が不明確
                </div>
            </div>
            
            <div class="solution">
                <h3>📊 実際に起きた事例</h3>
                <div class="big-number">2024年1月</div>
                <p><strong>サーバーダウン発生</strong><br>
                → 阿部寛のサイトが見れない！<br>
                → SNSで大騒ぎに<br>
                → 「ネットの調子が悪い」と勘違いする人続出</p>
                
                <div class="warning">
                    <strong>影響の大きさ</strong><br>
                    通信障害の「ものさし」として使われているサイトが止まると、多くの人が混乱！
                </div>
            </div>
        </div>
    </div>

    <!-- スライド5: 改善の3つの柱 -->
    <div class="slide">
        <div class="slide-number">5/9</div>
        <h2>🏗️ 改善の3つの柱</h2>
        
        <div class="improvement-grid">
            <div class="improvement-card">
                <h4>👁️ 1. 見守り体制</h4>
                <p><strong>現在：</strong>誰も監視していない<br>
                <strong>改善後：</strong>24時間自動監視</p>
                
                <div class="simple-list">
                    <strong>具体的に何をする？</strong><br>
                    • 1分おきにサイトの状態をチェック<br>
                    • 異常があったらすぐに通知<br>
                    • 管理者にメール・SMS送信
                </div>
            </div>
            
            <div class="improvement-card">
                <h4>🔄 2. 予備システム</h4>
                <p><strong>現在：</strong>サーバー1台のみ<br>
                <strong>改善後：</strong>複数のサーバーで運用</p>
                
                <div class="simple-list">
                    <strong>具体的に何をする？</strong><br>
                    • メインサーバーが故障したら自動で切り替え<br>
                    • 世界中にコピーを配置<br>
                    • より近い場所から配信
                </div>
            </div>
            
            <div class="improvement-card">
                <h4>🛡️ 3. セキュリティ強化</h4>
                <p><strong>現在：</strong>基本的な対策のみ<br>
                <strong>改善後：</strong>現代的なセキュリティ</p>
                
                <div class="simple-list">
                    <strong>具体的に何をする？</strong><br>
                    • 悪意のあるアクセスをブロック<br>
                    • 大量アクセス攻撃への対策<br>
                    • 定期的なセキュリティチェック
                </div>
            </div>
        </div>
    </div>

    <!-- スライド6: 24時間監視システム -->
    <div class="slide">
        <div class="slide-number">6/9</div>
        <h2>👁️ 24時間監視システム</h2>
        
        <div class="before-after">
            <div class="before">
                <h3>現在：監視なし</h3>
                <div class="big-number">❌</div>
                <p>問題が起きても<br>誰も気づかない</p>
                <div class="simple-list">
                    <strong>問題発覚の流れ</strong><br>
                    1. ユーザーがアクセスできない<br>
                    2. SNSで話題になる<br>
                    3. やっと管理者が気づく<br>
                    4. 復旧作業開始（遅い）
                </div>
            </div>
            
            <div class="after">
                <h3>改善後：自動監視</h3>
                <div class="big-number">✅</div>
                <p>問題を即座に発見<br>すぐに対応開始</p>
                <div class="simple-list">
                    <strong>自動対応の流れ</strong><br>
                    1. システムが異常を検知<br>
                    2. 自動で予備システムに切り替え<br>
                    3. 管理者にすぐ通知<br>
                    4. ユーザーは気づかない（理想）
                </div>
            </div>
        </div>

        <div class="success">
            <h3>🎯 監視する項目</h3>
            <p><strong>サイトの応答速度</strong> / <strong>エラーの発生率</strong> / <strong>アクセス数の変化</strong> / <strong>サーバーの状態</strong></p>
        </div>
    </div>

    <!-- スライド7: 故障に強いシステム作り -->
    <div class="slide">
        <div class="slide-number">7/9</div>
        <h2>🔄 故障に強いシステム作り</h2>
        
        <div class="improvement-grid">
            <div class="improvement-card">
                <h4>🌐 世界中にコピーを配置</h4>
                <p>CDN（コンテンツ配信ネットワーク）を活用</p>
                <div class="simple-list">
                    <strong>メリット</strong><br>
                    • 日本からアクセス→日本のサーバーから配信<br>
                    • アメリカからアクセス→アメリカのサーバーから配信<br>
                    • より速く、より安全に
                </div>
            </div>
            
            <div class="improvement-card">
                <h4>⚡ 自動切り替え機能</h4>
                <p>メインサーバーに問題が起きたら瞬時に切り替え</p>
                <div class="simple-list">
                    <strong>仕組み</strong><br>
                    • 30秒以内に異常を検知<br>
                    • 自動で健全なサーバーに切り替え<br>
                    • ユーザーは中断を感じない
                </div>
            </div>
        </div>

        <div class="before-after">
            <div class="before">
                <h3>従来の構成</h3>
                <p>🖥️ サーバー1台<br>
                ↓<br>
                👤 ユーザー</p>
                <div class="warning">
                    サーバーが故障 = サービス停止
                </div>
            </div>
            
            <div class="after">
                <h3>改善後の構成</h3>
                <p>🌍 世界中のサーバー<br>
                ↓ 自動選択<br>
                ⚖️ 負荷分散<br>
                ↓<br>
                👤 ユーザー</p>
                <div class="success">
                    1台故障しても他がカバー
                </div>
            </div>
        </div>
    </div>

    <!-- スライド8: 阿部寛流実装スケジュール -->
    <div class="slide">
        <div class="slide-number">8/9</div>
        <h2>📅 阿部寛流：シンプル改善計画</h2>
        
        <div class="highlight">
            <h3>🎭 阿部寛のホームページの哲学</h3>
            <p><strong>「シンプル is ベスト」</strong><br>
            複雑にしない、余計なものは付けない、でも確実に動く</p>
        </div>

        <div class="timeline">
            <div class="timeline-item priority-high">
                <h4>📞 最小限の安全対策（即実施）</h4>
                <div class="simple-list">
                    <strong>阿部寛らしく、必要最小限だけ</strong><br>
                    • 1つの監視ツールだけ導入<br>
                    • 障害時の連絡先を1つ決める<br>
                    • 1台だけ予備サーバー準備
                </div>
                <p><strong>費用：</strong>月額500円〜1,000円（おにぎり代程度）</p>
            </div>
            
            <div class="timeline-item priority-medium">
                <h4>🌐 世界最速を守る対策（様子を見ながら）</h4>
                <div class="simple-list">
                    <strong>スピードを落とさず、安全性アップ</strong><br>
                    • 必要になったら世界配信を検討<br>
                    • 本当に必要な機能だけ追加<br>
                    • レトロデザインは絶対維持
                </div>
                <p><strong>方針：</strong>「必要に迫られたら考える」（阿部寛らしい判断）</p>
            </div>
            
            <div class="timeline-item priority-low">
                <h4>🎯 「もしもの時」の備え（将来的に）</h4>
                <div class="simple-list">
                    <strong>過剰にならず、現実的に</strong><br>
                    • 本当に大規模障害が起きたら検討<br>
                    • ファンが困るレベルになったら対応<br>
                    • それまでは現状維持
                </div>
                <p><strong>コンセプト：</strong>「今のままでも十分速いし...」</p>
            </div>
        </div>

        <div class="success">
            <h3>💭 阿部寛本人のコメント風</h3>
            <p>「あれ人気だから、あまりいじらない方がいいかな...<br>
            でも止まっちゃうと困るから、最低限の対策はしとこうか」</p>
        </div>
    </div>

    <!-- スライド9: ドラゴン桜風まとめ -->
    <div class="slide">
        <div class="slide-number">9/9</div>
        <h2>🏫 桜木建二流：システム改革論</h2>
        
        <div class="highlight">
            <h3>💥 桜木語録で語るSRE</h3>
            <p style="font-size: 1.4em; color: #2c3e50; font-weight: bold;">
            「いいか、お前ら。<br>
            システムってのはな、<br>
            <span style="color: #e74c3c;">備えた奴が勝つんだよ！</span>」
            </p>
        </div>

        <div class="improvement-grid">
            <div class="improvement-card">
                <h4>🔥 なぜ阿部寛のサイトは最強なのか？</h4>
                <div class="simple-list">
                    <strong>「シンプルなシステムこそ最強だ！」</strong><br>
                    • 複雑なシステム = 故障しやすい<br>
                    • シンプルなシステム = 壊れにくい<br>
                    • 見た目は古くても、中身は確実<br>
                    • これが真の「勝ち組システム」だ！
                </div>
            </div>
            
            <div class="improvement-card">
                <h4>⚡ システムは「目的」じゃない「手段」だ</h4>
                <div class="simple-list">
                    <strong>本当の目的は？</strong><br>
                    • ユーザーが快適に使えること<br>
                    • ファンが安心してアクセスできること<br>
                    • 「世界最速」のブランドを守ること<br>
                    • 技術は手段、体験がゴールだ！
                </div>
            </div>
        </div>

        <div class="warning" style="background: linear-gradient(120deg, #ff6b6b 0%, #ffd93d 100%); border-left-color: #e74c3c;">
            <h3>🚨 桜木の教え：システム運用の現実</h3>
            <p style="font-size: 1.2em; font-weight: bold;">
            「馬車馬システムになるな。<br>
            自分で考えるシステムになれ！」
            </p>
            <div class="simple-list">
                <strong>つまり...</strong><br>
                • 監視なしで動かす = 馬車馬システム<br>
                • 24時間見守る = 考えるシステム<br>
                • 障害を予測し、自動で対処する
            </div>
        </div>

        <div class="stats">
            <div class="stat-card">
                <span class="stat-number">備える</span>
                <div class="stat-label">監視・冗長化</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">シンプル</span>
                <div class="stat-label">複雑にしない</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">現実的</span>
                <div class="stat-label">必要最小限</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">勝つ</span>
                <div class="stat-label">ユーザー体験で</div>
            </div>
        </div>

        <div class="success">
            <h3>🎯 桜木流システム改革の極意</h3>
            <p style="font-size: 1.1em;">
            <strong>「不安になるのは、頑張ってる証拠だ」</strong><br>
            ↓<br>
            システムが不安定なのは、改善のチャンス<br>
            今こそ立ち上がれ！阿部寛のサイトよ！
            </p>
        </div>

        <div class="highlight">
            <h3>⚡ 最後に桜木からの檄</h3>
            <p style="font-size: 1.3em; color: #2c3e50; font-weight: bold;">
            「逃げていい。でも、最後まで動かしきれ。<br>
            <br>
            お前らのサイトが止まったら、<br>
            全国の通信障害チェックが困るんだよ！」
            </p>
        </div>

        <div class="warning" style="background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%); border-left-color: #2ecc71;">
            <p style="color: #2c3e50; font-size: 1.1em;">
            <strong>ありがとうございました。<br>
            質問は東大入試より簡単に答えます。</strong>
            </p>
        </div>
    </div>

    <!-- ナビゲーション -->
    <div class="navigation">
        <button class="nav-btn" onclick="previousSlide()">← 前へ</button>
        <button class="nav-btn" onclick="nextSlide()">次へ →</button>
    </div>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        function showSlide(n) {
            slides.forEach(slide => slide.style.display = 'none');
            slides[n].style.display = 'flex';
            
            // ナビゲーションボタンの状態更新
            document.querySelector('.navigation').children[0].disabled = n === 0;
            document.querySelector('.navigation').children[1].disabled = n === totalSlides - 1;
        }

        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                showSlide(currentSlide);
            }
        }

        function previousSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
        }

        // キーボードナビゲーション
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                previousSlide();
            }
        });

        // 初期化
        showSlide(0);
    </script>
</body>
</html>
