<script setup>
import {computed} from "vue";

const props = defineProps({
  facePid: {
    type: String,
    required: true
  },
  quickLookPid: {
    type: String,
    required: true
  },
  videoName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
})

const imageUrl = computed(() => {
  return `/api/face-image/${props.facePid}`
})

const videoUrl = computed(() => {
  return `/api/quick-look/${props.quickLookPid}`
})

const age = computed(() => {
  return Math.round(props.age)
})


const duration = computed(() => {
  const totalSeconds = Math.floor(props.duration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <v-hover>
    <template #default="{ isHovering ,props}">
      <v-responsive
        :aspect-ratio="1"
        v-bind="props"
      >
        <v-sheet
          v-if="isHovering"
          class="ma-0 pa-0"
        >
          <video
            :src="videoUrl"
            muted
            loop
            autoplay
          />
          <div>{{ props.videoName }}</div>
        </v-sheet>
        <v-img
          v-else
          :src="imageUrl"
          :aspect-ratio="1"
          class="ma-0 pa-0"
        />
      </v-responsive>
    </template>
  </v-hover>
</template>

<style scoped>
video {
  width: 100%;
}
</style>
