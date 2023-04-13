<script>
import MainLayout from "@/layouts/MainLayout.vue";
import {api} from "@/plugins/http.js";
import {apiCheckConnection} from "@/api/apiCalls.js";
import {onMounted} from "vue";

export default {
    components: {MainLayout},
    setup() {

        if (process.env.NODE_ENV === 'development') {
            document.cookie = "API=" + import.meta.env.VITE_API_KEY + ";";
        }

        onMounted(async () => {
            console.log('App mounted');
            const checkData = await apiCheckConnection();
            console.log('checkData: ', checkData);

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
