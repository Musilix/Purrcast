from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from typing import List

sentiment = pipeline("sentiment-analysis")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
tagger = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

app = FastAPI()

# origins = ["*"]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

@app.get("/")
def read_root():
    return {"Hello": "World"}
 
@app.get("/ai/summarize")
def get_summary(text: str):
    return summarizer(text)

@app.get("/ai/sentiment")
def get_sentiment(text: str):
    return sentiment(text)

@app.get("/healthcheck")
def read_root():
    return {"status": "ok"}
 
