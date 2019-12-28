from keras.applications.resnet50 import ResNet50
from keras.models import Sequential
from keras.layers import Dense
import matplotlib.pyplot as plt
import numpy as np
import sys

img = np.array(plt.imread(sys.argv[1]))
print("received")

model = Sequential()
model.add(ResNet50(weights='./resnet50_weights_tf_dim_ordering_tf_kernels.h5',input_shape=(224, 224, 3)))

print("model created")

cropped = img[:224,:224,:3]

plt.imshow(cropped)
plt.show()

pred = model.predict(cropped.reshape(1, *cropped.shape))

print("prediction done")

from keras.applications.imagenet_utils import decode_predictions

print(f"predictions = {decode_predictions(pred)}")