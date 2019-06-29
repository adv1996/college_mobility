<template>
  <v-card
    color="black"
    tile
    height="150"
  >
    <v-card-title primary-title>
      <div>
        <h3 class="title mb-0">Data Sources</h3>
        <div> {{ card_text1 }} </div>
        <div>
          <a href="https://opportunityinsights.org/wp-content/uploads/2018/04/Codebook-MRC-Table-6.pdf" target="_blank">
            Study ReadMe
          </a>
        </div>
        <div>
          <a href="https://opportunityinsights.org/data/" target="_blank">
            Data
          </a>
        </div>
        <div>
          <a href="https://github.com/adv1996/college_mobility" target="_blank">
            Github Link
          </a>
        </div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
  export default {
    data() {
      return {
        card_text1: 'Opportunity Insights Study: Cross-Sectional Child Income Statistics by College Tier and Parent Income Percentile',
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>