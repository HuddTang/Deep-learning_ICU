import React, { Component } from 'react';
import {observer} from 'mobx-react';
import {Input, Select} from 'antd';
import store from '../../store';
const { Option } = Select;

const fileMap = {
    "F":"female",
    "M":"male"
}
const Basic = observer(class Basic extends Component {

    render() {
        let Data = store.admissionInfo
        function handleChange1(value) {
            let l = store.admissionInfo
            if(value.target.value==="[object bject]"){
                l[0] = ''
                store.setAdmission(l)
            }else{
                l[0] = value.target.value
                store.setAdmission(l)
            }
        }
        function handleChange2(value) {
            let l = store.admissionInfo
            l[1] = value
            store.setAdmission(l)
        }
        function handleChange3(value) {
            let l = store.admissionInfo
            l[2] = value
            store.setAdmission(l)
        }
        function handleChange4(value) {
            let l = store.admissionInfo
            if(value.target.value==="[object bject]"){
                l[3] = ''
                store.setAdmission(l)
            }else{
                l[3] = value.target.value
                store.setAdmission(l)
            }
        }
        return (
            <div id='basic' style={{width:645, height: 75}}>
                <div style={{width:105, height: 75}}>
                    <div className={'title'} style={{margin:15}}>Admission Information</div>
                </div>
               <div>
                    <div className={"infoContainer"} style={{width:540, height: 30}}>
                        <div className={"infoItem"}>
                            <div className={'label'}>Age</div>
                            <div>
                                <Input onChange={handleChange1} className={"infoInput"} value={Data[0]}/>
                            </div>
                        </div>
                        <div className={"infoItem"}>
                            <div className={'label'}>Emergency</div>
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
                            <div className={'label'}>First admission</div>
                            <div>
                                <Select className={"infoSelect"} value={Data[2]}  onChange={handleChange3}>
                                    <Option value="0">0</Option>
                                    <Option value="1">1</Option>
                                </Select>
                            </div>
                        </div>
                        <div className={"infoItem"}>
                            <div className={'label'}>LOS before ICU</div>
                            <div>
                                <Input  onChange={handleChange4} value={Data[3]} className={"infoInput"}/>
                            </div>
                        </div>
                    </div>
                </div>
                {/*{*/}
                {/*    store.patients.map((patient, index) => {*/}
                {/*        return <Row key={"patient-"+index} className="patient-row">*/}
                {/*            <Col span={12} >*/}
                {/*                <div className="patient-img" style={{"backgroundImage":`url(${require(`../../assets/face/${fileMap[patient.gender]}/${Math.floor(Math.random() * 87)}.jpg`)})`}}>*/}
                {/*                    <div className="patient-info">*/}
                {/*                        <label>Age: {patient.age}</label>*/}
                {/*                        <label>Survival: {patient.isHeal.toString()==="1"?"yes":"no"}</label>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </Col>*/}
                {/*            <Col span={12}>*/}
                {/*                <PatientSeq data={{id:index, seq:Array.from(new Set(patient.marks))}}></PatientSeq>*/}
                {/*            </Col>*/}
                {/*        </Row>*/}
                {/*    })*/}
                {/*}*/}
            </div>
        )
    }
});

export default Basic;