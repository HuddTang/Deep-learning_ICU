import * as d3 from 'd3';
// import $ from '../Jquery/jquery.tipsy'
// import '../Jquery/tipsy.css';
import _ from 'lodash';
import abbr from '../../data/abbr';

let VisMap = (_svg) => {
    let _graph = new Object();

    let dispatch;
    let data;
    let labels;

    // let heightL=4;
    // let heightBar=heightL/2;
    // let widthL=50;
    let svg = _svg,
        container = svg.select('g'),
        width = svg.attr("width"),
        height = svg.attr("height");

    _graph.dispatch = (d) => {
        if(!d) return dispatch;
        dispatch = d;
        return _graph;
    };

    _graph.data = (d) => {
        if(!d) return data;
        data = d;
        return _graph;
    };

    _graph.labels = (d) => {
        if(!d) return labels;
        labels = d;
        return _graph;
    };

    _graph.clear = () =>{
        container.selectAll(".boxF").remove();
        container.selectAll(".boxT").remove();
        container.selectAll(".label").remove();
    }

    _graph.layout = () => {
        if(data.length<=0){
            return _graph
        }
        draw();

        return _graph;
    };

    let draw = () => {
        container.selectAll(".boxF").remove();
        container.selectAll(".boxT").remove();
        container.selectAll(".label").remove();
        let g = container.select('.matrix')
        g.selectAll(".boxF")
            .data(data)
            .enter()
            .append('rect')
            .attr('class','boxF')
            .attr('width',48)
            .attr('height',20)
            .attr('x',function (d,i){
                return i*48
            })
            .attr('y',0)
            .attr('stroke-width', 2)
            .attr("stroke", "#E4E4E4")
            .attr('fill', function (d){
                if(d===0){
                    return '#E2F0D9'
                }else{
                    return '#FFFFFF'
                }
            })
            .style('cursor', 'pointer')
            .on('click',function(d,i){
                let l = _.cloneDeep(data)
                l[i] = 0
                dispatch.call("change",this, l);
            });

        g.selectAll(".boxT")
            .data(data)
            .enter()
            .append('rect')
            .attr('class','boxT')
            .attr('width',48)
            .attr('height',20)
            .attr('x',function (d,i){
                return i*48
            })
            .attr('y',20)
            .attr('stroke-width', 2)
            .attr("stroke", "#E4E4E4")
            .attr('fill', function (d){
                if(d===1){
                    return '#FBE5D6'
                }else{
                    return '#FFFFFF'
                }
            })
            .style('cursor', 'pointer')
            .on('click',function(d,i){
                let l = _.cloneDeep(data)
                l[i] = 1
                dispatch.call("change",this, l);
            })

        g.selectAll(".label")
            .data(labels)
            .enter()
            .append('text')
            .attr('class','label')
            .attr('x',function (d,i){
                return i*48+24
            })
            .attr('y',40+10)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size',12)
            .text(d => abbr(d,5))
            .style('cursor', 'Default');

        return _graph;
    }

    let calMean = (a) =>{
        return a.reduce((acc, val) => acc + val, 0) / a.length;
    };

    let distance = (a,b,weights) =>{
        let dis = 0
        for(let i=0;i<a.length;i++){
            dis += Math.pow(a[i]-b[i],2)*weights[i]*weights[i]*4
        }
        dis = Math.sqrt(dis)
        return dis
    }

    let pathDistance = (point,a,nodes_number) =>{
        // console.log(a)
        let sum = 0;
        for(let i=0; i<a.length-1; i++){
            sum += distance(point[a[i]].nameList,point[a[i+1]].nameList,nodes_number)
        }
        return sum
    };

    return _graph;
}

export default VisMap;