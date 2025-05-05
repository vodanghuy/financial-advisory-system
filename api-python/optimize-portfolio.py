import numpy as np
import pandas as pd
from scipy.optimize import minimize

def optimize_portfolio(returns, cov_matrix, risk_tolerance):
    num_assets = len(returns)
    
    def portfolio_volatility(weights, returns, cov_matrix):
        return np.sqrt(np.dot(weights.T, np.dot(cov_matrix * 252, weights)))
    
    def portfolio_return(weights, returns):
        return np.sum(returns * weights) * 252
    
    constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1})
    bounds = tuple((0, 1) for _ in range(num_assets))
    initial_weights = num_assets * [1. / num_assets]
    
    result = minimize(
        lambda x: portfolio_volatility(x, returns, cov_matrix) - risk_tolerance * portfolio_return(x, returns),
        initial_weights,
        method='SLSQP',
        bounds=bounds,
        constraints=constraints
    )
    return result.x.tolist()

# Dữ liệu giả lập
returns = np.array([0.12, 0.10, 0.08])  # Lợi nhuận kỳ vọng của 3 tài sản
cov_matrix = np.array([[0.1, 0.01, 0.02], [0.01, 0.08, 0.01], [0.02, 0.01, 0.09]])  # Ma trận hiệp phương sai
risk_tolerance = 0.5  # Mức chấp nhận rủi ro
optimal_weights = optimize_portfolio(returns, cov_matrix, risk_tolerance)
print(optimal_weights)