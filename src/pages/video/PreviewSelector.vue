<script setup>
import {computed, defineEmits, defineProps} from 'vue'
import {chunk} from 'lodash'

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
  colCount: {
    type: Number,
    default: 1
  }
})

const emits = defineEmits(['select-time'])

const chunkedItems = computed(() => {
  return chunk(props.items, props.colCount)
})
const cols = computed(() => {
  return Math.floor(12 / props.colCount)
})
</script>

<template>
  <v-virtual-scroll
    :height="props.height"
    :items="chunkedItems"
  >
    <template #default="{ item:sceneChunk }">
      <v-row no-gutters>
        <v-col
          v-for="scene in sceneChunk"
          :key="scene.ts"
          :cols="cols"
          class="px-1"
        >
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
        </v-col>
      </v-row>
    </template>
  </v-virtual-scroll>
</template>

<style scoped>

</style>
