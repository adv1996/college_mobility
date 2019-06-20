<template>
  <svg id="college"/>
</template>

<script>
  import CollegeMobility from '../data/college_mobility.json';
  import _ from 'lodash';
  import * as d3 from 'd3';

  export default {
    data() {
      return {
        collegeData: [],
        tierData: [],
        height: 500,
        width: 800,
        margin: {top: 50, right: 20, bottom: 20, left: 100},
      }
    },
    mounted () {
      this.initData();
      this.createGraph();
    },
    methods: {
      initData() {
        this.collegeData = CollegeMobility;
        this.tierData = _.map(_.filter(this.collegeData, (d) => {
          return d.tier === "1" || d.tier === "5" || d.tier === "7" || d.tier === "3";
        }), (d) => {
          return {
            tier: d.tier,
            tier_name: d.tier_name,
            density: isNaN(parseFloat(d.density)) ? 0 : parseFloat(d.density),
            tot_count: isNaN(parseFloat(d.tot_count)) ? 0 : parseFloat(d.tot_count),
            k_pctile: isNaN(parseFloat(d.k_pctile)) ? 0 : parseFloat(d.k_pctile),
            count: isNaN(parseFloat(d.count)) ? 0 : parseFloat(d.count)
          }
        })
      },
      createGraph() {
        const svg = d3.select('#college')
          .attr('height', this.height + this.margin.top + this.margin.bottom)
          .attr('width', this.width + this.margin.left + this.margin.right)

        const g = svg.append('g')
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      
        let xScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, this.width - this.margin.right - this.margin.left])
        
        let extent = d3.extent(this.tierData, (d) => d.count)

        let yScale = d3.scaleLog()
          .domain([1, extent[1]])
          .range([this.height - this.margin.top - this.margin.bottom, 0])

        g.append('g')
          .attr('class', 'albums')
          .selectAll('songs')
          .data(this.tierData)
          .enter().append('circle')
          .attr('class', 'points')
          .attr('cx', (d) => xScale(d.k_pctile))
          .attr('cy', (d) => yScale(d.count))
          .attr('fill', (d) => {
            if (d.tier === '1') {
              return 'orange'
            } else if (d.tier === '5') {
              return 'green'
            } else if (d.tier === '3') {
              return 'blue'
            } else {
              return 'red'
            }
          })
          .attr('r', 2.5)
        
        let h = this.height - this.margin.top - this.margin.bottom
        g.append('g')
          .attr('class', 'xAxisLine')
          .attr("transform", "translate(0," + h + ")")
          .call(d3.axisBottom(xScale));
        
        g.append('text')
          .attr('x', this.width / 2 - this.margin.left - this.margin.right)
          .attr('y', this.height)
          .text('Parental Income (low to high)')
        
        svg.append('text')
          .attr('x', this.width / 2 - 250)
          .attr('y', 30)
          .text('Ivy League Plus(orange) + Nonselective Public(red) + Selective Public(green) Highly Selective Public(blue)')
        
        g.append('g')
          .attr('class', 'yAxisLine')
          .call(d3.axisLeft(yScale));
        
        svg.append('text')
          .attr('x', 10)
          .attr('y', this.height / 2)
          .text('Density')
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>