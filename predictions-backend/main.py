from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from typing import List
import torch 
from PIL import ImageTk, Image
from pydantic import BaseModel

# Deps for custom model
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import tensorflow as tf
import os

# Available pipelines from Hugging Face
# sentiment = pipeline("sentiment-analysis")
# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
# tagger = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
# image_clasifier = pipeline(model="microsoft/beit-base-patch16-224-pt22k-ft22k")
image_clasifier = pipeline(model="google/vit-base-patch16-224")

# Models for possible payloads sent to endpoints
class TextItem(BaseModel):
    text: str

class PostItem(BaseModel):
    img_url: str

# Necessary config stuff - create fast api app instance + classifier model 
app = FastAPI()
cat_classifier_model = load_model('models/isCatOnHeadClassifier.h5')

# CORS stuff
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

@app.post('/ai/is-on-head')
def classify_cat_image(user_post: PostItem):
    return image_clasifier(images=user_post.img_url)
 
def custom_cat_classifer(img_url):
    img = cv2.imread('/content/drive/MyDrive/data/notSleepingOnHead/gunt.png')
    resize = tf.image.resize(img, (256,256))
    pred = cat_classifier_model.predict(np.expand_dims(resize/255, 0))

    if pred > 0.5:
        return 'We think the cat is on it\'s head'
    else:
        return 'We think the cat is NOT on it\'s head'

# @app.post("/ai/summarize")
# def get_summary(textItem: TextItem):
#     return summarizer(textItem.text);

# @app.post("/ai/sentiment")
# def get_sentiment(textItem: TextItem):
#     return sentiment(textItem.text)
               
# @app.get("/ai/sentiment")
# def get_sentiment(textItem: TextItem):
#     return sentiment(textItem.text)

# @app.get("/healthcheck")
# def read_root():
#     return {"status": "ok"}
