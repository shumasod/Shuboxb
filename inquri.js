/**
 * 線形探査法を使用したハッシュテーブル実装
 * セキュリティ、パフォーマンス、保守性を考慮した改善版
 */

class HashTable {
    constructor(size = 10, loadFactorThreshold = 0.75) {
        this.validateSize(size);
        this.size = size;
        this.loadFactorThreshold = loadFactorThreshold;
        this.buckets = new Array(size).fill(null);
        this.count = 0;
        this.deletedMarker = Symbol('deleted');
    }

    /**
     * サイズの検証
     * @param {number} size - ハッシュテーブルのサイズ
     */
    validateSize(size) {
        if (!Number.isInteger(size) || size <= 0) {
            throw new Error('Hash table size must be a positive integer');
        }
        if (size > 1000000) {
            throw new Error('Hash table size too large (max: 1,000,000)');
        }
    }

    /**
     * 値の検証
     * @param {any} value - 検証する値
     */
    validateValue(value) {
        if (value === null || value === undefined) {
            throw new Error('Cannot insert null or undefined values');
        }
        if (typeof value !== 'number' || !Number.isInteger(value)) {
            throw new Error('Only integer values are supported');
        }
        if (value < 0) {
            throw new Error('Negative values are not supported');
        }
    }

    /**
     * ハッシュ関数（除算法）
     * @param {number} value - ハッシュ化する値
     * @returns {number} ハッシュ値
     */
    hash(value) {
        return Math.abs(value) % this.size;
    }

    /**
     * 二次探査法のハッシュ関数（クラスタリング対策）
     * @param {number} value - ハッシュ化する値
     * @param {number} attempt - 試行回数
     * @returns {number} ハッシュ値
     */
    quadraticHash(value, attempt) {
        return (this.hash(value) + attempt * attempt) % this.size;
    }

    /**
     * 負荷率の計算
     * @returns {number} 負荷率（0-1）
     */
    getLoadFactor() {
        return this.count / this.size;
    }

    /**
     * リサイズの必要性チェック
     * @returns {boolean} リサイズが必要かどうか
     */
    needsResize() {
        return this.getLoadFactor() > this.loadFactorThreshold;
    }

    /**
     * ハッシュテーブルのリサイズ
     */
    resize() {
        console.log(`負荷率が${this.loadFactorThreshold}を超えたため、リサイズを実行します...`);
        
        const oldBuckets = this.buckets;
        const oldSize = this.size;
        
        // サイズを2倍に拡張
        this.size = oldSize * 2;
        this.buckets = new Array(this.size).fill(null);
        this.count = 0;
        
        // 既存の要素を再挿入
        for (let i = 0; i < oldSize; i++) {
            const value = oldBuckets[i];
            if (value !== null && value !== this.deletedMarker) {
                this.insertWithoutResize(value);
            }
        }
        
        console.log(`リサイズ完了: ${oldSize} → ${this.size}`);
    }

    /**
     * 値の挿入（線形探査法）
     * @param {number} value - 挿入する値
     * @returns {boolean} 挿入が成功したかどうか
     */
    insert(value) {
        try {
            this.validateValue(value);
            
            // 重複チェック
            if (this.contains(value)) {
                console.log(`値 ${value} は既に存在します`);
                return false;
            }
            
            // リサイズが必要かチェック
            if (this.needsResize()) {
                this.resize();
            }
            
            return this.insertWithoutResize(value);
            
        } catch (error) {
            console.error(`挿入エラー: ${error.message}`);
            return false;
        }
    }

    /**
     * 値の挿入（リサイズなし）
     * @param {number} value - 挿入する値
     * @returns {boolean} 挿入が成功したかどうか
     */
    insertWithoutResize(value) {
        let index = this.hash(value);
        let attempts = 0;
        const maxAttempts = this.size;
        
        while (attempts < maxAttempts) {
            if (this.buckets[index] === null || this.buckets[index] === this.deletedMarker) {
                this.buckets[index] = value;
                this.count++;
                console.log(`${value}を位置${index}に挿入: [${this.buckets.join(', ')}]`);
                return true;
            }
            
            // 線形探査で次の位置を探す
            index = (index + 1) % this.size;
            attempts++;
        }
        
        throw new Error('Hash table is full - this should not happen after resize');
    }

    /**
     * 値の検索
     * @param {number} value - 検索する値
     * @returns {boolean} 値が存在するかどうか
     */
    contains(value) {
        try {
            this.validateValue(value);
            
            let index = this.hash(value);
            let attempts = 0;
            const maxAttempts = this.size;
            
            while (attempts < maxAttempts) {
                if (this.buckets[index] === null) {
                    return false; // 空の位置に到達したら存在しない
                }
                
                if (this.buckets[index] === value) {
                    return true;
                }
                
                index = (index + 1) % this.size;
                attempts++;
            }
            
            return false;
            
        } catch (error) {
            console.error(`検索エラー: ${error.message}`);
            return false;
        }
    }

