<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from 'vue';
import axios from 'axios';
import {useDisplay} from "vuetify";

const route = useRoute();
const pageID = route.params.id;

const sceneArray = ref([]);

const posterImage = computed(() => {
  if (sceneArray.value.length === 0) {
    return ''
  } else {
    for (let sceneItem in sceneArray) {
      if (sceneItem.reason === 'face') {
        return sceneItem.preview;
      }
    }
    return sceneArray.value[0].preview
  }
})

const fetchMeta = async () => {
  const response = await axios.post('/api/video-ts', {video_pid: pageID});
  sceneArray.value = response.data.ts_list;
};

onMounted(fetchMeta);

const videoUrl = computed(() => {
  return `/api/video-full/${pageID}`;
});

const videoPlayer = ref(null);


const seekToTime = (time) => {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = time;
  }
}

const display = useDisplay();
const boxWidth = computed(() => {
  return display.lgAndUp.value ? '70vw' : '100vw'
});
</script>

<template>
  <v-container class="d-flex align-center">
    <v-responsive :width="boxWidth">
      <video
        ref="videoPlayer"
        :src="videoUrl"
        controls
        preload="metadata"
        width="100%"
        :poster="posterImage"
        controlslist="nodownload"
      />
      <v-row>
        <v-col
          v-for="scene in sceneArray"
          :key="scene.ts"
          cols="2"
        >
          <v-img
            :src="scene.preview"
            @click="seekToTime(scene.ts)"
          />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<style scoped>

</style>
