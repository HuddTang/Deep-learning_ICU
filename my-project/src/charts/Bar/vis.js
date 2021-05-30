import * as d3 from 'd3';
import VisBar from './Bar'
import './style.css';
import store from '../../store';

const draw = (data, name, width) => {
    let height = 130
    let Max = store.minmax[1][name]

    let svg = d3.select('#vis-bar-'+name).append('svg')
        .attr('width',width)
        .attr('height',height);

    let g = svg.append("g")
    g.append('g').attr('class','bar-chart');

    let _graph = VisBar(svg)
        .data(data)
        .width(width)
        .Max(Max)
        .na(name);

    return _graph;
}

export default draw;