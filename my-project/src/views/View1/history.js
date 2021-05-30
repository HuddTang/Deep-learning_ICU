import React, { Component } from 'react';
import {observer} from 'mobx-react';
import { Row, Col } from 'antd';
// import './PatientList.css';
import store from '../../store';
import Heatmap from '../../charts/Heatmap';

const History = observer(class History extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        let his = store.historyInfo;
        let label = store.categories["History information"].map(s => {return store.name2abbr[s]})
        return (
            <div id='history' style={{height: 75}}>
                <div style={{width:105, height: 75}}>
                    <div className={'title'} style={{margin:15}}>History Information</div>
                </div>
                <div id={'heatmap'}>
                    <Heatmap data={{his:store.historyInfo,label:label}}></Heatmap>
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

export default History;