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

  export default {
    data() {
      return {
        height: null,
        width: null,
        margin: {top: 20, right: 40, bottom: 20, left: 20},
      }
    },
    mounted () {
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
          .on("end", this.brushed);

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

<style lang="scss" scoped>

</style>