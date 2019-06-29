<template>
  <v-card
    color="white"
    tile
    height="430"
  >
    <svg id="brush"/>
  </v-card>
</template>

<script>
  /* eslint-disable */
  import * as d3 from 'd3';
  import _ from 'lodash';
  export default {
    props: ['tier', 'data'],
    data() {
      return {
        height: null,
        width: null,
        margin: {top: 100, right: 40, bottom: 20, left: 20},
        extents: [],
        area: null,
        valueline: null,
        yScale: null,
      }
    },
    watch: {
      tier: function() {
        this.setData();
        
        let extents = d3.extent(Object.values(this.extents), (d) => d.total)

        this.yScale.domain([extents[1],0])

        let values = d3.select('.brush_group').selectAll('.area2')
          .data([Object.values(this.extents)])  
        values.enter().append('path')
          .merge(values)
            .attr("class", "area2")
            .attr("d", this.area);
        values.exit().remove()
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
          .attr("transform", "translate(" + this.margin.left + "," + h/2 + ")")
          .attr('class', 'brush_group')

        svg.append('text')
          .attr('x', w/2)
          .attr('y', this.margin.top)
          .text('Brush Selection And Legend Drag and Drop')
          .attr('class', 'subheading')
          .style('text-anchor', 'middle')

        let brush = d3.brushX()
          .extent([[0, 0], [w, this.height/4]])
          .on("end", this.brushed)

        this.xScale = d3.scaleLinear()
          .domain([0, 100])
          .range([0, w])
        
        g.append('g')
          .attr('class', 'xAxisLineB')
          .attr("transform", "translate(" + 0 + "," + h/4 + ")")
          .call(d3.axisBottom(this.xScale));
        
        let extents = d3.extent(Object.values(this.extents), (d) => d.total)
        
        this.yScale = d3.scaleLinear()
          .domain([extents[1], 0])
          .range([0, h/4])
        
        this.area = d3.area()
          .x((d) => {
            return this.xScale(d.k);
          })
          .y0(h/4)
          .y1((d) => { return this.yScale(d.total); });
        
        let values = g.append('g')
        values.selectAll('area2')
          .data([Object.values(this.extents)])
          .enter().append('path')
          .attr("class", "area2")
          .attr("d", this.area);
        
        var circleGroup = g.selectAll('circleGroup')
          .data(['65'])
          .enter().append('g')
          .attr('transform',(d) => { return 'translate('+ this.xScale(parseInt(d)) +',' + (this.height/4 + this.margin.bottom) +')'; })
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));

        circleGroup.append("circle")
            .attr('r', 8)
            .attr('class', 'pointer')

        circleGroup.append("text")
          .text((d,i) => { return d; })
          .style('text-anchor','middle')
          .attr('y', 23);

        function dragstarted(d) {
          d3.select(this).raise().classed("active", true);
        }
        let that = this;
        function dragged(d) {
          if (that.xScale.invert(d3.event.x) >= 0 && that.xScale.invert(d3.event.x) <= 100) {
            let value = Math.ceil(that.xScale.invert(d3.event.x)).toString()
            d3.select(this).attr("transform","translate("+(d = d3.event.x)+','+ (that.height/4 + that.margin.bottom) +')' );
            d3.select(this).select('text')
              .text(value)
          }
        }

        function dragended(d) {
          d3.select(this).classed("active", false);
          let xValue = Math.ceil(that.xScale.invert(d3.event.x))
          if (xValue > 17 || xValue === 9) {
            if (xValue <= 100 ) {
              let value = xValue.toString()
              that.$store.dispatch('setPercentage', value)
            }
          }
        }

        g.append("g")
          .attr("class", "brush")
          .call(brush)
          .call(brush.move, this.xScale.range())
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
        this.extents['9'].total = this.extents['9'].total / 18;
      },
      brushed() {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
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
.pointer {
  fill: darkorange;
}
</style>