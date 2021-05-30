import React, { Component } from 'react';
import draw from './vis';

import './style.css';
import store from '../../store';
import {observer} from "mobx-react";

const Bar = observer(class Bar extends Component {

    componentDidMount() {
        this.setState({
            'Visbar': draw(this.props.data.sign, this.props.data.name,this.props.data.width)
        })
    }
    componentDidUpdate() {
        if(this.props.data.sign){
            this.state.Visbar.data(this.props.data.sign).width(this.props.data.width).layout();
        }else{
            this.state.Visbar.clear()
        }
    }

    render() {
        let na = this.props.data.name
        return (
            <div>
                {
                    <div id={'vis-bar-'+ na} ></div>
                    }
            </div>
        )
    }
});

export default Bar;
