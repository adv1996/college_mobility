<template>
  <v-app>
    <v-content>
      <Violin/>
      <Brush/>
    </v-content>
  </v-app>
</template>

<script>
import Violin from '../src/components/Violin.vue';
import Brush from '../src/components/Brush.vue';

export default {
  name: 'App',
  components: {
    Violin,
    Brush,
  },
  data () {
    return {
      //
    }
  }
}
</script>
