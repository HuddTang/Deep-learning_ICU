from flask import Flask, request
import json
import survival_LCCS
from flask_cors import CORS
import sys
sys.path.append("./algorithm/")

app = Flask(__name__)
CORS(app)

@app.route('/prediction',methods=['POST'])
def _predict():
    admit = request.json['admit']
    history = request.json['history']
    sign = request.json['sign']
    blood = request.json['blood']
    labor = request.json['labor']
    treat = request.json['treat']
    print(len(admit))
    print(len(history))
    print(len(sign))
    print(len(blood))
    print(len(labor))
    print(len(treat))
    min_max = json.load(open('./min_max.json'))
    Min = min_max[0]
    Max = min_max[1]
    patients = [[]]

    na = 'patient_inf'
    for i in range(len(admit)):
        patients[0].append((float(admit[i])-Min[na][i])/(Max[na][i]-Min[na][i]))
    na = 'history'
    for i in range(len(history)):
        patients[0].append((float(history[i])-Min[na][i])/(Max[na][i]-Min[na][i]))
    na = 'signs'
    for i in range(len(sign)):
        patients[0].append((float(sign[i])-Min[na][i])/(Max[na][i]-Min[na][i]))
    na = 'signs'
    for i in range(len(blood)):
        patients[0].append((float(blood[i])-Min[na][i+7])/(Max[na][i+7]-Min[na][i+7]))
    na = 'laboratory'
    for i in range(len(labor)):
        patients[0].append((float(labor[i]) - Min[na][i]) / (Max[na][i] - Min[na][i]))
    na = 'Treatment'
    for i in range(len(treat)):
        patients[0].append((float(treat[i]) - Min[na][i]) / (Max[na][i] - Min[na][i]))

    results = survival_LCCS.cur(patients)
    print(results[0])
    print(type(results))
    print(type(results[0]))
    print(type(results[1]))
    return json.dumps(results)
    
if __name__ == '__main__':
    app.run(debug=True)


