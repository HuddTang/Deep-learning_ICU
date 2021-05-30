import React, { Component } from 'react';
import {observer} from 'mobx-react';
import './view2.css';
import store from '../../store';
import Line from '../../charts/Line';


const Curve = observer(class Curve extends Component {
    render() {
        let values = store.predictResult;
        return (
            <div id='lineChart'>
                <Line data={{values:values}}></Line>
            </div>
        )
    }
});

export default Curve;