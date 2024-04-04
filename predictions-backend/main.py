from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from typing import List
import torch 
from PIL import ImageTk, Image
from pydantic import BaseModel

# sentiment = pipeline("sentiment-analysis")
# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
# tagger = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
# image_clasifier = pipeline(model="microsoft/beit-base-patch16-224-pt22k-ft22k")
image_clasifier = pipeline(model="google/vit-base-patch16-224")

class TextItem(BaseModel):
    text: str

class PostItem(BaseModel):
    img_url: str
        
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
def hello_world():
    return {"Hello": "World"}
 
# @app.post("/ai/summarize")
# def get_summary(textItem: TextItem):
#     return summarizer(textItem.text);

# @app.post("/ai/sentiment")
# def get_sentiment(textItem: TextItem):
#     return sentiment(textItem.text)

@app.post('/ai/is-on-head')
def classify_cat_image(user_post: PostItem):
    return image_clasifier(images=user_post.img_url)
                     
# @app.get("/ai/sentiment")
# def get_sentiment(textItem: TextItem):
#     return sentiment(textItem.text)

# @app.get("/healthcheck")
# def read_root():
#     return {"status": "ok"}
 
