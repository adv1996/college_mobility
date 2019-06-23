<template>
  <v-card
    color="white"
    tile
    height="455"
  >
    <svg id="violin"/>
  </v-card>
</template>

<script>
  /* eslint-disable */
  import _ from 'lodash';
  import * as d3 from 'd3';

  export default {
    props: ['data', 'tier', 'boundary'],
    data() {
      return {
        height: null,
        width: null,
        margin: {top: 20, right: 40, bottom: 20, left: 40},
        extents: null,
        xaxis: null,
        area: null,
        valueline: null,
        violinYScale: null,
      }
    },
    created () {
      this.setData();
    },
    mounted () {
      this.setDimensions();
      this.initGraph();
    },
    watch: {
      tier: function() {
          console.log('tier change');
          let svg = d3.select('#violin')
          svg.selectAll("*").remove();
          this.setData();
          this.initGraph();
      },
      boundary: function(newValue, oldValue) {
        this.xscale.domain([this.boundary[0] - 1, this.boundary[1] + 1]);
        d3.selectAll(".area")
          .attr("d", this.area)
        d3.selectAll(".line")
          .attr("d", this.valueline)
        d3.select(".xAxisLine").call(this.xaxis);

        if (!_.isEqual(newValue, oldValue)) {
          let violinPlots = d3.select('.main_group').selectAll('.plots')
            .data(this.verfiyDomain(this.boundary))
            .join('g')

          violinPlots.enter().append('g')
            .merge(violinPlots)
              .attr('class', 'plots')

          let that = this;
          let violin = violinPlots.selectAll('.violin')
            .data(function(d,i) {
              console.log(i)
              return that.data[d]
            })
          violin.enter().append('rect')
            .attr('class', 'violin')
            .merge(violin)
              .transition()
              .duration(1000)
              .attr('x', (d) =>  {
                return this.xscale(d.k_pctile) - this.getWidth(d.k_pctile, d.density) / 2;
              })
              .attr('y', (d) => this.violinYScale(d.id) + this.margin.top)
              .attr('width', (d) => this.getWidth(d.k_pctile, d.density))
              .attr('height', 4)
          violin.exit().remove()
        }
     
      }
    },
    methods: {
      verfiyDomain(bound) {
        console.log(bound)
        let clamp = (bound[1] - bound[0]) / 12
        if (bound[0] < 9) {
          bound[0] = 9
        }
        let range = d3.range(bound[0], bound[1] + 1, Math.ceil(clamp))
        console.log(bound[0], bound[1], range);
        range = _.filter(range, (d) => {
          return d === 9 || (d >= 18 && d < 100)
        })
        console.log(range);
        return _.map(range, d => d.toString())
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
      setDimensions() {
        this.width = this.$el.offsetWidth
        this.height = this.$el.offsetHeight
      },
      initGraph() {
        const h = this.height - this.margin.top - this.margin.bottom;
        const w = this.width - this.margin.right - this.margin.left;
        
        this.xscale = d3.scaleLinear()
          .domain([0, 100])
          .range([this.margin.left, w])
        this.xaxis = d3.axisBottom(this.xscale)
        const svg = d3.select('#violin')
          .attr('height', this.height)
          .attr('width', this.width)

        svg.append("defs").append("clipPath")
          .attr("id", "clip")
          .append("rect")
            .attr("width", this.width)
            .attr("height", this.height);
        
        const g = svg.append('g')
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
          .attr('class', 'main_group')

        let extents = d3.extent(Object.values(this.extents), (d) => d.total)
        
        let yScale = d3.scaleLinear()
          .domain([extents[1], 0])
          .range([this.margin.top, h])
        
        // y scale for violin plots to band the tiers
        this.violinYScale = d3.scaleBand()
          .domain(_.map(this.data['9'], 'id'))
          .range([h - 100, h - this.margin.bottom])
        
        this.valueline = d3.line()
          .x((d) => {
            return this.xscale(d.k);
          })
          .y((d) => {
            return yScale(d.total);
          });
        
        this.area = d3.area()
          .x((d) => {
            return this.xscale(d.k);
          })
          .y0(h)
          .y1((d) => { return yScale(d.total); });

        let values = g.append('g')
          values.attr("clip-path", "url(#clip)")
          values.selectAll('area')
            .data([Object.values(this.extents)])
            .enter().append('path')
            .attr("class", "area")
            .attr("d", this.area);

        let lineValues = g.append('g')
          lineValues.attr("clip-path", "url(#clip)")
          lineValues.selectAll('lines')
            .data([Object.values(this.extents)])
            .enter().append('path')
            .attr("class", "line")
            .attr("d", this.valueline);
        
        let that = this;

        let plots = g.selectAll('plots')
          .data(['18', '25', '32', '39', '46', '53', '60', '67', '74', '81', '88', '95'])
          .enter().append('g')
          .attr("transform", (d) => "translate(" + 0 + "," + 0 + ")")
          .attr('class', 'plots')
        
        plots
          .selectAll('violin')
          .data(function(d) {
            return that.data[d]
          })
          .enter().append('rect')
          .attr('class', 'violin')
          .attr('x', (d) => {
            return this.xscale(d.k_pctile) - this.getWidth(d.k_pctile, d.density) / 2
          })
          .attr('y', (d) => this.violinYScale(d.id) + this.margin.top)
          .attr('width', (d) => this.getWidth(d.k_pctile, d.density))
          .attr('height', 4)

        g.append('g')
          .attr('class', 'xAxisLine')
          .attr("transform", "translate(" + 0 + "," + h + ")")
          .call(d3.axisBottom(this.xscale));

        g.append('g')
          .attr('class', 'yAxisLine')
          .call(d3.axisLeft(yScale));

        // Violin Plots

      },
      getWidth(percentile, value) {
        let extent = this.extents[percentile]
        let xScale = d3.scaleLinear()
          .domain([0, extent.max])
          .range([0, 100])
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
</style>