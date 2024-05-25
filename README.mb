FirebaseとAppEngineを組み合わせて利用する際の認証方法については、以下の点に留意する必要があります。

1. **サービスアカウントの作成**

   Google Cloud Platformでサービスアカウントを作成し、そのアカウントにFirebaseの管理者権限を付与します。サービスアカウントキーのJSONファイルをダウンロードしておきます。

2. **AppEngine環境変数の設定**

   AppEngineアプリの環境変数に、サービスアカウントキーの内容を設定します。具体的には `GOOGLE_APPLICATION_CREDENTIALS` という変数に、サービスアカウントキーJSONファイルのパスを指定します。

3. **FirebaseAdminSDKの利用**

   アプリケーションコード内で、FirebaseAdminSDKを利用してFirebaseに接続します。SDKの初期化時に、環境変数から認証情報を読み込むよう設定します。

Node.jsの場合の例:

```javascript
import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

Python の場合の例:

```python
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate(json.loads(os.environ['GOOGLE_APPLICATION_CREDENTIALS']))
firebase_admin.initialize_app(cred)
```

このように、サービスアカウントキーを環境変数で渡し、FirebaseAdminSDKを利用することで、AppEngineからFirebaseに安全に接続できます。
公式ドキュメントも合わせてご確認ください。

- https://firebase.google.com/docs/admin/setup#initialize-sdk
- https://cloud.google.com/appengine/docs/flexible/python/authenticating-users-firebase-and-admin-auth
