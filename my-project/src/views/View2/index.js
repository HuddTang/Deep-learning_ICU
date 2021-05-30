import React, { Component } from 'react';
import './view2.css';
import Curve from "../View2/curve";


export default class View2 extends Component {
    render() {
        return (
            <div id='results'>
                <div className='header'>
                    <div id={"survival"}>Survival</div>

                </div>
                <div className='pane' style={{height: 450}}>
                    <Curve></Curve>
                </div>

            </div>
        )
    }
}