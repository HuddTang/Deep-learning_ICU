import numpy as np
from sklearn.preprocessing import normalize
import pandas as pd
import json
import copy

df = pd.read_csv("./Download/demo.csv",encoding='utf-8')
#print(df)
print(df.info())
label = df[['hos_mort','time']].values
# print(len(label))

category = json.load(open('./category2.json'))

data = {}
for key,value in category.items():
    X = df[value].values
    data[key] = X
print(data)
id_list = df[['icustay_id']].values.tolist()
print(id_list)

patient = {}
for i in range(len(id_list)):
    temp = {}
    for key, value in data.items():
        V = value.tolist()
        temp[key] = V[i]
    patient[str(id_list[i][0])] = copy.deepcopy(temp)

print(patient)

with open('demo.json', 'w') as f:
    json.dump(patient,f)