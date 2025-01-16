<script setup>
import {computed, ref} from "vue";

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
  return Math.round(props.age).toString()
})


const duration = computed(() => {
  const totalSeconds = Math.floor(props.duration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const videoPlayer = ref(null)
const videoDuration = ref(0)
const videoCurrentTime = ref(0)


const onTimeUpdated = () => {
  videoCurrentTime.value = videoPlayer.value.currentTime
  videoDuration.value = videoPlayer.value.duration
}
</script>

<template>
  <v-hover>
    <template #default="hoverState">
      <v-responsive
        :aspect-ratio="1"
        v-bind="hoverState.props"
        class="position-relative"
      >
        <v-sheet
          v-if="hoverState.isHovering"
          class="ma-0 pa-0"
        >
          <v-progress-linear
            v-if="videoDuration"
            :model-value="videoCurrentTime/videoDuration*100"
            color="primary"
          />
          <video
            ref="videoPlayer"
            :src="videoUrl"
            muted
            loop
            autoplay
            @timeupdate="onTimeUpdated"
          />
          <div>{{ props.videoName }}</div>
        </v-sheet>
        <v-img
          v-else
          :src="imageUrl"
          :aspect-ratio="1"
          class="ma-0 pa-0 photo-container"
        />
        <div class="position-absolute bottom-0 right-0">
          <v-chip
            :text="age"
            label
            color="blue-grey"
            variant="flat"
            size="large"
            class="opacity-80 text-black ma-2 px-4 py-0"
            prepend-icon="mdi-cake-variant-outline"
          />
          <v-chip
            :text="duration"
            label
            color="blue-grey"
            variant="flat"
            size="large"
            class="opacity-80 text-black ma-2 px-4 py-0"
            prepend-icon="mdi-clock-outline"
          />
        </div>
      </v-responsive>
    </template>
  </v-hover>
</template>

<style scoped>
video {
  width: 100%;
}

.photo-container {
  /* 定义渐变蓝背景 */
  background: linear-gradient(135deg, #1E90FF, #87CEEB);
}
</style>
