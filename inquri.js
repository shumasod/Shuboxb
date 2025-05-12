// 配列を0で初期化
let array = Array(10).fill(0);

// 代入する値のリスト
const values = [3, 5, 4, 15, 14];

// 各値を条件に従って代入する関数
function insertValue(value, arr) {
  // 値を10で割った余りをインデックスとする
  let index = value % 10;
  
  // インデックスの要素が0でない場合、0が見つかるまでインクリメント
  while (arr[index] !== 0) {
    index = (index + 1) % arr.length; // 配列の範囲を超えないようにする
  }
  
  // 見つけた位置に値を代入
  arr[index] = value;
  
  // 現在の配列の状態を表示
  console.log(`${value}を代入後: [${arr.join(', ')}]`);
}

// 値を順番に代入
for (const value of values) {
  insertValue(value, array);
}

// 最終的な配列の状態
console.log("最終的な配列: [" + array.join(', ') + "]");
