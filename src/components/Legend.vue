<template>
  <v-card
    color="white"
    tile
    height="400"
  >
    <svg id="legend"/>
  </v-card>
</template>

<script>
  /* eslint-disable */
  
  import _ from 'lodash';
  import * as d3 from 'd3';

  export default {
    props: ['data'],
    data() {
      return {
        height: null,
        width: null,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
      }
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
        
        let legendExtent = d3.extent(this.data, (d) => d.density)

        let legendXScale = d3.scaleLinear()
          .domain([0, legendExtent[1]])
          .range([0, w / 2])

        const svg = d3.select('#legend')
          .attr('height', this.height)
          .attr('width', w)
        
        const g = svg.append('g')
          .attr("transform", "translate(" + 0 + "," + this.margin.top + ")")
        
        let legendBars = g.selectAll('legendBars')
          .data([this.data])
          .enter().append('g')
        let that = this;
        legendBars.selectAll('legendRect')
          .data(function(d) {
            return d
          })
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => legendXScale(legendExtent[1]) - legendXScale(d.density) / 2 + w / 4)
          .attr('y', (d) => this.yScale(d.id))
          .attr('width', (d) => legendXScale(d.density))
          .attr('height', 12.5)
          .on('click', function(d) {
            that.$store.dispatch('setTier', d.tier_name)
            d3.selectAll('.bar')
              .style('opacity', 0.3)
            d3.select(this)
              .style('opacity', 1)
          })
          .style('opacity', (d) => {
            return d.tier_name === this.$store.getters.tier ? 1 : 0.3;
          })
          
        
        legendBars.selectAll('labels')
          .data(function(d) {
            return d
          })
          .enter().append('text')
          .attr('class', 'label')
          .attr('x', (d) => w / 4)
          .attr('y', (d) => this.yScale(d.id))
          .attr('dy', 10)
          .style('text-anchor', 'middle')
          .style('font-size', '10px')
          .text((d) => d.tier_name)
      }
    },
  }
</script>