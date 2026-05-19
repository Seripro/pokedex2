from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, get_db  # 💡 追加
from app.models import Favorite  # 定義したモデルを先に読み込む
from sqlalchemy.orm import Session


# 💡 モデルを読み込んだ後で、テーブルを自動作成する
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 💡 将来的に使うダミーユーザー情報
def get_current_user():
    return {"user_id": "dummy-uuid", "email": "guest@example.com"}

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}


@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    # 💡 データベースからお気に入りデータを全件取得してみる
    try:
        favorites = db.query(Favorite).all()
        return {
            "status": "success",
            "message": "データベースへの接続・テーブル確認に成功しました！",
            "data_count": len(favorites)
        }
    except Exception as e:
        return {
            "status": "error",
            "message": "テーブルが見つからないか、接続に失敗しています",
            "detail": str(e)
        }