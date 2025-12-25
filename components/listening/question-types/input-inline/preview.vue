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
    
    // Step 1: Process optional markdown-style tags
    text = text
        .replace(/\[p\]/g, '</p><p class="mt-4">') // Paragraph break with spacing
        .replace(/\[indent\]/g, '<span class="inline-block ml-8">') // Indentation (optional)
        .replace(/\[\/indent\]/g, '</span>')
    
    // Step 2: Escape HTML to prevent XSS
    text = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    
    // Step 3: Convert natural newlines to <br>
    text = text.replace(/\n/g, '<br>')
    
    // Step 4: Replace blanks with interactive inputs
    let blankIndex = 0
    text = text.replace(/___/g, () => {
        if (blankIndex < blanks.length) {
            const blank = blanks[blankIndex]
            blankIndex++
            
            // Create styled input with question number
            return `<span class="inline-flex items-baseline gap-1 mx-1 whitespace-nowrap">
                <span class="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">${blank.questionNumber}</span>
                <input 
                    type="text" 
                    placeholder="___" 
                    maxlength="50"
                    class="border-b-2 border-gray-400 px-3 py-1 w-32 text-center focus:border-purple-600 focus:outline-none transition-colors bg-transparent"
                    autocomplete="off"
                    aria-label="Answer for question ${blank.questionNumber}"
                />
            </span>`
        }
        // Fallback for unconfigured blanks
        return '<span class="text-red-500 font-bold">___</span>'
    })
    
    return `<p class="text-gray-800 leading-relaxed">${text}</p>`
})
</script>

<style scoped>
/* Preserve line breaks and spacing */
:deep(p) {
    margin-bottom: 0;
    line-height: 1.8;
}

:deep(p + p) {
    margin-top: 1rem;
}

/* Style inputs */
:deep(input[type="text"]) {
    font-family: inherit;
    transition: all 0.2s ease;
}

:deep(input[type="text"]:focus) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(147, 51, 234, 0.1);
}

:deep(input[type="text"]:hover) {
    border-color: #9333ea;
}

/* Responsive input width */
@media (max-width: 640px) {
    :deep(input[type="text"]) {
        width: 100px;
        font-size: 0.875rem;
    }
}

/* Print styles */
@media print {
    :deep(input[type="text"]) {
        border-bottom: 2px solid #000;
        background: transparent;
    }
}
</style>