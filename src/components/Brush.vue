<template>
  <div>
    <svg id="brush"/>
  </div>
</template>

<script>
  import CollegeMobility from '../data/college_mobility.json';
  import _ from 'lodash';
  import * as d3 from 'd3';

  export default {
    data() {
      return {
        height: 100,
        width: 2200,
        xScale: null,
        yScale: null,
        margin: {top: 50, right: 20, bottom: 20, left: 150},
      }
    },
    mounted () {
      this.initGraph();
    },
    methods: {
      initGraph() {
        const h = this.height - this.margin.top - this.margin.bottom;
        const w = this.width - this.margin.right - this.margin.left;
        
        const svg = d3.select('#brush')
          .attr('height', this.height + this.margin.top + this.margin.bottom)
          .attr('width', this.width + this.margin.left + this.margin.right)
        
        const g = svg.append('g')
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

        let brush = d3.brushX()
          .extent([[0, 0], [this.width, this.height]])
          .on("end", this.brushed);

        this.xScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, w])
        
        g.append('g')
          .attr('class', 'xAxisLine')
          .attr("transform", "translate(0," + h + ")")
          .call(d3.axisBottom(this.xScale));
        
        g.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, this.xScale.range());
      },
      brushed() {
        console.log('brushed');
        if (d3.event.selection) {
          console.log(d3.event.selection)
        } else {
          console.log('no event specified')
        }
      }
    },
  }
</script>

<style>

</style>