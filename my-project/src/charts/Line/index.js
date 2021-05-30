import React, { Component } from 'react';
import draw from './vis';

import './style.css';
import store from '../../store';
import {observer} from "mobx-react";

const Bar = observer(class Bar extends Component {

    componentDidMount() {
        this.setState({
            'VisLine': draw(this.props.data.values)
        })
    }
    componentDidUpdate() {
        if(this.props.data.values){
            this.state.VisLine.data(this.props.data.values).layout().update();
        }else{
            this.state.VisLine.clear()
        }
    }

    render() {
        return (
            <div>
                {
                    <div id={'vis-line'} ></div>
                    }
            </div>
        )
    }
});

export default Bar;
