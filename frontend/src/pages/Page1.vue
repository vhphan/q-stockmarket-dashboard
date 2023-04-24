<template>
    <div>
        <q-splitter
                v-model="vSplitterModel"
                separator-class="bg-red"
                separator-style="width: 3px"
                :limits="[5,95]"
        >
            <template v-slot:before>
                <div class="left-container">
                    <tabs/>
                </div>
            </template>
            <template v-slot:separator>
                <q-avatar color="primary"
                          text-color="white"
                          size="30px"
                          icon="drag_indicator"/>
            </template>
            <template v-slot:after>
                <div class="q-pa-xs right-container">
                    <right-tabs/>
                </div>
            </template>
        </q-splitter>
    </div>
</template>

<script>
import {computed, ref} from "vue";
import Tabs from "@/components/Tabs.vue";
import {basePath} from "@/constants.js";
import RightTabs from "@/components/RightTabs.vue";

export default {
    name: "Page1",
    components: {RightTabs, Tabs},
    setup() {

        const hSplitterModel = ref(50);
        const cssTableHeight = ref(`calc(${100 - hSplitterModel.value}vh - 90px)`);
        const toolBarHeight = computed(() => {
            return document.querySelector('.q-toolbar').clientHeight;
        });
        const containerHeight = computed(() => {
            return `calc(100vh - ${toolBarHeight.value}px)`;
        });


        return {
            hSplitterModel,
            vSplitterModel: ref(40), // start at 50%
            cssTableHeight,
            containerHeight,
            basePath,
        };
    }
};
</script>

<style>

.h-splitter {
    height: calc(100vh)
}

.table-container {
    height: v-bind(cssTableHeight);
    font-size: 12px;
}

.left-container {
    height: v-bind(containerHeight);
    width: 100%;
    background-color: #f1ecec;
}
</style>