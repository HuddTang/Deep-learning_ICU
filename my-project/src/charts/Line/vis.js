import * as d3 from 'd3';
import VisLine from './Line'
import './style.css';
import store from '../../store';

const draw = (data) => {
    let height = 420
    let width = 420

    let svg = d3.select('#vis-line').append('svg')
        .attr('width',width)
        .attr('height',height);

    let g = svg.append("g")
    g.append('g').attr('class','line-chart')
        .attr('transform','translate(40,20)');

    let _graph = VisLine(svg)
        .data(data)
        .init();

    return _graph;
}

export default draw;