<template>
  <v-container fluid grid-list-sm>
    {{`${count} and ${tier}`}}
    <v-layout row wrap>
      <v-flex
        xs12
        d-flex
      >
        <Distribution :data="data" :tier="tier" :boundary="count"/>
      </v-flex>
      <v-flex
        xs3
        d-flex
      >
        <Legend :data="data['65']"/>
      </v-flex>
      <v-flex
        xs9
        d-flex
      >
        <Information/>
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
    },
    computed: {
      count () {
        return this.$store.getters.number
      },
      tier () {
        return this.$store.getters.tier
      },
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
</style>