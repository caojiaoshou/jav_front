<script setup>
import {defineEmits, defineProps} from 'vue'

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
    class="pr-4"
  >
    <template #default="{ item:scene }">
      <v-responsive :class="scene.ts < props.currentTime? 'opacity-50 position-relative' : 'position-relative'">
        <v-img
          class="rounded-lg mb-2"
          :src="scene.preview"
          @click="emits('select-time', scene.ts)"
        />
        <v-chip
          :text="scene.reason.toUpperCase()"
          label
          color="blue-grey"
          variant="flat"
          class="opacity-70 text-black mb-4 mr-2 px-2 py-0 position-absolute bottom-0 right-0"
        />
      </v-responsive>
    </template>
  </v-virtual-scroll>
</template>

<style scoped>

</style>
