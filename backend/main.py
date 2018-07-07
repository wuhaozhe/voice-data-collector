#coding:utf-8
from flask import Flask, request, send_file
import sys
import json
import random_get
from datetime import datetime
import os

reload(sys)
sys.setdefaultencoding('utf8')
SUCCESS_RESPONSE = {'status': 'SUCCESS'}
FAIL_RESPONSE = {'status': 'FAIL'}
app = Flask(__name__)

@app.route('/datagen', methods = ['GET'])
def data_gen():
    # randomly generate text and its emotion
    return json.dumps(random_get.random_text_emotion())

@app.route('/upload_audio', methods = ['POST'])
def upload_audio():
    try:
        file = request.files['audio']
    except Exception:
        file = None
    if file != None:
        text = request.form['text']
        emotion = request.form['emotion']
        date_str = datetime.now().strftime('%Y%m%d%H%M%S')
        origin_file_name, file_extension = os.path.splitext(file.filename)
        file_name = text + "_" + emotion + "_" + date_str + file_extension
        file.save('./data/user_audio/' + file_name)
        return json.dumps(SUCCESS_RESPONSE)
    return json.dumps(FAIL_RESPONSE)

@app.route('/get_rand_audio', methods = ['GET'])
def get_rand_audio():
    text, emotion, filename = random_get.random_audio_emotion()
    return json.dumps({'text': text, 'emotion': emotion, 'filename': filename})

@app.route('/download_audio', methods = ['GET'])
def download_audio():
    filename = request.args.get('filename')
    response = send_file("./data/user_audio/" + filename)
    print(response)
    if response != None:
        return response
    else:
        return json.dumps(FAIL_RESPONSE)

@app.route('/user_feedback', methods = ['POST'])
def user_feedback():
    text = request.form['text']
    emotion = request.form['emotion']
    filename = request.form['filename']
    json_array = json.load(open("./data/record.json"))
    json_array.append({'text': text, 'emotion': emotion, 'filename': filename})
    json.dump(json_array, open("./data/record.json", 'w'))
    return json.dumps(SUCCESS_RESPONSE)

if __name__ == "__main__":
    app.run()