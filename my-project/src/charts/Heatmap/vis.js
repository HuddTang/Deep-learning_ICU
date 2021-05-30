import * as d3 from 'd3';
import VisMap from './Heatmap'
import './style.css';
// import store from '../../store';

const draw = (data,setHistory) => {

    const margin = {top: 8, right: 15, bottom: 8, left: 15};
    const width = 500;
    const height = 60;

    let svg = d3.select('.vis-heatmap').append('svg')
        .attr('width',width)
        .attr('height',height);

    let g = svg.append("g")
    g.append('g').attr('class','matrix');

    let dispatch = d3.dispatch("change");

    dispatch.on("change", l => {
        setHistory(l);
    });

    let _graph = VisMap(svg)
        .dispatch(dispatch)
        .data(data)


    return _graph;
}

export default draw;