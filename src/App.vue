<template>
  <v-app dark>
    <v-content>
      <Dashboard/>
    </v-content>
  </v-app>
</template>

<script>
import Dashboard from '../src/components/Dashboard';

export default {
  name: 'App',
  components: {
    Dashboard,
  },
}
</script>
