import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Input, Select} from 'antd';

import store from '../../store';
const { Option } = Select;

const fileMap = {
    "F":"female",
    "M":"male"
}
const Treatment = observer(class Treatment extends Component {
    render() {
        let Data = store.treatInfo;
        function handleChange1(value) {
            let l = store.treatInfo
            l[0] = value
            store.setTreat(l)
        }
        function handleChange2(value) {
            let l = store.treatInfo
            l[1] = value
            store.setTreat(l)
        }
        function handleChange3(value) {
            let l = store.treatInfo
            if(value.target.value==="[object bject]"){
                l[2] = ''
                store.setTreat(l)
            }else{
                l[2] = value.target.value
                store.setTreat(l)
            }
        }
        function handleChange4(value) {
            let l = store.treatInfo
            if(value.target.value==="[object bject]"){
                l[3] = ''
                store.setTreat(l)
            }else{
                l[3] = value.target.value
                store.setTreat(l)
            }
        }
        return (
            <div id='treatment' style={{height:75}}>
                <div style={{width:105, height: 75}}>
                    <div className={'title'} style={{margin:15}}>Treatment Information</div>
                </div>
                <div>
                    <div className={"infoContainer"} style={{width:540, height: 30}}>
                        <div className={"infoItem"}>
                            <div className={'label'}>Mechanical ventilate</div>
                            <div>
                                <Select className={"infoSelect"} value={Data[0]}  onChange={handleChange1}>
                                    <Option value="0">0</Option>
                                    <Option value="1">1</Option>
                                </Select>
                            </div>
                        </div>
                        <div className={"infoItem"}>
                            <div className={'label'}>Ventilate</div>
                            <div>
                                <Select className={"infoSelect"} value={Data[1]} onChange={handleChange2}>
                                    <Option value="0">0</Option>
                                    <Option value="1">1</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className={"infoContainer"} style={{width:540, height:30}}>
                        <div className={"infoItem"}>
                            <div className={'label'}>Dopamine</div>
                            <div>
                                <Input value={Data[2]} className={"infoInput"} onChange={handleChange3}/>
                            </div>
                        </div>
                        <div className={"infoItem"}>
                            <div className={'label'}>Epinephrine</div>
                            <div>
                                <Input value={Data[3]} className={"infoInput"} onChange={handleChange4}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default Treatment;