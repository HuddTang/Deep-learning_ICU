import * as d3 from 'd3';
import _ from 'lodash';
import abbr from "../../data/abbr";

let VisLine = (_svg) => {
    let _graph = new Object()


    let svg = _svg,
        container = svg.select('g'),
        width =svg.attr("width"),
        height = svg.attr("height");

    let size = [width, height];
    let data = []


    _graph.data = function(_) {
        if (!arguments.length) return data;
        data = _;
        return _graph;
    }

    let canvas_all
    let canvas
    let graph = []
    let line
    let x_scale
    let y_scale
    let x_time
    let xAxis
    let yAxis

    _graph.init = function() {
        container
            .attr('width', size[0])
            .attr('height', size[1])
        container.selectAll().remove();

        canvas_all = container.select('.line-chart')

        canvas_all.append('text')
            .attr('x',135)
            .attr('y', -9)
            .attr('font-size',12)
            .text('The probability of survival at 30 days is:')

        canvas_all.append('text')
            .attr('x',0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr("transform","translate(-28,185) rotate(-90)")
            .attr('font-size',12)
            .text('Cumulative survival')

        canvas_all.append('text')
            .attr('x',188)
            .attr('y', 392)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size',12)
            .text('Time (hours)')

        canvas = canvas_all.append('g')
            .attr("transform","translate(15,12)")

        x_scale = d3.scaleLinear().range([0, 346]).domain([0,1000])
        x_time = d3.scaleLinear().range([0, 346]).domain([0,1000])
        y_scale = d3.scaleLinear().range([346, 0]).domain([0,1])
        xAxis = d3.axisBottom(x_time).ticks(12)
        yAxis = d3.axisLeft(y_scale)

        canvas.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0,346)")
            .call(xAxis);

        canvas.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        return _graph
    }

    _graph.layout = function() {
        graph = []
        // for(let i=0; i<data[0].length-12; i++){
        //     graph.push({x: data[0][i], y:data[1][i]})
        // }
        for(let i=0; i<3974; i++){
            graph.push({x: data[0][i], y:data[1][i]})
        }
        line = d3.line()
            .x((d)=> x_scale(d.x))
            .y((d)=> y_scale(d.y))
            .curve(d3.curveMonotoneX)

        return _graph
    }

    _graph.update = function() {

        canvas.selectAll(".curve_line").remove()
        canvas.selectAll(".dayValue").remove()

        if(data[0].length>0){
            canvas
                .append("text")
                .attr('x',333)
                .attr('y', -20)
                .attr('font-size',12)
                .attr("class","dayValue")
                .text(Math.round(data[1][3685]*1000)/10+'%')
        }


        canvas
            .append("path")
            .attr("class","curve_line")
            .attr("fill-opacity",0)
            .attr('stroke','orange')
            .attr('stroke-width', 2)
            .attr('d', line(graph))

        return _graph
    }

    return _graph;
}

export default VisLine;