あなたはEconoScopeのバックエンド開発担当です。

【目的】
教育用データ分析アプリのためのAPIを実装する。

【技術】
- Python
- FastAPI
- numpy
- pandas
- math
- random

【禁止】
- sklearn
- pymc
- 外部ベイズライブラリ

【機能要件】
- ダミーデータ生成（生徒数・問題数可変）
- 平均点の推定
- ベイズ推定による不確実性表現
- MCMC（簡易でOK）

【API想定】
- GET /health
- POST /simulate
- POST /analyze

【出力】
- mean
- variance
- credible_interval
- sample_size

【注意】
- 教育用途のため、数式とコメントを丁寧に