    /**
     * 値の削除
     * @param {number} value - 削除する値
     * @returns {boolean} 削除が成功したかどうか
     */
    delete(value) {
        try {
            this.validateValue(value);
            
            let index = this.hash(value);
            let attempts = 0;
            const maxAttempts = this.size;
            
            while (attempts < maxAttempts) {
                if (this.buckets[index] === null) {
                    console.log(`値 ${value} は存在しません`);
                    return false;
                }
                
                if (this.buckets[index] === value) {
                    this.buckets[index] = this.deletedMarker;
                    this.count--;
                    console.log(`${value}を削除: [${this.buckets.join(', ')}]`);
                    return true;
                }
                
                index = (index + 1) % this.size;
                attempts++;
            }
            
            console.log(`値 ${value} は存在しません`);
            return false;
            
        } catch (error) {
            console.error(`削除エラー: ${error.message}`);
            return false;
        }
    }

    /**
     * すべての値を取得
     * @returns {number[]} ハッシュテーブル内のすべての値
     */
    getValues() {
        return this.buckets.filter(value => 
            value !== null && value !== this.deletedMarker
        );
    }

    /**
     * ハッシュテーブルの統計情報を取得
     * @returns {Object} 統計情報
     */
    getStats() {
        const values = this.getValues();
        const loadFactor = this.getLoadFactor();
        const emptySlots = this.buckets.filter(bucket => bucket === null).length;
        const deletedSlots = this.buckets.filter(bucket => bucket === this.deletedMarker).length;
        
        return {
            size: this.size,
            count: this.count,
            loadFactor: loadFactor.toFixed(3),
            emptySlots,
            deletedSlots,
            values: values.sort((a, b) => a - b)
        };
    }

    /**
     * クラスタリングの分析
     * @returns {Object} クラスタリング情報
     */
    analyzeCluster() {
        const clusters = [];
        let currentCluster = [];
        
        for (let i = 0; i < this.size; i++) {
            if (this.buckets[i] !== null && this.buckets[i] !== this.deletedMarker) {
                currentCluster.push(i);
            } else {
                if (currentCluster.length > 0) {
                    clusters.push([...currentCluster]);
                    currentCluster = [];
                }
            }
        }
        
        if (currentCluster.length > 0) {
            clusters.push(currentCluster);
        }
        
        const maxClusterSize = Math.max(...clusters.map(c => c.length), 0);
        const avgClusterSize = clusters.length > 0 ? 
            clusters.reduce((sum, c) => sum + c.length, 0) / clusters.length : 0;
        
        return {
            clusterCount: clusters.length,
            maxClusterSize,
            avgClusterSize: avgClusterSize.toFixed(2),
            clusters: clusters.map(c => ({ positions: c, size: c.length }))
        };
    }

    /**
     * ハッシュテーブルをクリア
     */
    clear() {
        this.buckets.fill(null);
        this.count = 0;
        console.log('ハッシュテーブルをクリアしました');
    }

    /**
     * 文字列表現
     * @returns {string} ハッシュテーブルの文字列表現
     */
    toString() {
        return `HashTable(size=${this.size}, count=${this.count}, loadFactor=${this.getLoadFactor().toFixed(3)})`;
    }
}

// 使用例とテスト
function demonstrateHashTable() {
    console.log('=== ハッシュテーブルのデモンストレーション ===\n');
    
    // ハッシュテーブルの作成
    const hashTable = new HashTable(10, 0.75);
    console.log('初期状態:', hashTable.toString());
    
    // 値の挿入
    const values = [3, 5, 4, 15, 14, 25, 35, 45];
    console.log('\n--- 値の挿入 ---');
    
    for (const value of values) {
        hashTable.insert(value);
    }
    
    // 統計情報の表示
    console.log('\n--- 統計情報 ---');
    console.log('統計:', hashTable.getStats());
    
    // クラスタリング分析
    console.log('\n--- クラスタリング分析 ---');
    console.log('クラスタリング:', hashTable.analyzeCluster());
    
    // 検索のテスト
    console.log('\n--- 検索テスト ---');
    console.log('5の検索:', hashTable.contains(5));
    console.log('99の検索:', hashTable.contains(99));
    
    // 削除のテスト
    console.log('\n--- 削除テスト ---');
    hashTable.delete(15);
    console.log('削除後の統計:', hashTable.getStats());
    
    // エラーハンドリングのテスト
    console.log('\n--- エラーハンドリングテスト ---');
    hashTable.insert(null);     // エラー
    hashTable.insert(-5);       // エラー
    hashTable.insert(3.14);     // エラー
    hashTable.insert('string'); // エラー
    
    console.log('\n最終状態:', hashTable.toString());
}

// デモンストレーションの実行
demonstrateHashTable();

// パフォーマンステスト
function performanceTest() {
    console.log('\n=== パフォーマンステスト ===');
    
    const hashTable = new HashTable(100);
    const testValues = Array.from({ length: 1000 }, (_, i) => Math.floor(Math.random() * 10000));
    
    console.time('1000件の挿入');
    for (const value of testValues) {
        hashTable.insert(value);
    }
    console.timeEnd('1000件の挿入');
    
    console.time('1000件の検索');
    for (const value of testValues) {
        hashTable.contains(value);
    }
    console.timeEnd('1000件の検索');
    
    console.log('最終統計:', hashTable.getStats());
    console.log('最終クラスタリング:', hashTable.analyzeCluster());
}

// パフォーマンステストの実行
performanceTest();
