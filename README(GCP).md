

# Firebase と App Engine の認証連携ガイド (2025年最新版)

## 概要
このガイドでは、Firebase 認証システムと Google App Engine を安全に連携させるための最新のセットアップ方法を解説します。2025年現在の最新の機能やベストプラクティスを反映しています。

## 前提条件
- Google Cloud Platform (GCP) アカウント
- Firebase プロジェクト (Blaze プラン推奨)
- App Engine プロジェクト
- プロジェクトの地域設定 (REGION_ID)

## セットアップ手順

### 1. Firebaseをプロジェクトに追加

1. **Firebase コンソールでプロジェクトを設定**
   - Firebase コンソールで既存の GCP プロジェクトを追加するか、新規作成します
   - 「プロジェクトを追加」ツールを使用して GCP プロジェクトと Firebase を連携します Firebase を Google Cloud プロジェクトに追加することで、ユーザー認証を有効にしパーソナライズされたウェブサービス体験を提供できます

2. **認証プロバイダーの有効化**
   - Firebase コンソールで「構築 > Authentication > ログイン方法」を選択
   - 必要な認証プロバイダーを有効化（例：メール/パスワード、Google サインイン）
   - 「保存」をクリックして設定を反映

3. **OAuth リダイレクトドメインの承認**
   適切な認証を行うには、OAuth リダイレクト用にドメインを承認する必要があります
   - 「構築 > Authentication > 設定」を選択
   - 「承認済みドメイン」で「ドメインを追加」をクリック
   - App Engine のドメインを追加: `PROJECT_ID.REGION_ID.r.appspot.com`
   - 2020年2月以降に作成されたアプリでは REGION_ID が含まれることに注意

### 2. サービスアカウントの設定

1. **サービスアカウントの作成**
   Firebase サービスへのアクセスを認証および承認するには、JSON 形式の秘密鍵ファイルを生成する必要があります
   - Firebase コンソールで「設定 > サービスアカウント」を開く
   - 「新しい秘密鍵の生成」をクリックし、確認ダイアログで「鍵を生成」をクリック
   - ダウンロードされた JSON ファイルを安全に保管

2. **必要な権限を付与**
   - サービスアカウントには以下の権限が必要：
     - Firebase Admin SDK Administrator Service Agent
     - 必要に応じて追加の GCP 権限

3. **セキュリティ上の注意**
   - サービスアカウントキーは機密情報として扱うこと
   - 公開リポジトリにコミットしない
   - 最小権限の原則に従い、必要最小限の権限のみを付与

### 3. App Engine の環境設定

Firebase Admin SDK を App Engine で使用するには、2つの認証方法があります：

#### A. 環境変数を使用する方法
```yaml
# app.yaml
env_variables:
  GOOGLE_APPLICATION_CREDENTIALS: "/path/to/service-account.json"
```

#### B. コード内で明示的に資格情報を指定する方法

このアプローチはローカルテスト時やデプロイ時に柔軟性を提供します。

### 4. Firebase Admin SDK の実装

#### Node.js での実装
```javascript
// Admin SDK の初期化 (環境変数使用)
const admin = require('firebase-admin');

// 方法1: 環境変数を使用（推奨）
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'YOUR_PROJECT_ID' // ローカルテスト時に必要
});

// 方法2: サービスアカウント情報を直接指定
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

#### Python での実装
```python
import firebase_admin
from firebase_admin import credentials, auth

# 方法1: 環境変数を使用（推奨）
firebase_admin.initialize_app(
    options={'projectId': 'YOUR_PROJECT_ID'} # ローカルテスト時に必要
)

