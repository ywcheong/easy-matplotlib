<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import RenderDisplay from '@components/render/RenderDisplay.vue';
import EditorFormDisplay from '@components/form/FormDisplay.vue';

// Make sync route.params.base64Data ~ builder.value
import { usePyRequestBuilder } from '@/stores/requestbuild';
import { useRoute, useRouter } from 'vue-router';
import { watch } from 'vue';

import { GlobalTranslator } from '@/service/translator';
import { MessageManager, ConsoleMessageChannel } from "@/service/message";
import { DirectToastMessageChannel } from "@/service/message.toast";

const builder = usePyRequestBuilder();
const route = useRoute();
const router = useRouter();

// At the first time, set the base64Data to builder
// route.params.base64Data -> builder.pyrequest
if (route.params.base64Data) {
    const messageManager = new MessageManager();
    messageManager.addChannel(new DirectToastMessageChannel());
    messageManager.addChannel(new ConsoleMessageChannel());
    messageManager.sendInfo(`URL Data Detected`, `Loading data from URL...`);

    const base64Data = route.params.base64Data as string;
    GlobalTranslator.Base64ToJSON(base64Data).then(async jsonString => {
        await new Promise(resolve => setTimeout(resolve, 500));
        try{
            const pyRequest = await GlobalTranslator.JSONToPyRequest(jsonString);
            builder.updatePyRequest(pyRequest);
            messageManager.sendSuccess(`URL Data Loaded`, `Data loaded successfully.`);
        } catch (err) {
            messageManager.sendError(`URL Data Error`, `${err}`);
        }
    }).catch(err => {
        messageManager.sendError(`URL Data Error`, `${err}`);
    });
}

// builder.pyrequest.getBase64 -> route.params.base64Data
watch(() => builder.getBase64, async (base64StingData) => {
    router.push(`/editor/${await base64StingData}`);
});

</script>

<template>
    <Splitter>
        <SplitterPanel :min-size="20">
            <RenderDisplay />
        </SplitterPanel>
        <SplitterPanel class="editor-area" :min-size="20">
            <EditorFormDisplay />
        </SplitterPanel>
    </Splitter>
</template>

<style scoped>
.editor-area {
    overflow: auto !important;
}
</style>
