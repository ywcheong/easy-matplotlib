<script setup lang="ts">
import { usePyRequestBuilder } from '@/stores/requestbuild';
import { GlobalTranslator } from '@/service/translator';
import { reactive, watch } from 'vue';

import { Button } from 'primevue';
import router from '@/router';

const builder = reactive(usePyRequestBuilder());

let myValue = reactive({ json: '', base64: '' });

watch(() => builder.pyrequest, async () => {
    const JSONStringData = await GlobalTranslator.PyRequestToJSON(builder.pyrequest);
    const Base64StringData = await GlobalTranslator.JSONToBase64(JSONStringData);
    myValue.json = JSONStringData;
    myValue.base64 = Base64StringData;
}, { deep: true });

const updateHere = async () => {
    router.push(`/editor/${myValue.base64}`);
};

</script>

<template>
    <p>This is `RenderCodeDisplay`</p>
    <p id="cmpt" class="text-theme-purple w-2/3">{{ myValue.json }}</p>
    <p id="cmpt" class="text-theme-teal w-2/3 break-words">{{ myValue.base64 }}</p>
    <Button label="Update" @click="updateHere" />
</template>