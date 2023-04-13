<template>
    <q-layout view="hHh lpR fFf">

        <q-header elevated class="bg-primary text-white" height-hint="98">
            <q-toolbar>
                <q-toolbar-title
                        shrink
                >
                    <q-avatar>
                        <!--            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="logo">-->
<!--                        <img class="doc-header__logo-img" src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg"-->
<!--                             alt="Quasar Logo" width="48" height="48">-->
                        <img class="doc-header__logo-img" src="function-svgrepo-com.svg"
                             alt="Quasar Logo" width="48" height="48" >
                    </q-avatar>
<!--                    get title from package.json -->


                    {{ name }}
                </q-toolbar-title>
                <q-tabs align="left">
                    <!--          <q-route-tab :to="`${basePath}page1`" label="Page One"/>-->
                    <!--          <q-route-tab :to="`${basePath}page2`" label="Page Two"/>-->
                    <!--          <q-route-tab :to="`${basePath}page3`" label="Page Three"/>-->
                </q-tabs>
            </q-toolbar>

        </q-header>

        <q-page-container class="q-px-md">

            <router-view v-slot="{ Component }" :key="$route.fullPath">
                <component :is="Component"/>
            </router-view>

        </q-page-container>

    </q-layout>
</template>
<script setup>
import {basePath} from "../constants.js";
const version = __APP_VERSION__;
const build = __APP_BUILD__;
const name = __APP_NAME__;
</script>
<style>

.doc-header__logo-img:hover {
    transform: rotate(-360deg);
    transition: transform .8s ease-in-out;
}

.doc-header__logo-img {
    transform: rotate(0);
    transition: transform .8s ease-in-out;
}

</style>