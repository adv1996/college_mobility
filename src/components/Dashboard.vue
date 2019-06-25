<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex
        sm12 lg12
      >
        <Distribution :data="data" :tier="tier" :boundary="count"/>
      </v-flex>
      <v-flex
        sm12 lg4
      >
        <Legend :data="data[percentage]" :percentage="percentage"/>
      </v-flex>
      <v-flex
        sm12 lg8
      >
        <Information :tier="tier" :data="data"/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import CollegeMobility from '../data/college_mobility.json';
  import Distribution from '../components/Distribution'
  import Information from '../components/Information'
  import Legend from '../components/Legend'
  import _ from 'lodash';
  import * as d3 from 'd3';

  export default {
    data() {
      return {
        data: [],
      }
    },
    components: {
      Distribution,
      Information,
      Legend,
    },
    created () {
      this.setData();
      this.setTooltip();
    },
    computed: {
      count () {
        return this.$store.getters.number
      },
      tier () {
        return this.$store.getters.tier
      },
      percentage () {
        return this.$store.getters.percentage
      }
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
      },
      setTooltip() {
        d3.select('body')
          .append('div')
          .attr('class', 'tooltip')	
          .style('opacity', 0)
      },
    },
  }
</script>

<style>
.bar {
  fill: #2b8cbe;
}
.violin {
  fill: #2b8cbe;
}
div.tooltip {	
  position: absolute;
  text-align: center;		
  padding: 2px;				
  font-size: 12px;		
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  color: black;
  background:white;
  border: 3px solid darkblue;		
  border-radius: 2px;	
  pointer-events: none;			
}
.selection {
  fill: darkorange;
}
</style>