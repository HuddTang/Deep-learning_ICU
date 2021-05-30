import React, { Component } from 'react';
import { Layout } from 'antd';
import View1 from './views/View1';
import View2 from './views/View2';

import './dashboard.css';

const { Sider, Content } = Layout;

export default class Dashboard extends Component {
    render() {
        return (
            <div>
                <Layout style={{ width: 1100, height: 500 }}>
                    <Sider width={650} style={{backgroundColor:'#fff'}}>
                        <Content>
                            <View1/>
                        </Content>
                    </Sider>
                    <Layout width={450} style={{backgroundColor:'#fff'}}>
                        <Content>
                            <View2/>
                        </Content>
                    </Layout>
                </Layout>
            </div>
            // <div className="App">
            //     Dashboard
            // </div>
        )
    }
}
