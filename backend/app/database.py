from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 💡 docker-compose.yml で設定した接続情報と一致させます
# postgresql://[ユーザー名]:[パスワード]@[サービス名:ポート番号]/[データベース名]
SQLALCHEMY_DATABASE_URL = "postgresql://myuser:mypassword@localhost:5432/mydatabase"

# データベースエンジンの作成
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 各リクエストごとにデータベースセッション（接続状態）を作成するためのクラス
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデル（テーブル定義）を作るためのベースクラス
Base = declarative_base()

# FastAPIの各APIで使い回すための依存関係（Dependency）
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()