from fastapi import FastAPI
from app.api import auth, tasks, wallet, transactions, dashboard
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(wallet.router)
app.include_router(transactions.router)
app.include_router(dashboard.router)