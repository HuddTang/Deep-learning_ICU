import lime
import lime.lime_tabular
import numpy as np
import json
from survival_LCCS import snn
import csv

category = json.load(open('./category.json'))

f_name = []
for key,value in category.items():
    for v in value:
        f_name.append(v)
print(f_name)
L = len(f_name)

with open('./patient_train.npy','rb') as f:
    data = np.load(f)
    data = data[:,1:]

with open('./label_train.npy','rb') as f:
    D = np.load(f)
    e = D[:,0]
    t = D[:,1]

with open('./patient_test.npy','rb') as f:
    data_test = np.load(f)
    data_test = data_test[:,1:]

with open('./label_test.npy','rb') as f:
    D_test = np.load(f)
    e_test = D_test[:,0]
    t_test = D_test[:,1]

with open('./cut.json','r') as f:
    cut = json.load(f)

model = snn(len(data_test[0]),[12,30,39,27,12],[64,32,16],1, optimizer='adam')
model.load_split(cut)
print('split_input_success')
model.load_model()

explainer = lime.lime_tabular.LimeTabularExplainer(data, feature_names=f_name, class_names=['surrival'],  verbose=True, mode='regression')

headers = []
results = []

for i in range(500):
    exp = explainer.explain_instance(data_test[i,:], model.predict,num_features=L)
    re = exp.as_list()
    if i == 0:
        headers = [x[0] for x in re]
    results.append([x[1] for x in re])
with open('lime.csv','w',newline='') as f:
    f_csv = csv.writer(f)
    f_csv.writerow(headers)
    f_csv.writerows(results)