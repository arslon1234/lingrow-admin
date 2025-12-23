<!-- components/listening/question-types/input-inline/PreviewInputInlineMultiple.vue -->
<template>
    <div class="text-base leading-relaxed">
        <p v-html="renderTextWithBlanks"></p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['component'])

const renderTextWithBlanks = computed(() => {
    let text = props.component.config.text || ''
    const blanks = props.component.config.blanks || []
    
    // Replace each ___ with styled input
    let blankIndex = 0
    text = text.replace(/___/g, () => {
        if (blankIndex < blanks.length) {
            const blank = blanks[blankIndex]
            blankIndex++
            return `<span class="inline-flex items-baseline gap-1">
                <span class="text-sm font-bold text-gray-600">${blank.questionNumber}</span>
                <input 
                    type="text" 
                    placeholder="___" 
                    class="border-b-2 border-gray-300 px-2 py-1 w-32 focus:border-purple-500 focus:outline-none"
                />
            </span>`
        }
        return '___'
    })
    
    return text
})
</script>