import numpy as np
from sklearn.preprocessing import normalize
import pandas as pd
import json

df = pd.read_csv("./Download/B_300fromtotal_DL_LIME.csv",encoding='utf-8')
#print(df)
print(df.info())
label = df[['hos_mort','time']].values
# print(len(label))

category = json.load(open('./category.json'))
print(category)
min_max_dict = json.load(open('./min_max.json'))
min_dict, max_dict = min_max_dict

data = {}
for key,value in category.items():
    X = df[value].values
    min_list = np.array(min_dict[key])
    max_list = np.array(max_dict[key])
    data[key] = (X-min_list)/(max_list-min_list)
print(data)

patients = df[['icustay_id']].values
print(patients)

cut = [0]

for key,value in data.items():
    cut.append(value.shape[1]+cut[-1])
    patients = np.concatenate((patients,value),axis=1)


with open('patient_lime.npy', 'wb') as f:
    np.save(f,patients)
with open('label_lime.npy', 'wb') as f:
    np.save(f,label)
# with open('cut.json','w') as f:
#     json.dump(cut,f)