import { observable, action, decorate } from "mobx";
import axios from 'axios';
import _ from 'lodash';
import * as d3 from 'd3';
import patients from '../data/demo';
import name2abb from '../data/infoName'
import category from '../data/category2'
import MinMax from '../data/min_max'

class Store {

    patient = patients;
    idList = Object.keys(patients)
    name2abbr = name2abb;
    admissionInfo = [];
    historyInfo = [];
    signInfo = [];
    bloodInfo = [];
    laborInfo = [];
    treatInfo = [];
    categories = category;
    minmax = MinMax;
    predictResult = [[],[]]

    selectPatient(id) {
        this.admissionInfo = this.patient[id]['Admission information'];
        this.historyInfo = this.patient[id]['History information'];
        this.signInfo = this.patient[id]['Vital signs'];
        this.bloodInfo = this.patient[id]['Arterial blood gas'];
        this.laborInfo = this.patient[id]['Laboratory'];
        this.treatInfo = this.patient[id]['Treatment information'];
    }

    prediction() {
        // this.predictResult = [[0,10,20,30,40,50,60],[1,0.9,0.8,0.7,0.6,0.5,0.5]]
        axios({
            method: 'POST',
            url: `http://127.0.0.1:5000/prediction`,
            data: {
                admit: this.admissionInfo,
                history: this.historyInfo,
                sign: this.signInfo,
                blood: this.bloodInfo,
                labor: this.laborInfo,
                treat: this.treatInfo
            }
        }).then(result => {
            this.predictResult = result.data;
        });
    }

    setAdmission(l) {
        this.admissionInfo = l;
    }

    setHistory(l) {
        this.historyInfo = l;
    }

    setSign(l) {
        this.signInfo = l;
    }

    setBlood(l) {
        this.bloodInfo = l;
    }

    setLabor(l) {
        this.laborInfo = l;
    }

    setTreat(l) {
        this.treatInfo = l;
    }

}
  
decorate(Store, {
    idList: observable,
    name2abbr: observable,
    admissionInfo: observable,
    historyInfo: observable,
    signInfo: observable,
    bloodInfo: observable,
    laborInfo: observable,
    treatInfo: observable,
    categories: observable,
    queryState: observable,
    currentState: observable,
    patients: observable,
    event_count: observable,
    histories: observable,
    minmax: observable,
    predictResult: observable,
    setAdmission: action.bound,
    setHistory: action.bound,
    setSign: action.bound,
    setBlood: action.bound,
    setLabor: action.bound,
    setTreat: action.bound,
    prediction: action.bound
});

const store = new Store();

export default store;
