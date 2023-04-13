<template>
    <div>
        <q-card class="q-mt-xs">
            <q-card-section>
                <div class="text-h6">{{news.headline}}</div>
                <div class="text-caption">{{ timeSince(new Date(news.datetime*1000)) }}</div>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="text-subtitle2">{{news.summary}}</div>
            </q-card-section>
            <q-card-actions>
                <div class="text-caption q-mx-xs">Source: {{ news.source }}</div>
                <q-space/>
                <q-btn outline glossy label="Read more" color="primary" :href="news.url" target="_blank" icon="open_in_new"/>

            </q-card-actions>
        </q-card>
    </div>
</template>

<script setup>
// define props using defineprops
const props = defineProps({
    news: {
        type: Object,
        required: true
    }
});

// function to convert date to how many hours minutes ago if it is within 24 hours
function timeSince(date) {


      var seconds = Math.floor((new Date() - date) / 1000);

      // var interval = seconds / 31536000;
      //
      // if (interval > 1) {
      //     return Math.floor(interval) + " years";
      // }
      // interval = seconds / 2592000;
      // if (interval > 1) {
      //     return Math.floor(interval) + " months";
      // }

      var interval = seconds / 86400;
      if (interval > 1) {
          // return Math.floor(interval) + " days";
          return date;
      }
      interval = seconds / 3600;
      if (interval > 1) {
          return Math.floor(interval) + " hours ago";
      }
      interval = seconds / 60;
      if (interval > 1) {
          return Math.floor(interval) + " minutes ago";
      }

      return Math.floor(seconds) + " seconds ago";

}



</script>

<style scoped>

</style>