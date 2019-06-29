<template>
  <v-card
    color="black"
    tile
    height="430"
  >
    <svg id="legend"/>
  </v-card>
</template>

<script>
  /* eslint-disable */
  
  import _ from 'lodash';
  import * as d3 from 'd3';

  export default {
    props: ['data', 'percentage'],
    data() {
      return {
        height: null,
        width: null,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
        legendExtent: null,
        legendXScale: null,
      }
    },
    watch: {
      percentage: function() {
        const h = this.height - this.margin.top - this.margin.bottom;
        const w = this.width - this.margin.right - this.margin.left;
        let legendGroup = d3.select('.legendBars')
          .data([this.data])
          .join('g')
        
        legendGroup.enter().append('g')
            .merge(legendGroup)
              .attr('class', 'legendBars')

        let that = this;
        let bars = legendGroup.selectAll('.bar')
          .data(function(d) {
            return d
          })
        this.legendExtent = d3.extent(this.data, (d) => d.density)
        this.legendXScale = d3.scaleLinear()
          .domain([0, this.legendExtent[1]])
          .range([0, w / 2])
        bars.enter().append('rect')
          .attr('class', 'bar')
          .merge(bars)
            .transition()
            .duration(1000)
            .attr('class', 'bar')
            .attr('x', (d) => this.legendXScale(this.legendExtent[1]) - this.legendXScale(d.density) / 2 + w / 4)
            .attr('width', (d) => this.legendXScale(d.density))
        bars.exit().remove()

        d3.select('#legend_percentile').text(this.percentage + '%');
      },
    },
    mounted () {
      this.setDimensions();
      this.initLegend();
    },
    methods: {
      setDimensions() {
        this.width = this.$el.offsetWidth
        this.height = this.$el.offsetHeight
      },
      initLegend() {
        const h = this.height - this.margin.top - this.margin.bottom;
        const w = this.width - this.margin.right - this.margin.left;
        
        this.yScale = d3.scaleBand()
          .domain(_.map(this.data, 'id'))
          .range([h/5, 4 * h / 5])
        
        this.legendExtent = d3.extent(this.data, (d) => d.density)

        this.legendXScale = d3.scaleLinear()
          .domain([0, this.legendExtent[1]])
          .range([0, w / 2])

        const svg = d3.select('#legend')
          .attr('height', this.height)
          .attr('width', w)
        
        const g = svg.append('g')
          .attr("transform", "translate(" + 0 + "," + this.margin.top + ")")
        
        let legendBars = g.selectAll('legendBars')
          .data([this.data])
          .enter().append('g')
          .attr('class', 'legendBars')
        let that = this;

        let tooltip = d3.select('.tooltip');

        legendBars.selectAll('legendRect')
          .data(function(d) {
            return d
          })
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => this.legendXScale(this.legendExtent[1]) - this.legendXScale(d.density) / 2 + w / 4)
          .attr('y', (d) => this.yScale(d.id))
          .attr('width', (d) => this.legendXScale(d.density))
          .attr('height', h / 32)
          .on('click', function(d) {
            that.$store.dispatch('setTier', d.tier_name)
            d3.selectAll('.bar')
              .style('opacity', 0.3)
            d3.select(this)
              .style('opacity', 1)
          })
          .on('mouseover', (d) => {
            tooltip
              .style("left", (d3.event.pageX + 25) + "px")	
              .style("top", (d3.event.pageY - 25) + "px")
              .style('opacity', 1)
              .style('height', 75)
              .html(d.tier_name + '<br>' + 'Density: ' + d.density.toFixed(4) + '<br>' + 'Total: ' + d.count)
          })
          .on('mouseout', () => {
            tooltip
              .style('opacity', 0)
          })
          .style('opacity', (d) => {
            return d.tier_name === this.$store.getters.tier ? 1 : 0.3;
          })
        
        // legend label
        g.append('text')
          .attr('x', this.legendXScale(this.legendExtent[1]) + w / 4)
          .attr('y', 4 * h / 5 + 24)
          .text(this.percentage + '%')
          .attr('id', 'legend_percentile')
          .attr('class', 'label subheading')
          .style('text-anchor', 'middle')

        //main label
        g.append('text')
          .attr('x', this.margin.left - 10)
          .attr('y', this.margin.top)
          .text('Relative Distribution of College Tiers Across Income')
          .attr('class', 'label title')
          .style('text-anchor', 'start')
        
        legendBars.selectAll('labels')
          .data(function(d) {
            return d
          })
          .enter().append('text')
          .attr('class', (d) => {
            return 'label2 ' + d.id
          })
          .attr('x', (d) => w / 4)
          .attr('y', (d) => this.yScale(d.id))
          .attr('dy', 10)
          .style('text-anchor', 'middle')
          .style('font-size', (d) => {
            if (w < 500) {
              return '8px'
            }
            return '13px'
          })
          .text((d) => d.tier_name)
          .attr('fill', 'white')
      }
    },
  }
</script>
