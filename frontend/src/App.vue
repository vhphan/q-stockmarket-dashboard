<script>
import MainLayout from "@/layouts/MainLayout.vue";
import {onMounted} from "vue";

export default {
    components: {MainLayout},
    setup() {

        if (process.env.NODE_ENV === 'development') {
            document.cookie = "API=" + import.meta.env.VITE_API_KEY + ";";
        }

        onMounted(async () => {
        });

        return {};

    }

};

</script>

<template>
    <main-layout/>
</template>

<style>
</style>
