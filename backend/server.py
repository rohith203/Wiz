from flask import Flask, request
from flask_cors import CORS
from keras.applications.resnet50 import ResNet50
from keras.models import Sequential
from keras.layers import Dense
import matplotlib.pyplot as plt
import numpy as np
import os
from keras.applications.imagenet_utils import decode_predictions
import json

app = Flask(__name__)

CORS(app)

def get_predictions(path):
    img = np.array(plt.imread(path))

    if img.shape[0]<img.shape[1]:
        x = img.shape[0]//224
    else:
        x = img.shape[1]//224
    cropped = img[::x,::x,:3]   
    cropped = cropped[:224,:224,:]
    print(cropped)
    print(cropped.shape)
    # plt.imshow(cropped)
    # plt.show()
    pred = model.predict(cropped.reshape(1, *cropped.shape))
    # # print("prediction done")
    dec = decode_predictions(pred)
    print(f"predictions = {dec}")
    jsondict = {}
    for i in range(len(dec[0])):
        jsondict[dec[0][i][1]] = str(dec[0][i][2])

    res = json.dumps(jsondict)
    print(res)
    return res

@app.route('/', methods=['GET'])
def get_root():
    return "root page"


@app.route('/camupload_img', methods=['POST'])
def get_camimage():
    f = request.files['image']
    path = os.path.join('./saved_images', f.filename)
    f.save(path)
    
    res = get_predictions(path)
    return res

@app.route('/upload_img', methods=['POST'])
def get_image():
    # img_content = request.get_data()
    f = request.files['image']
    path = os.path.join('./saved_images', f.filename)
    f.save(path)
    
    res = get_predictions(path)
    return res


if __name__ == "__main__":
    model = Sequential()
    model.add(ResNet50(weights='./resnet50_weights_tf_dim_ordering_tf_kernels.h5',input_shape=(224, 224, 3)))
    app.run(threaded = False)   