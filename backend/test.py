from keras.applications.resnet50 import ResNet50
from keras.models import Sequential
from keras.layers import Dense
import matplotlib.pyplot as plt
import numpy as np
import sys
import json

img = np.array(plt.imread(sys.argv[1]))
# print("received")

model = Sequential()
model.add(ResNet50(weights='./resnet50_weights_tf_dim_ordering_tf_kernels.h5',input_shape=(224, 224, 3)))

# print("model created")

if img.shape[0]<img.shape[1]:
    x = img.shape[0]//224
else:
    x = img.shape[1]//224
cropped = img[::x,::x,:3]   
cropped = cropped[:224,:224,:]

# plt.imshow(cropped)
# plt.show()

pred = model.predict(cropped.reshape(1, *cropped.shape))

# print("prediction done")

from keras.applications.imagenet_utils import decode_predictions

dec = decode_predictions(pred)
# print(f"predictions = {dec}")
jsondict = {}
for i in range(len(dec[0])):
    jsondict[dec[0][i][1]] = str(dec[0][i][2])

print(json.dumps(jsondict))
# print(jsondict)
sys.exit(0)