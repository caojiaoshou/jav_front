<template>
  <v-row no-gutters>
    <v-col
      v-for="item in Array(256)"
      cols="1"
      md="4"
      class="pa-1"
    >
      <preview />
    </v-col>
  </v-row>
</template>

<script setup>
import Preview from "@/components/Preview.vue";
</script>
