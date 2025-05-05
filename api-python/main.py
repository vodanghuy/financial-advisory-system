from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np

app = FastAPI()

# Định nghĩa cấu trúc dữ liệu đầu vào
class PortfolioInput(BaseModel):
    returns: list[float]
    cov_matrix: list[list[float]]
    risk_tolerance: float

@app.post("/recommend")
async def recommend_portfolio(data: PortfolioInput):
    try:
        returns = np.array(data.returns)
        cov_matrix = np.array(data.cov_matrix)
        risk_tolerance = data.risk_tolerance
        
        # Gọi hàm tối ưu danh mục
        weights = optimize_portfolio(returns, cov_matrix, risk_tolerance)
        return {"optimal_weights": weights}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Chạy API: uvicorn main:app --host 0.0.0.0 --port 8000