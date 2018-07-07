#coding:utf-8
import random
import os
from os import listdir

emotion_array = ["angry", "sad", "happy", "neutral", "surprise", "disgust", "fear"]
def random_text_emotion():
    # randomly generate text and emotion
    text_array = []
    with open("./data/text.txt") as file:
        for line in file:
            text_array.append(line.strip().split()[1])
    rand_text = text_array[random.randint(0, len(text_array) - 1)]
    rand_emotion = emotion_array[random.randint(0, len(emotion_array) - 1)]
    return {"text": rand_text.decode('gb2312'), "emotion": rand_emotion}

def random_audio_emotion():
    # randomly get audio
    file_array = os.listdir("./data/user_audio")
    rand_filename = file_array[random.randint(0, len(file_array) - 1)]
    # tmp, file_extension = os.path.splitext(rand_filename)
    text, emotion, date = rand_filename.split('_')
    return text, emotion, rand_filename

if __name__ == "__main__":
    print(random_text_emotion())
    print(random_audio_emotion())