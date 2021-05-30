import React, { Component } from 'react';
import draw from './vis';

import './style.css';
import store from '../../store';
import {observer} from "mobx-react";

const Heatmap = observer(class Heatmap extends Component {

    componentDidMount() {
        this.setState({
            'Vismap': draw(this.props.data.his,store.setHistory)
        })
    }
    componentDidUpdate() {
        if(this.props.data.his){
            this.state.Vismap.data(this.props.data.his).labels(this.props.data.label).layout();
        }else{
            this.state.Vismap.clear()
        }
    }

    render() {
        return (
            <div>
                <div className='vis-heatmap'></div>
            </div>
        )
    }
});

export default Heatmap;
