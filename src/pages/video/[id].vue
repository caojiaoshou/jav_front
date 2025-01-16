<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from 'vue';
import axios from 'axios';

const route = useRoute();
const pageID = route.params.id;

const sceneArray = ref([]);

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
};
</script>

<template>
  <v-responsive width="80%">
    <video
      ref="videoPlayer"
      :src="videoUrl"
      controls
      width="100%"
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
</template>

<style scoped>

</style>
