import React, { Component } from 'react';
import './view1.css';

import { Select } from 'antd';

import {observer} from 'mobx-react';
import Basic from '../View1/basic';
import History from "../View1/history";
import Sign from "../View1/sign";
import Treatment from "../View1/treatment";
import store from '../../store';

const {OptGroup, Option } = Select;

const View1 = observer(class View1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentIndex:1,
        };
    };

    render() {
        let _this=this;
        let sizes = [ "X-Small", "Small", "Medium", "Large", "X-Large", "2X-Large" ];
        function handleChange(value) {
            store.selectPatient(value);
        }
        function handleClick(value) {
            store.prediction();
        }
        return (
            <div id='attribute'>
                <div className='header'>
                    <div id={"patientID"}>Patient ID:</div>
                    <div id={"idSelect"} style={{ width: 100, height:21 }}>
                        <Select style={{width:90, height:21}}  onSelect={handleChange}>
                            <Option value="262645" title="262645">262645</Option>
                            <Option value="270461" title={"270461"}>270461</Option>
                            <Option value="201876" title={"201876"}>201876</Option>
                            <Option value="264904" title={"264904"}>264904</Option>
                            <Option value="296071" title={"296071"}>296071</Option>
                            <Option value="252542" title={"252542"}>252542</Option>
                            <Option value="200172" title={"200172"}>200172</Option>
                            <Option value="209841" title={"209841"}>209841</Option>
                        </Select>
                    </div>
                    <div id={"predict"}>
                        <button onClick={handleClick}>Predict</button>
                    </div>
                </div>
                <div className='pane' style={{height: 450}}>
                    <div style={{width:645}}>
                        <Basic></Basic>
                    </div>
                    <div style={{width:645}}>
                        <History></History>
                    </div>
                    <div className={'signContainer'} style={{width:645}}>
                        <div style={{width:197}}>
                            <Sign name={'signs'}></Sign>
                        </div>
                        <div style={{width:171}}>
                            <Sign name={'blood'}></Sign>
                        </div>
                        <div style={{width:249}}>
                            <Sign name={'labor'}></Sign>
                        </div>
                    </div>
                    <div style={{width:645}}>
                        <Treatment></Treatment>
                    </div>
                </div>

            </div>
        )
    }
});

export default View1;
