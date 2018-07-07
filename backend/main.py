#coding:utf-8
from flask import Flask, request, send_file
import json
import random_get
from datetime import datetime
import os

SUCCESS_RESPONSE = {'status': 'SUCCESS'}
FAIL_RESPONSE = {'status': 'FAIL'}
app = Flask(__name__)

@app.route('/datagen', methods = ['GET'])
def data_gen():
    # randomly generate text and its emotion
    return json.dumps(random_get.random_text_emotion()).encode('utf8')

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

@app.route('/download_audio', methods = ['GET'])
def download_audio():
    text, emotion, filename, origin_file_name = random_get.random_audio_emotion()
    response = send_file(filename, as_attachment=True, attachment_filename = origin_file_name.encode('utf-8').decode('latin-1'))
    response.headers['text'] = text.encode('utf-8').decode('latin-1')
    response.headers['emotion'] = emotion.encode('utf-8').decode('latin-1')
    return response

@app.route('/user_feedback', methods = ['POST'])
def user_feedback():
    text = request.form['text']
    emotion = request.form['emotion']
    filename = request.form['filename']
    json_array = json.load(open("./data/record.json", encoding="utf-8"))
    json_array.append({'text': text, 'emotion': emotion, 'filename': filename})
    json.dump(json_array, open("./data/record.json", 'w', encoding="utf-8"))
    return json.dumps(SUCCESS_RESPONSE)

if __name__ == "__main__":
    app.run(
        host = '0.0.0.0',
        port = 8001,  
        debug = True )