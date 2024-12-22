# 異なるプロジェクト環境での App Engine と Firebase 接続ガイド

## 概要
このガイドでは、別組織の GCP プロジェクトから既存の Firebase インスタンスへ接続する際の設定手順と注意点について説明します。

## 前提条件
- デプロイ先の GCP プロジェクトへのアクセス権限
- 接続先の Firebase プロジェクトへの管理者権限
- App Engine の環境設定権限

## セットアップ手順

### 1. サービスアカウントの設定
1. 適切な権限を持つサービスアカウントの作成
   - Firebase Admin SDK Administrator Service Agent
   - 必要な GCP サービスへのアクセス権限
2. セキュアなサービスアカウントキーの管理
   - Cloud Storage または Secret Manager での保管を推奨
   - キーファイルの直接コミットは厳禁

### 2. デプロイ設定
```yaml
# app.yaml
env_variables:
  FIREBASE_CREDENTIALS: "gs://your-bucket/credentials.json"
  # または Secret Manager を使用
  # FIREBASE_CREDENTIALS: "projects/123456789/secrets/firebase-key/versions/1"
```

### 3. プロジェクト間の接続設定
#### 同一組織の場合
- Firebase Console でプロジェクトの関連付けを実施
- IAM 権限の自動継承が可能

#### 異なる組織の場合
- Firebase 側での明示的な権限付与が必要
- クロスプロジェクトアクセスの設定確認

### 4. ネットワーク設定
- ファイアウォールルールの確認
- VPC 設定の確認（必要な場合）
- アウトバウンド接続の許可

## セキュリティ考慮事項
- 最小権限の原則に従った権限設定
- 認証情報の安全な管理
- 定期的な認証情報のローテーション
- アクセスログの監視

## トラブルシューティング
### 一般的な問題と解決方法
1. 認証エラー
   - サービスアカウント権限の確認
   - クレデンシャルの有効性確認

2. 接続エラー
   - ネットワーク設定の確認
   - ファイアウォールルールの確認

3. 権限エラー
   - IAM 設定の確認
   - クロスプロジェクト権限の確認

## 参考情報
- [Firebase Admin SDK ドキュメント](https://firebase.google.com/docs/admin/setup)
- [GCP クロスプロジェクト設定ガイド](https://cloud.google.com/iam/docs/cross-project-access)
- [App Engine セキュリティガイド](https://cloud.google.com/appengine/docs/security)
