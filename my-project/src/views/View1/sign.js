import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { Row, Col } from 'antd';
// import './PatientList.css';
import store from '../../store';
import abbr from '../../data/abbr';
import {Input} from 'antd';
import _ from 'lodash';
import Bar from '../../charts/Bar';

const fileMap = {
    "F":"female",
    "M":"male"
}
const Sign = observer(class Sign extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    };

    render() {
        const name2actual = {
            "signs": "Vital signs",
            "blood": "Arterial blood gas",
            "labor": "Laboratory"
        }
        let {name} = this.props;
        let Max = store.minmax[1][name]
        Max = Max.map(d => {
            if(d===40000){
                return '4e+4'
            }else{
                return d
            }
        })
        let Min = store.minmax[0][name]
        let nameList = store.categories[name2actual[name]].map(s => {return store.name2abbr[s]})
        let values = []
        let width = 0
        if(name==='signs'){
            width = store.signInfo.length*26
        }else if(name==='blood'){
            width = store.bloodInfo.length*26
        }else if(name==='labor'){
            width = store.laborInfo.length*26
        }
        if(name==='signs'){
            values = store.signInfo
        }else if(name==='blood'){
            values = store.bloodInfo
        }else if(name==='labor'){
            values = store.laborInfo
        }
        function handleChange(value) {
            let v = value.target.attributes[1].nodeValue
            let iid = v.split('_')[2]
            let na = v.split('_')[1]
            let id = parseInt(iid)
            console.log(iid)
            let l = _.cloneDeep(values)
            if(value.target.value==="[object bject]"){
                l[id] = ''
                if(na==='signs'){
                    store.setSign(l)
                }else if(na==='blood'){
                    store.setBlood(l)
                }else{
                    store.setLabor(l)
                }
            }else{
                l[id] = value.target.value
                if(na==='signs'){
                    store.setSign(l)
                }else if(na==='blood'){
                    store.setBlood(l)
                }else{
                    store.setLabor(l)
                }
            }
        }

        return (
            <div className='sign' style={{height: 210}}>
                <div style={{height: 20, display:'flex'}}>
                    {
                        Max.map(function(d){return <div className='number'>{d}</div>})
                    }
                </div>
                <div style={{height: 2, display:'flex'}}>
                    {
                        Max.map(function(d){return <div className='cutLine'></div>})
                    }
                </div>
                <div style={{height: 130}}>
                    <Bar data={{sign:values,name:name, width:width}}></Bar>
                </div>
                <div style={{height: 2, display:'flex'}}>
                    {
                        Max.map(function (d){return <div className='cutLine'></div>})
                    }
                </div>
                <div style={{height: 10}}>
                </div>
                <div style={{height: 20, display:'flex'}}>
                    {
                        values.map(function(d,i){return <Input className='inpt' id={'inp_'+name+'_'+i} onChange={handleChange} value={d} />})
                    }
                </div>
                <div style={{height: 20, display:'flex'}}>
                    {
                        nameList.map(function(d){return <div className='signLabel'>{abbr(d,4)}</div>})
                    }
                </div>
            </div>
        )
    }
});

export default Sign;