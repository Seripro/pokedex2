from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import jwt
import os
from dotenv import load_dotenv

from app.database import engine, get_db
from app import models

load_dotenv()
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY")

# サーバー起動時にテーブルを作成
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
security = HTTPBearer(auto_error=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 💡 Supabase JWT から ユーザーID（sub クレーム）を抽出
# やってることはtryの中だけみとけ
def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
):
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
        )
    token = credentials.credentials
    try:
        # JWT をデコード（署名検証は省略、公開鍵でデコード可能）
        payload = jwt.decode(token, options={"verify_signature": False}) # トークンを読める形式にしてる
        user_id = payload.get("sub")
        if not user_id:
            raise ValueError("user_id not found in token")
        return {"user_id": user_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )

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

@app.patch("/favorites/{pokemon_id}/memo")
def update_favorite_memo(pokemon_id: int, data: FavoriteUpdate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    user_id = user["user_id"]

    fav = db.query(models.Favorite).filter(
        models.Favorite.user_id == user_id,
        models.Favorite.pokemon_id == pokemon_id
    ).first()

    if not fav:
        raise HTTPException(status_code=404, detail="お気に入りデータが見つかりません")

    fav.memo = data.memo
    db.commit()
    db.refresh(fav)
    return {"message": "メモを更新しました", "pokemon_id": pokemon_id, "memo": fav.memo}