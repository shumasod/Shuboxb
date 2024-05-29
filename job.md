from fpdf import FPDF

# Create instance of FPDF class
pdf = FPDF()

# Add a page
pdf.add_page()

# Set font
pdf.set_font("Arial", size = 12)

# Title
pdf.set_font("Arial", 'B', 16)
pdf.cell(200, 10, txt = "職務経歴書", ln = True, align = 'C')
pdf.set_font("Arial", size = 12)
pdf.cell(200, 10, txt = "2024年5月29日現在", ln = True, align = 'C')

# Name
pdf.cell(200, 10, txt = "氏名：松崎 周馬", ln = True)

# Section 1: 主な技術の経験
pdf.set_font("Arial", 'B', 14)
pdf.cell(200, 10, txt = "主な技術の経験", ln = True)

# Skill levels
pdf.set_font("Arial", size = 12)
pdf.multi_cell(0, 10, txt = """スキルレベル
技術スキルレベルの目安
Lv.3
・独力で技術的な課題の発見と解決をリードする
・プロフェッショナルとして求められる経験の知識化や後進育成に貢献している
・業務経験年数の目安: 4年以上
Lv.2
・要求された作業を全て独力で遂行する
・業務経験年数の目安: 2~4年
Lv.1
・上位者の指導のもとに、要求された作業を担当する
・業務経験年数の目安: 2年未満
※スキルレベルはForkwellにて定めている技術レベルの目安となる基準値
""")

# Section 2: 技術スキル
pdf.set_font("Arial", 'B', 14)
pdf.cell(200, 10, txt = "技術スキル", ln = True)
pdf.set_font("Arial", size = 12)
pdf.multi_cell(0, 10, txt = """Lv.3
なし

Lv.2
・Apache, Linux, Zabbix

Lv.1
・PHP, MySQL, Git, AWS, Nagios, Laravel, Docker, Terraform, Microsoft Azure, Google Cloud Platform
""")

# Section 3: 自己紹介
pdf.set_font("Arial", 'B', 14)
pdf.cell(200, 10, txt = "自己紹介", ln = True)
pdf.set_font("Arial", size = 12)
pdf.multi_cell(0, 10, txt = """3年目のITエンジニアです。インフラエンジニアですが、開発チームのために自社サービスのインフラを会社組織のためにコーポレート領域で支援するための業務が主になります。組織やチームが属人化せずに標準化をできるようにするために奔走しています。また、インフラエンジニアですが開発業務も手伝ったりもします。2022年の8月から正社員として現職で働いています。また、休日はエンジニア勉強会に参加しており、様々なエンジニアさんと情報交換しております。興味があるイベントや勉強会なら、実際に遠方にも行く人間です。
""")

# Section 4: 職務経歴
pdf.set_font("Arial", 'B', 14)
pdf.cell(200, 10, txt = "職務経歴", ln = True)

# Job 1: 株式会社センターモバイル
pdf.set_font("Arial", 'B', 12)
pdf.cell(200, 10, txt = "株式会社センターモバイル エンジニア (2022年08月〜在職中)", ln = True)
pdf.set_font("Arial", size = 12)
pdf.multi_cell(0, 10, txt = """職務要約
ITインフラエンジニアとして、社内インフラの構築・運用・保守、セキュリティ対策、端末管理、ヘルプデスク業務を担当。また、自社サービスのインフラ基盤の運用保守、ログ監視、システム導入、ベンダーとの調整、業務改善プロジェクトも経験。これらの業務を通じて、社内のIT環境の最適化とセキュリティ強化に貢献してきた。開発業務では（言語はPHP、フレームワークはLaravel触ってます）

【インフラエンジニア兼社内SE】
・自社サービスインフラ基盤の運用保守業務（AWSとGCP）
・インフラ監視業務（サーバ）
・監視機能のリプレイスを実施、開発側もみやすくなった。
・PHP、Pythonのログを日頃から管理している部隊と話し合ってトラブルが起きたときに、すぐに対応できる環境を作った。
成果：障害の対応速度が早くなった。みやすさの部分も、すぐに反応しやすくなった。AWS使ってるが、ログインしないと現象を確認しないと見えなかった部分が、通知が自動的に来るようになって、見落とし防げるようになった。
失敗からの学び：開発側・インフラ側で分かれていたがお互いのことを理解しながら進めることで、関係値や業務理解の促進に繋がった。

【自社サービスインフラ基盤セキュリティ対策強化と品質向上プロジェクト（AWS）】
・入社当時、自社で展開しているサービスのインフラ基盤（AWS）に脆弱性や基盤が不安定なところがあり、品質の向上とセキュリティ強化する必要があった。
・ゼロトラスト製品をエンジニアの開発で導入、AWSでのセキュリティ関連の詳細な設定の見直し、バージョンアップ作業の定期的な実施。
成果：品質の向上とセキュリティ強化され、頑丈なインフラ基盤に強化することができ、大きなトラブルが以前より8割減った。
失敗からの学び：エンジニアとしてのセキュリティ対策の必要性とセキュリティ強化しすぎるとでてくる問題点への提案と理解。これを一つ一つ丁寧に実施していく重要性を学びました。
""")

# More sections to be added here following the same structure...

# Save the PDF
output_path = "/mnt/data/職務経歴書_松崎周馬.pdf"
pdf.output(output_path)

output_path
