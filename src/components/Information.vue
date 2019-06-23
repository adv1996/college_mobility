<template>
  <v-card
    color="white"
    tile
    height="400"
  >
    <svg id="brush"/>
  </v-card>
</template>

<script>
  import * as d3 from 'd3';
  import _ from 'lodash';
  export default {
    props: ['tier'],
    data() {
      return {
        height: null,
        width: null,
        margin: {top: 20, right: 40, bottom: 20, left: 20},
        extents: [],
      }
    },
    watch: {
      tier: function() {
          console.log('tier change');
          let svg = d3.select('#brush')
          svg.selectAll("*").remove();
          this.setData();
          this.initGraph();
      },
    },
    mounted () {
      this.setData();
      this.setDimensions();
      this.initGraph();
    },
    methods: {
      setDimensions() {
        this.width = this.$el.offsetWidth
        this.height = this.$el.offsetHeight
      },
      initGraph() {
        const h = this.height - this.margin.top - this.margin.bottom;
        const w = this.width - this.margin.right - this.margin.left;
        
        const svg = d3.select('#brush')
          .attr('height', this.height)
          .attr('width', this.width)
        
        const g = svg.append('g')
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

        let brush = d3.brushX()
          .extent([[0, this.height / 4], [w, this.height / 2]])
          .on("end", this.brushed)

        this.xScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, w])
        
        g.append('g')
          .attr('class', 'xAxisLine')
          .attr("transform", "translate(" + 0 + "," + h / 2 + ")")
          .call(d3.axisBottom(this.xScale));
        
        g.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, this.xScale.range());
        
        let extents = d3.extent(Object.values(this.extents), (d) => d.total)
        
        let yScale = d3.scaleLinear()
          .domain([extents[1], 0])
          .range([this.margin.top, h])

        this.valueline = d3.line()
          .x((d) => {
            return this.xScale(d.k);
          })
          .y((d) => {
            return yScale(d.total);
          });
        
        this.area = d3.area()
          .x((d) => {
            return this.xScale(d.k);
          })
          .y0(h)
          .y1((d) => { return yScale(d.total); });
        
        let values = g.append('g')

        values.selectAll('area2')
          .data([Object.values(this.extents)])
          .enter().append('path')
          .attr("class", "area2")
          .attr("d", this.area);

        // let lineValues = g.append('g')

        // lineValues.selectAll('lines2')
        //   .data([Object.values(this.extents)])
        //   .enter().append('path')
        //   .attr("class", "line2")
        //   .attr("d", this.valueline);
      },
      setData() {
        this.extents = _.mapValues(this.data, (d) => {
          let extent = d3.extent(d, d => d.density)
          return {
            id: d[0].id,
            k: d[0].k_pctile,
            min: extent[0],
            max: extent[1],
            total: _.find(d, ['tier_name', this.tier]).count
          }
        })
      },
      brushed() {
        if (d3.event.selection) {
          let boundaries = d3.event.selection;
          this.$store.dispatch('setBoundary', [parseInt(this.xScale.invert(boundaries[0])), parseInt(this.xScale.invert(boundaries[1]))])
        }
      }
    },
  }
</script>

<style>
.line2 {
  fill: none;
  stroke: steelblue;
  stroke-width: 2px;
}
.area2 {
  fill: lightsteelblue;
}
</style>