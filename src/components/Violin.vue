<template>
  <div>
    <svg id="violin"/>
  </div>
</template>

<script>
  import CollegeMobility from '../data/college_mobility.json';
  import _ from 'lodash';
  import * as d3 from 'd3';

  export default {
    data() {
      return {
        data: [],
        height: 750,
        width: 2200,
        margin: {top: 50, right: 20, bottom: 20, left: 150},
        extents: [],
        yScale: null,
      }
    },
    mounted () {
      this.setData();
      this.initGraph();
    },
    methods: {
      setData() {
        this.data = _.groupBy(_.map(CollegeMobility, (d) => {
          return {
            tier: d.tier,
            tier_name: d.tier_name,
            density: isNaN(parseFloat(d.density)) ? 0 : parseFloat(d.density),
            tot_count: isNaN(parseFloat(d.tot_count)) ? 0 : parseFloat(d.tot_count),
            k_pctile: d.k_pctile,
            count: isNaN(parseFloat(d.count)) ? 0 : parseFloat(d.count),
            id: 'tier' + d.tier
          }
        }), 'k_pctile')
        this.extents = _.mapValues(this.data, (d) => {
          let extent = d3.extent(d, d => d.density)
          return {
            id: d[0].id,
            k: d[0].k_pctile,
            min: extent[0],
            max: extent[1],
            total: _.find(d, ['tier_name', 'Selective private']).count
          }
        })
      },
      initGraph() {
        const h = this.height - this.margin.top - this.margin.bottom;
        const w = this.width - this.margin.right - this.margin.left;
        
        let xScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, w])
        this.extents['9'].total = this.extents['9'].total / 18;
        let backExtents = d3.extent(Object.values(this.extents), (d) => d.total)
        
        let backYscale = d3.scaleLinear()
          .domain([backExtents[1], 0])
          .range([this.margin.top, h])

        this.yScale = d3.scaleBand()
          .domain(_.map(this.data['9'], 'id').reverse())
          .range([h - 50, h - 150])

        const svg = d3.select('#violin')
          .attr('height', this.height + this.margin.top + this.margin.bottom)
          .attr('width', this.width + this.margin.left + this.margin.right)
        
        const g = svg.append('g')
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
        
        let valueline = d3.line()
          .x((d) => {
            return xScale(d.k);
          })
          .y((d) => {
            return backYscale(d.total);
          });
        
        let area = d3.area()
          .x((d) => {
            return xScale(d.k);
          })
          .y0(h)
          .y1((d) => { return backYscale(d.total); });

        g.selectAll('area')
          .data([Object.values(this.extents)])
          .enter().append('path')
          .attr("class", "area")
          .attr("d", area);

        g.selectAll('lines')
          .data([Object.values(this.extents)])
          .enter().append('path')
          .attr("class", "line")
          .attr("d", valueline);

        g.append('g')
          .attr('class', 'xAxisLine')
          .attr("transform", "translate(0," + h + ")")
          .call(d3.axisBottom(xScale));

        g.append('g')
          .attr('class', 'yAxisLine')
          .call(d3.axisLeft(backYscale));
        
        // ['9', '18', '27', '36', '45', '54', '63', '72', '81', '90', '99']
        // ['90', '91', '92', '93', '94', '95', '96', '97', '98', '99']

        let plots = g.selectAll('plots')
          .data(['18', '25', '32', '39', '46', '53', '60', '67', '74', '81', '88', '95'])
          .enter().append('g')
          .attr("transform", (d) => "translate(" + xScale(parseInt(d)) + "," + this.margin.top + ")")

        let that = this;
        
        plots
          .selectAll('rect')
          .data(function(d) {
            return that.data[d]
          })
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', (d) =>  - this.getWidth(d.k_pctile, d.density) / 2)
          .attr('y', (d) => this.yScale(d.id))
          .attr('width', (d) => this.getWidth(d.k_pctile, d.density))
          .attr('height', 5)
        
        let legendExtent = d3.extent(this.data['65'], (d) => d.density)
        let legendXScale = d3.scaleLinear()
          .domain([0, legendExtent[1]])
          .range([0, 300])
        
        this.yScale.range([h / 2 + 110, h / 2 - 150])

        let legend = g.selectAll('legend')
          .data(['65'])
          .enter().append('g')

        legend.selectAll('legend_rect')
          .data(function(d) {
            return that.data[d]
          })
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => - legendXScale(d.density) / 2 + 600)
          .attr('y', (d) => this.yScale(d.id))
          .attr('width', (d) => legendXScale(d.density))
          .attr('height', 12.5)
        
        legend.selectAll('labels')
          .data(function(d) {
            return that.data[d]
          })
          .enter().append('text')
          .attr('class', 'caption')
          .attr('x', (d) => - legendXScale(d.density) / 2 + 610 + legendXScale(d.density))
          .attr('y', (d) => this.yScale(d.id))
          .attr('dy', 10)
          .text((d) => d.tier_name)

        g.append('text')
          .attr('x', 590)
          .attr('y', h / 2 + 130)
          .attr('class', 'headline')
          .text('65 %')

        g.append('text')
          .attr('x', 150)
          .attr('y', 100)
          .attr('class', 'headline')
          .text('Parental Income Distribution and Student College Admissions')
        
        g.append('text')
          .attr('x', w / 2 - this.margin.left)
          .attr('y', h + 45)
          .attr('class', 'caption')
          .text('Parental Income Percentiles')
        
        g.append('text')
          .attr('x', this.margin.right)
          .attr('y', h / 2)
          .attr('class', 'caption')
          .text('Number of Students')
      },
      getWidth(percentile, value) {
        let extent = this.extents[percentile]
        let xScale = d3.scaleLinear()
          .domain([0, extent.max])
          .range([0, 110])
        return xScale(value)
      }
    },
  }
</script>

<style>
.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}
.area {
  fill: lightsteelblue;
}
.bar {
  fill: #2b8cbe;
}
</style>