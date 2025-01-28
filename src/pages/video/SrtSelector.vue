<script setup>
import {defineEmits, defineProps} from "vue";

const props = defineProps({
  height: {
    type: Number,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  currentTime: {
    type: Number,
    required: true
  },
})

const emits = defineEmits(['select-time'])
</script>

<template>
  <v-virtual-scroll
    :height="props.height"
    :items="props.items"
  >
    <template #default="{ item: srtItem }">
      <v-list-item
        :class="srtItem.end_at < props.currentTime?'opacity-50':''"
        lines="one"
        @click="emits('select-time', srtItem.start_at)"
      >
        <v-list-item-title>{{ srtItem.texts[0].text }}</v-list-item-title>
        <v-list-item-subtitle v-if="srtItem.texts.length > 1">
          {{ srtItem.texts[1].text }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<style scoped>

</style>
