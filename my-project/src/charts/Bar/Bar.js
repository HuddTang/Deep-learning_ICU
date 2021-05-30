import * as d3 from 'd3';
import _ from 'lodash';

let VisBar = (_svg) => {
    let _graph = new Object();

    let dispatch;
    let data;
    let Max;
    let width;

    let na;

    const na2color = {"signs": "#D6DCE5", "blood": "#FFF2CC", "labor":"#DDD1E6"};

    // let heightL=4;
    // let heightBar=heightL/2;
    // let widthL=50;
    let svg = _svg,
        container = svg.select('g'),
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

    _graph.Max = (d) => {
        if(!d) return Max;
        Max = d;
        return _graph;
    };

    _graph.width = (d) => {
        width = d;
        svg.attr('width',width);
        return _graph;
    };

    _graph.na = (d) => {
        na = d;
        return _graph;
    };


    _graph.clear = () =>{
        container.selectAll(".ba").remove();
        // container.selectAll(".flow-line")
        //     .transition()
        //     .duration(200)
        //     .style('opacity', 0);
        // container.selectAll('.flow-node')
        //     .transition()
        //     .duration(200)
        //     .style('opacity', 0);
        // container.select('defs').remove();
        // container.select('.seq-flow').selectAll('#vis-g').remove()
    }

    let dataUsed = []

    _graph.IsPInt = (str) => { return /^[1-9]+[0-9]*$/.test(str); };//正整数
    _graph.IsNInt = (str) => { return /^-[1-9]+[0-9]*$/.test(str); };//负整数
    _graph.IsPDec = (str) => { return /^[1-9]+[0-9]*\.[0-9]+$/.test(str) || /^0\.[0-9]+$/.test(str); }//正小数
    _graph.IsNDec = (str) => { return /^-[1-9]+[0-9]*\.[0-9]+$/.test(str) || /^-0\.[0-9]+$/.test(str); }//负小数
    _graph.IsNum = (str) => {//合法数字
        return str && (str === "0" || _graph.IsPInt(str) || _graph.IsNInt(str) || _graph.IsPDec(str) || _graph.IsNDec(str));
    };

    _graph.layout = () => {
        if(data.length<=0){
            return _graph
        }
        let flag = 1
        for(let i=0; i<data.length; i++){
            if((typeof(data[i])==='number')||((typeof(data[i])==='string')&&(_graph.IsNum(data[i])))){
                data[i] = Number(data[i])
            }else{
                flag=0
                break
            }
        }
        if(flag===1){
            dataUsed = []
            for(let i=0; i<data.length; i++){
                dataUsed.push(data[i]*1.0/Max[i])
            }
            draw();
        }

        return _graph;
    };

    let draw = () => {
        container.selectAll(".ba").remove();
        let g = container.select('.bar-chart')
        g.selectAll(".ba")
            .data(dataUsed)
            .enter()
            .append('rect')
            .attr('class','ba')
            .attr('width',26)
            .attr('height',function(d,i){
                return 130*d
            })
            .attr('x',function (d,i){
                return i*26
            })
            .attr('y',function (d){
                return 130-130*d
            })
            .attr('stroke-width', 2)
            .attr("stroke", "#E4E4E4")
            .attr('fill', na2color[na]);

        return _graph;
    }

    return _graph;
}

export default VisBar;