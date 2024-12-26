# Firebase と App Engine の認証連携ガイド

## 概要
このガイドでは、Firebase と Google App Engine を連携する際の認証設定方法について説明します。

## 前提条件
- Google Cloud Platform (GCP) のアカウント
- Firebase プロジェクト
- App Engine プロジェクト

## セットアップ手順

### 1. サービスアカウントの設定
1. GCP コンソールで新しいサービスアカウントを作成
2. 必要な権限を付与:
   - Firebase Admin SDK Administrator Service Agent
   - 必要に応じて追加の GCP 権限
3. サービスアカウントキー (JSON) を生成してダウンロード
   - **注意**: キーファイルは安全に保管し、公開リポジトリにコミットしないでください

### 2. App Engine の環境変数設定
```yaml
# app.yaml
env_variables:
  GOOGLE_APPLICATION_CREDENTIALS: "path/to/service-account.json"
```

### 3. Firebase Admin SDK の実装

#### Node.js での実装
```javascript
import * as admin from 'firebase-admin';

// SDK の初期化
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

#### Python での実装
```python
import os
import json
import firebase_admin
from firebase_admin import credentials

# SDK の初期化
cred = credentials.Certificate(
    json.loads(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
)
firebase_admin.initialize_app(cred)
```

## セキュリティに関する注意事項
- サービスアカウントキーは機密情報として扱い、適切に管理する
- 本番環境では環境変数を使用してクレデンシャルを管理
- 最小権限の原則に従い、必要最小限の権限のみを付与

## トラブルシューティング
- 認証エラーが発生した場合:
  1. 環境変数が正しく設定されているか確認
  2. サービスアカウントの権限が適切か確認
  3. Firebase プロジェクトの設定を確認

## 参考リンク
- [Firebase Admin SDK セットアップガイド](https://firebase.google.com/docs/admin/setup#initialize-sdk)
- [App Engine での Firebase 認証](https://cloud.google.com/appengine/docs/flexible/python/authenticating-users-firebase-and-admin-auth)

## サポート
問題が解決しない場合は、以下を確認してください：
- Firebase のドキュメント
- GCP のサポートページ
- Stack Overflow の関連タグ