# 方法2: サービスアカウント情報を直接指定
cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
```

### 5. クライアント側の実装

Webアプリケーションでユーザー認証を実装します：

```javascript
// Firebase設定ファイルを初期化
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 認証状態の監視
auth.onAuthStateChanged(function(user) {
  if (user) {
    // ユーザーがサインインしている場合
    console.log(`サインイン済み: ${user.displayName} (${user.email})`);
    
    // IDトークンを取得してCookieに保存
    user.getIdToken().then(function(token) {
      document.cookie = "token=" + token;
    });
  } else {
    // ユーザーがサインアウトしている場合
    console.log('サインアウト状態');
  }
});
```

### 6. App Engineでのトークン検証

サーバー側（App Engine）でFirebase認証トークンを検証します：

#### Node.js での実装
```javascript
const admin = require('firebase-admin');

// ミドルウェア: Firebaseトークン検証
async function verifyFirebaseToken(req, res, next) {
  const token = req.cookies.token || '';
  
  if (!token) {
    return res.status(401).send('認証が必要です');
  }
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('トークン検証エラー:', error);
    res.status(401).send('認証に失敗しました');
  }
}

// 保護されたルートの例
app.get('/protected', verifyFirebaseToken, (req, res) => {
  res.send(`ようこそ ${req.user.name}さん`);
});
```

#### Python での実装
```python
from firebase_admin import auth
from flask import request, jsonify

# ミドルウェア: Firebaseトークン検証
def verify_firebase_token(f):
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('token', '')
        
        if not token:
            return jsonify({'error': '認証が必要です'}), 401
        
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            print(f'トークン検証エラー: {e}')
            return jsonify({'error': '認証に失敗しました'}), 401
    
    return decorated_function

# 保護されたルートの例
@app.route('/protected')
@verify_firebase_token
def protected():
    return jsonify({'message': f'ようこそ {request.user["name"]}さん'})
```

## 2025年の最新機能

Firebase Authentication には、Spark プラン（無料）と Blaze プラン（従量課金制）の2つのプランがあります。最新の情報によると:

- 2025年10月1日から、Cloud Storage（デフォルトバケットを含む）を使用するには Blaze プランが必要になります 2025年10月1日以降、デフォルトバケットを含むCloud Storageを使用するにはBlazeプランが必要となります

- Firebase Studio：クラウドベースの開発環境が新しく登場し、AI アプリケーションの開発から管理までのライフサイクル全体を加速 Firebase Studioは、AIアプリケーションのプロトタイピング、構築、管理を支援する新しいクラウドベースのエージェント開発環境です

- App Testing エージェント：Gemini を活用したテストケースの生成・管理・実行エージェント App Testing エージェントは、Gemini を活用したテストケース生成、管理、実行エージェントです

## トラブルシューティング

### 認証エラーの対処方法
1. **環境変数の確認**
   - `GOOGLE_APPLICATION_CREDENTIALS` が正しく設定されているか
   - プロジェクトIDが正しいか

2. **サービスアカウント権限の確認**
   - サービスアカウントに必要な権限があるか確認
   - Firebase Admin SDK Administrator Service Agent 権限があるか

3. **ローカルテスト時の特別な設定**
   ローカルで gcloud auth application-default login を使用して Google Application Default Credentials でテストする場合、Firebase Authentication を使用するには追加の変更が必要です
   - 独自の OAuth 2.0 クライアント ID を使用します：
     ```
     gcloud auth application-default login --client-id-file=[/path/to/client/id/file]
     ```
   - プロジェクト ID を明示的に指定するか、`GOOGLE_CLOUD_PROJECT` 環境変数を設定します

## 参考リンク
- [Firebase Admin SDK セットアップガイド](https://firebase.google.com/docs/admin/setup)
- [App Engine での Firebase 認証](https://cloud.google.com/appengine/docs/standard/python3/building-app/authenticating-users)
- [Firebase Authentication ドキュメント](https://firebase.google.com/docs/auth)

## サポート
問題が解決しない場合は、以下のリソースを確認してください：
- [Firebase のサポートページ](https://firebase.google.com/support)
- [Google Cloud サポート](https://cloud.google.com/support)
- [Stack Overflow の Firebase タグ](https://stackoverflow.com/questions/tagged/firebase)
