<!-- components/listening/question-types/input-inline/PreviewInputInlineMultiple.vue -->
<template>
    <div class="text-base leading-relaxed">
        <div v-html="renderTextWithBlanks" class="prose prose-purple max-w-none"></div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['component'])

const renderTextWithBlanks = computed(() => {
    let text = props.component.config.text || ''
    const blanks = props.component.config.blanks || []
    // const isRichText = props.component.config.useRichEditor || false

    // If not rich text, process as before
    // if (!isRichText) {
    //     text = text
    //         .replace(/&/g, '&amp;')
    //         .replace(/</g, '&lt;')
    //         .replace(/>/g, '&gt;')
    //         .replace(/\n/g, '<br>')
    // }
    // If rich text, HTML is already formatted - just use it

    // Replace blanks with inputs
    let blankIndex = 0
    text = text.replace(/___/g, () => {
        if (blankIndex < blanks.length) {
            const blank = blanks[blankIndex++]
            return `<span class="inline-flex items-baseline gap-1 mx-1 whitespace-nowrap">
                <span class="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">${blank.questionNumber}</span>
                <input 
                    type="text" 
                    placeholder="___" 
                    maxlength="50"
                    class="border-b-2 border-gray-400 px-3 py-1 w-32 text-center focus:border-purple-600 focus:outline-none"
                    autocomplete="off"
                />
            </span>`
        }
        return '<span class="text-red-500">___</span>'
    })

    // return isRichText ? text : `<p>${text}</p>`
    return `<p>${text}</p>`
})
</script>

<style scoped>
:deep(h3) {
    font-size: 1.25rem;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

:deep(strong) {
    font-weight: 700;
}

:deep(ul) {
    list-style: disc;
    margin-left: 1.5rem;
}
</style>