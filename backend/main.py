from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import engine, get_db
from app import models

# サーバー起動時にテーブルを作成
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 💡 将来の認証用（今はダミーユーザーIDを返す）
def get_current_user():
    return {"user_id": "dummy-uuid"}

# 💡 Pydanticモデル: フロントから「お気に入り登録」のとき送られてくるデータの型定義
class FavoriteCreate(BaseModel):
    pokemon_id: int

class FavoriteUpdate(BaseModel):
    memo: str

# 💡 新しく追記：お気に入り一覧を返すときの型定義
class FavoriteResponse(BaseModel):
    pokemon_id: int
    memo: Optional[str] = None # メモは None（null）の可能性もある

    class Config:
        from_attributes = True # SQLAlchemyのモデルからPydanticの型に自動変換するための設定

# ==========================================
# 1. お気に入り一覧取得 (GET /favorites)
# ==========================================
@app.get("/favorites", response_model=list[FavoriteResponse])
def get_favorites(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    user_id = user["user_id"]
    # ログイン中ユーザーのお気に入りレコードを全件取得
    favs = db.query(models.Favorite).filter(models.Favorite.user_id == user_id).all()
    # ポケモンのID（整数）だけの配列にしてフロントに返す [6, 25, 150]
    return favs


# ==========================================
# 2. お気に入り登録 (POST /favorites)
# ==========================================
@app.post("/favorites", status_code=status.HTTP_201_CREATED)
def add_favorite(
    data: FavoriteCreate, 
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)
):
    user_id = user["user_id"]
    
    # 既に登録されているかチェック（二重登録防止）
    existing_fav = db.query(models.Favorite).filter(
        models.Favorite.user_id == user_id,
        models.Favorite.pokemon_id == data.pokemon_id
    ).first()
    
    if existing_fav:
        raise HTTPException(status_code=400, detail="すでにお気に入りに登録されています")
    
    # 新しいお気に入りレコードを作成して保存
    new_fav = models.Favorite(user_id=user_id, pokemon_id=data.pokemon_id)
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    
    return {"message": "お気に入りに追加しました", "pokemon_id": new_fav.pokemon_id}


# ==========================================
# 3. お気に入り解除 (DELETE /favorites/{pokemon_id})
# ==========================================
@app.delete("/favorites/{pokemon_id}")
def remove_favorite(
    pokemon_id: int, 
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)
):
    user_id = user["user_id"]
    
    # 該当するお気に入りレコードを探す
    fav = db.query(models.Favorite).filter(
        models.Favorite.user_id == user_id,
        models.Favorite.pokemon_id == pokemon_id
    ).first()
    
    if not fav:
        raise HTTPException(status_code=404, detail="お気に入りデータが見つかりません")
    
    # 削除
    db.delete(fav)
    db.commit()
    
    return {"message": "お気に入りを解除しました"}