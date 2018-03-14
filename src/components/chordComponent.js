import {Component} from "react";
import {chordMatrix} from "../utils/matrixFactory";
import d3 from "d3";
import $ from "jquery";

export class ChordComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      params: {
        chordFactory : new chordMatrix(),
        size : null,
        marg : null,
        dims : null,
        colors: null,
        chord: null,
        matrix: null,
        innerRadius: null,
        arc: null,
        path: null,
        svg: null,
        container: null,
        messages: null,
        groupLabels: null
      }
    };

    this.drawChords = this.drawChords.bind(this);
    this.resize     = this.resize.bind(this);
  }

  modifyChords = (data, groupLabels) => {
    let state = this.state.params;
    let groups = state.container.selectAll("g.group")
    
    groups.select("text").text((d) => {
      if(!groupLabels.includes(d._id)) {
        return d._id;
      }
      else {
        return '';
      }
    });
  }

  drawChords = (data, groupLabels ) => {
    let state = this.state.params;
    state.messages.attr("opacity", 1);
    state.messages.transition().duration(1000).attr("opacity", 0);

    state.matrix.data(data)
    .resetKeys()
    .addKeys(['taxonomyName']).addKeys(['keywordName'])
    .update()

    let groups = state.container.selectAll("g.group")
      .data(state.matrix.groups(), ((d) => { return d._id; }));

    let gEnter = groups.enter()
      .append("g")
      .attr("class", "group");

    gEnter.append("path")
      .style("pointer-events", "none")
      .style("fill", ((d) => { return state.colors(d._id); }))
      .attr("d", state.arc);

    gEnter.append("text")
      .attr("dy", ".15em")
      .on("click", function (ele) {
        groupClick(ele);
      })
      .on("mouseover", function (ele) {
        dimChords(ele);
      })
      .on("mouseout", function (ele) {
        resetChords(ele);
      })
      .text((d) => {
        return d._id ;
      });

    groups.select("path")
      .transition().duration(2000)
      .attrTween("d", state.matrix.groupTween(state.arc));

    groups.select("text")
      .transition()
      .duration(2000)
      .attr("transform", ((d) => {
        d.angle = (d.startAngle + d.endAngle) / 2;
        let r = "rotate(" + (d.angle * 180 / Math.PI - 90) + ")";
        let t = " translate(" + (state.innerRadius + 26) + ")";
        return r + t + (d.angle > Math.PI ? " rotate(180)" : " rotate(0)");
      }))
      .attr("text-anchor", ((d) => {
        return d.angle > Math.PI ? "end" : "begin";
      }));

    groups.exit().select("text").attr("fill", "orange");
    groups.exit().select("path").remove();

    groups.exit().transition().duration(1000)
      .style("opacity", 0).remove();

    let chords = state.container.selectAll("path.chord")
      .data(state.matrix.chords(), ((d) => { return d._id; }));

    chords.enter().append("path")
      .attr("class", "chord")
      .style("fill", ((d) => {
        return state.colors(d.source._id);
      }))
      .attr("d", state.path)
      .on("mouseover", function (el) {
        chordMouseover(el);
      })
      .on("mouseout", function (el) {
        hideTooltip(el);
      });

    chords.transition().duration(2000)
      .attrTween("d", state.matrix.chordTween(state.path));

    chords.exit().remove()

    let groupClick = (d) => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      this.props.addFilter(d._id);
      resetChords();
    }

    let chordMouseover = (d) => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      dimChords(d);
      d3.select("#tooltip").style("opacity", 1);
      this.props.updateTooltip(state.matrix.read(d));
    }

    let hideTooltip = () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      d3.select("#tooltip").style("opacity", 0);
      resetChords();
    }

    let resetChords = () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      state.container.selectAll("path.chord").style("opacity",0.9);
    }

    let dimChords = (d) => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      state.container.selectAll("path.chord").style("opacity", ((p) => {
        if (d.source) { // COMPARE CHORD IDS
          return (p._id === d._id) ? 0.9: 0.1;
        } else { // COMPARE GROUP IDS
          return (p.source._id === d._id || p.target._id === d._id) ? 0.9: 0.1;
        }
      }));
    }
  }; // END DRAWCHORDS FUNCTION

  componentDidMount(){
    let state = this.state.params;
    let matrixFactory = state.chordFactory.matrix;
    this.props.onRef(this);
    state.size = [900, 900]; // SVG SIZE WIDTH, HEIGHT
    state.marg = [50, 50, 50, 50]; // TOP, RIGHT, BOTTOM, LEFT
    state.dims = []; // USABLE DIMENSIONS
    state.dims[0] = state.size[0] - state.marg[1] - state.marg[3]; // WIDTH
    state.dims[1] = state.size[1] - state.marg[0] - state.marg[2]; // HEIGHT

    state.colors = d3.scale.ordinal()
      .range(['#9C6744','#C9BEB9','#CFA07E','#C4BAA1','#C2B6BF','#121212','#8FB5AA','#85889E','#9C7989','#91919C','#242B27','#212429','#99677B','#36352B','#33332F','#2B2B2E','#2E1F13','#2B242A','#918A59','#6E676C','#6E4752','#6B4A2F','#998476','#8A968D','#968D8A','#968D96','#CC855C', '#967860','#929488','#949278','#A0A3BD','#BD93A1','#65666B','#6B5745','#6B6664','#695C52','#56695E','#69545C','#565A69','#696043','#63635C','#636150','#333131','#332820','#302D30','#302D1F','#2D302F','#CFB6A3','#362F2A']);

    state.chord = d3.layout.chord()
      .padding(0.02);

    state.matrix = matrixFactory
      .layout(state.chord)
      .filter( (item, r, c) => {
        return (item.taxonomyName === r.name && item.keywordName === c.name) ||
          (item.taxonomyName === c.name && item.keywordName === r.name);
      })
      .reduce((items, r, c) => {
        let value;
        if (!items[0]) {
          value = 0;
        } else {
          value = items.reduce((m, n) => {
              return m + (n.spectCount);
          }, 0);
        }
        return {value: value, data: items};
      });

    state.innerRadius = (state.dims[1] / 2) - 100;

    state.arc = d3.svg.arc()
      .innerRadius(state.innerRadius)
      .outerRadius(state.innerRadius + 10);

    state.path = d3.svg.chord()
      .radius(state.innerRadius);

     state.svg = d3.select(document.getElementById("chord")).append("svg")
      .attr("class", "chart")
      .attr({width: state.size[0] + "px", height: state.size[1] + "px"})
      .attr("preserveAspectRatio", "xMinYMin")
      .attr("viewBox", "0 0 " + state.size[0] + " " + state.size[1]);

    state.container = state.svg.append("g")
      .attr("class", "container")
      .attr("transform", "translate(" + ((state.dims[0] / 2) + state.marg[3]) + "," + ((state.dims[1] / 2) + state.marg[0]) + ")");

    state.messages = state.svg.append("text")
      .attr("class", "messages")
      .attr("transform", "translate(10, 10)")
      .text("Updating...");

    this.setState({
      params: state
    });
  }

  resize = () => {
    let width = document.getElementById("chord").clientWidth;
    let svg = $("#chord svg");
    svg.attr({
      width: width,
      height: width
    });
  };

  render()
  {
      this.resize();
    window.addEventListener("resize", (() => {
      this.resize();
    }));
      return null;
  };
}  

