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
                    <major-indexes />
                </div>
            </template>
        </q-splitter>
    </div>
</template>

<script>
import {api} from "@/plugins/http.js";
import {useMainStore} from "@/store/mainStore.js";
import {computed, onMounted, ref} from "vue";
import Tabs from "@/components/Tabs.vue";
import TopGainers from "@/components/TopGainers.vue";
import MajorIndexes from "@/components/MajorIndexes.vue";


export default {
    name: "Page1",
    components: {MajorIndexes, TopGainers, Tabs},
    setup() {

        const mainStore = useMainStore();

        const checkApiCall = async () => {
            const response = await api.get("/api/v1/");
            console.log(response);
        };


        onMounted(async () => {
            }
        );

        const hSplitterModel = ref(50);
        const cssTableHeight = ref(`calc(${100 - hSplitterModel.value}vh - 90px)`);
        const toolBarHeight = computed(() => {
            return document.querySelector('.q-toolbar').clientHeight;
        });
        const containerHeight = computed(() => {
            return `calc(100vh - ${toolBarHeight.value}px)`;
        });


        return {
            checkApiCall,
            hSplitterModel,
            vSplitterModel: ref(40), // start at 50%
            cssTableHeight,
            containerHeight,
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