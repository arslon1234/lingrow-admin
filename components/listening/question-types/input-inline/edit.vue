<!-- components/listening/question-types/input-inline/EditInputInlineMultiple.vue -->
<template>
    <div class="space-y-3">
        <!-- Rich Text Editor Mode -->
        <div class="">
            <label class="text-sm font-medium text-gray-700">Text with Blanks (Rich Editor)</label>
            
            <!-- Editor Toolbar -->
            <div v-if="editor" class="border border-gray-300 rounded-t-lg bg-gray-50 p-2 space-y-2">
                <!-- Row 1: Text Formatting -->
                <div class="flex flex-wrap gap-1">
                    <UButton 
                        @click="editor.chain().focus().toggleBold().run()"
                        :color="editor.isActive('bold') ? 'primary' : 'gray'"
                        :variant="editor.isActive('bold') ? 'solid' : 'soft'"
                        size="xs"
                        title="Bold (Ctrl+B)">
                        <UIcon name="i-heroicons-bold" class="w-4 h-4" />
                    </UButton>
                    
                    <UButton 
                        @click="editor.chain().focus().toggleItalic().run()"
                        :color="editor.isActive('italic') ? 'primary' : 'gray'"
                        :variant="editor.isActive('italic') ? 'solid' : 'soft'"
                        size="xs"
                        title="Italic (Ctrl+I)">
                        <UIcon name="i-heroicons-italic" class="w-4 h-4" />
                    </UButton>

                    <UButton 
                        @click="editor.chain().focus().toggleUnderline().run()"
                        :color="editor.isActive('underline') ? 'primary' : 'gray'"
                        :variant="editor.isActive('underline') ? 'solid' : 'soft'"
                        size="xs"
                        title="Underline (Ctrl+U)">
                        <span class="text-xs font-bold underline">U</span>
                    </UButton>

                    <UButton 
                        @click="editor.chain().focus().toggleStrike().run()"
                        :color="editor.isActive('strike') ? 'primary' : 'gray'"
                        :variant="editor.isActive('strike') ? 'solid' : 'soft'"
                        size="xs"
                        title="Strikethrough">
                        <span class="text-xs font-bold line-through">S</span>
                    </UButton>

                    <UDivider orientation="vertical" class="h-6" />

                    <!-- Headings Dropdown -->
                    <UPopover>
                        <UButton 
                            size="xs"
                            :color="editor.isActive('heading') ? 'primary' : 'gray'"
                            :variant="editor.isActive('heading') ? 'solid' : 'soft'"
                            trailing-icon="i-heroicons-chevron-down">
                            <UIcon name="i-heroicons-bars-3" class="w-4 h-4" />
                            {{ getActiveHeading() }}
                        </UButton>
                        <template #panel>
                            <div class="p-2 space-y-1 w-48">
                                <UButton 
                                    @click="editor.chain().focus().setParagraph().run()"
                                    :color="editor.isActive('paragraph') ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    Normal Text
                                </UButton>
                                <UButton 
                                    @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                                    :color="editor.isActive('heading', { level: 1 }) ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <span class="text-xl font-bold">Heading 1</span>
                                </UButton>
                                <UButton 
                                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                                    :color="editor.isActive('heading', { level: 2 }) ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <span class="text-lg font-bold">Heading 2</span>
                                </UButton>
                                <UButton 
                                    @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                                    :color="editor.isActive('heading', { level: 3 }) ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <span class="text-base font-bold">Heading 3</span>
                                </UButton>
                                <UButton 
                                    @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                                    :color="editor.isActive('heading', { level: 4 }) ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <span class="text-sm font-bold">Heading 4</span>
                                </UButton>
                            </div>
                        </template>
                    </UPopover>

                    <UDivider orientation="vertical" class="h-6" />

                    <!-- Lists -->
                    <UPopover>
                        <UButton 
                            size="xs"
                            :color="editor.isActive('bulletList') || editor.isActive('orderedList') ? 'primary' : 'gray'"
                            :variant="editor.isActive('bulletList') || editor.isActive('orderedList') ? 'solid' : 'soft'"
                            trailing-icon="i-heroicons-chevron-down">
                            <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
                        </UButton>
                        <template #panel>
                            <div class="p-2 space-y-1 w-48">
                                <UButton 
                                    @click="editor.chain().focus().toggleBulletList().run()"
                                    :color="editor.isActive('bulletList') ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <UIcon name="i-heroicons-list-bullet" class="w-4 h-4 mr-2" />
                                    Bullet List
                                </UButton>
                                <UButton 
                                    @click="editor.chain().focus().toggleOrderedList().run()"
                                    :color="editor.isActive('orderedList') ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <span class="mr-2">1.</span>
                                    Numbered List
                                </UButton>
                            </div>
                        </template>
                    </UPopover>

                    <UDivider orientation="vertical" class="h-6" />

                    <!-- Alignment -->
                    <UPopover>
                        <UButton 
                            size="xs"
                            color="gray"
                            variant="soft"
                            trailing-icon="i-heroicons-chevron-down">
                            <UIcon name="i-heroicons-bars-3-bottom-left" class="w-4 h-4" />
                        </UButton>
                        <template #panel>
                            <div class="p-2 space-y-1 w-40">
                                <UButton 
                                    @click="editor.chain().focus().setTextAlign('left').run()"
                                    :color="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <UIcon name="i-heroicons-bars-3-bottom-left" class="w-4 h-4 mr-2" />
                                    Left
                                </UButton>
                                <UButton 
                                    @click="editor.chain().focus().setTextAlign('center').run()"
                                    :color="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <UIcon name="i-heroicons-bars-3" class="w-4 h-4 mr-2" />
                                    Center
                                </UButton>
                                <UButton 
                                    @click="editor.chain().focus().setTextAlign('right').run()"
                                    :color="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'gray'"
                                    variant="ghost"
                                    size="xs"
                                    block
                                    class="justify-start">
                                    <UIcon name="i-heroicons-bars-3-bottom-right" class="w-4 h-4 mr-2" />
                                    Right
                                </UButton>
                            </div>
                        </template>
                    </UPopover>

                    <UDivider orientation="vertical" class="h-6" />

                    <!-- Insert Blank -->
                    <UButton 
                        @click="insertBlank"
                        color="purple"
                        variant="solid"
                        size="xs"
                        title="Insert answer blank">
                        <UIcon name="i-heroicons-plus-circle" class="w-4 h-4 mr-1" />
                        Blank
                    </UButton>

                    <UDivider orientation="vertical" class="h-6" />

                    <!-- Undo/Redo -->
                    <UButton 
                        @click="editor.chain().focus().undo().run()"
                        :disabled="!editor.can().undo()"
                        color="gray"
                        variant="soft"
                        size="xs"
                        title="Undo (Ctrl+Z)">
                        <UIcon name="i-heroicons-arrow-uturn-left" class="w-4 h-4" />
                    </UButton>
                    <UButton 
                        @click="editor.chain().focus().redo().run()"
                        :disabled="!editor.can().redo()"
                        color="gray"
                        variant="soft"
                        size="xs"
                        title="Redo (Ctrl+Y)">
                        <UIcon name="i-heroicons-arrow-uturn-right" class="w-4 h-4" />
                    </UButton>

                    <UDivider orientation="vertical" class="h-6" />

                    <!-- Clear Formatting -->
                    <UButton 
                        @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
                        color="red"
                        variant="soft"
                        size="xs"
                        title="Clear formatting">
                        <UIcon name="i-heroicons-x-circle" class="w-4 h-4" />
                    </UButton>
                </div>
            </div>

            <!-- Editor Content -->
            <div class="border border-gray-300 rounded-b-lg bg-white">
                <EditorContent :editor="editor" />
            </div>

            <div class="flex items-center gap-2 text-xs text-gray-500">
                <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
                <span>Use toolbar for formatting. Type ___ or click "Insert Blank" for answer blanks.</span>
            </div>
        </div>

        <!-- Blanks Configuration -->
        <div class="space-y-2">
            <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">
                    Blanks Configuration
                    <UBadge v-if="blanks.length > 0" color="purple" variant="soft" size="xs" class="ml-2">
                        {{ blanks.length }} blank{{ blanks.length > 1 ? 's' : '' }}
                    </UBadge>
                </label>
                <UButton 
                    icon="i-heroicons-arrow-path" 
                    size="xs" 
                    variant="soft" 
                    color="purple"
                    @click="syncBlanksWithText">
                    Sync
                </UButton>
            </div>

            <div v-for="(blank, idx) in blanks" :key="blank.id"
                class="grid grid-cols-12 gap-2 items-end p-3 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-100">
                
                <UFormGroup label="Q#" size="md" class="col-span-2">
                    <UInput 
                        type="number" 
                        :model-value="String(blank.questionNumber)"
                        @update:model-value="updateBlankField(idx, 'questionNumber', $event)" 
                        size="sm"
                        icon="i-heroicons-hashtag" 
                    />
                </UFormGroup>

                <UFormGroup label="Correct Answer" size="md" class="col-span-8">
                    <UInput 
                        :model-value="blank.correctAnswer"
                        @update:model-value="updateBlankField(idx, 'correctAnswer', $event)"
                        placeholder="Enter correct answer..." 
                        icon="i-heroicons-check-circle"
                        :color="blank.correctAnswer ? 'green' : 'gray'" 
                        size="sm" 
                    />
                </UFormGroup>

                <div class="col-span-2 flex justify-end">
                    <UPopover :popper="{ placement: 'left' }">
                        <UButton icon="i-heroicons-plus-circle" size="md" color="gray">
                            <template #trailing>
                                <UBadge 
                                    v-if="(blank.alternativeAnswers || []).length > 0" 
                                    color="purple" 
                                    size="xs">
                                    {{ (blank.alternativeAnswers || []).length }}
                                </UBadge>
                            </template>
                        </UButton>

                        <template #panel>
                            <div class="p-4 w-72 space-y-3">
                                <div class="flex items-center justify-between">
                                    <label class="text-sm font-semibold">Alternatives</label>
                                    <UBadge color="gray" variant="soft" size="xs">Optional</UBadge>
                                </div>

                                <div v-if="(blank.alternativeAnswers || []).length === 0"
                                    class="text-center py-4 text-gray-500 text-sm">
                                    <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p>No alternatives yet</p>
                                </div>

                                <div v-for="(alt, altIdx) in (blank.alternativeAnswers || [])" :key="altIdx" class="flex gap-2">
                                    <UInput 
                                        :model-value="alt"
                                        @update:model-value="updateAlternativeAnswer(idx, altIdx, $event)" 
                                        size="sm"
                                        placeholder="Alternative..." 
                                        class="flex-1" 
                                    />
                                    <UButton 
                                        icon="i-heroicons-trash" 
                                        size="sm" 
                                        color="red" 
                                        variant="soft"
                                        @click="removeAlternativeAnswer(idx, altIdx)" 
                                    />
                                </div>

                                <UButton 
                                    icon="i-heroicons-plus" 
                                    size="sm" 
                                    block 
                                    variant="outline"
                                    @click="addAlternativeAnswer(idx)">
                                    Add Alternative
                                </UButton>
                            </div>
                        </template>
                    </UPopover>
                </div>
            </div>

            <UAlert 
                v-if="blanks.length !== detectedBlanksCount" 
                icon="i-heroicons-exclamation-triangle"
                color="amber" 
                variant="soft"
                :title="`Mismatch: ${detectedBlanksCount} blanks in text, ${blanks.length} configured`" 
            />

            <UAlert 
                v-else-if="blanks.length > 0 && allBlanksConfigured" 
                icon="i-heroicons-check-circle"
                color="green" 
                variant="soft" 
                :title="`All ${blanks.length} blanks configured!`" 
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useListeningStore } from '~/store/listening'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const listeningStore = useListeningStore()
const props = defineProps(['component'])

const blanks = ref(props.component.config.blanks || [])
const useRichEditor = ref(props.component.config.useRichEditor || false)

// TipTap Editor
const editor = useEditor({
    extensions: [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3, 4]
            }
        }),
        // Underline,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
            placeholder: 'Start typing... Use ___ for answer blanks'
        })
    ],
    content: props.component.config.text || '',
    editorProps: {
        attributes: {
            class: 'prose prose-sm max-w-none focus:outline-none min-h-[250px] p-4'
        }
    },
    onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        updateText(html)
    }
})

// Get active heading level
const getActiveHeading = () => {
    if (!editor.value) return 'Normal'
    if (editor.value.isActive('heading', { level: 1 })) return 'H1'
    if (editor.value.isActive('heading', { level: 2 })) return 'H2'
    if (editor.value.isActive('heading', { level: 3 })) return 'H3'
    if (editor.value.isActive('heading', { level: 4 })) return 'H4'
    return 'Normal'
}

// Insert blank at cursor
const insertBlank = () => {
    editor.value?.chain().focus().insertContent('___').run()
}

// Detect blanks
const detectedBlanksCount = computed(() => {
    const text = props.component.config.text || ''
    return (text.match(/___/g) || []).length
})

// Check if all configured
const allBlanksConfigured = computed(() => {
    return blanks.value.every((blank: any) =>
        blank.questionNumber && blank.correctAnswer?.trim()
    )
})

// Update text
const updateText = (newText: string) => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        text: newText,
        useRichEditor: useRichEditor.value
    })

    const newBlankCount = (newText.match(/___/g) || []).length
    if (Math.abs(newBlankCount - blanks.value.length) > 2) {
        syncBlanksWithText()
    }
}

// Sync blanks
const syncBlanksWithText = () => {
    const blankCount = detectedBlanksCount.value
    const currentBlanks = [...blanks.value]

    if (blankCount > currentBlanks.length) {
        const lastQNum = currentBlanks.length > 0
            ? Number(currentBlanks[currentBlanks.length - 1].questionNumber)
            : Number(props.component.config.questionNumber || 1) - 1

        for (let i = currentBlanks.length; i < blankCount; i++) {
            currentBlanks.push({
                id: Date.now() + i,
                questionNumber: lastQNum + (i - currentBlanks.length + 1),
                correctAnswer: '',
                alternativeAnswers: []
            })
        }
    } else if (blankCount < currentBlanks.length) {
        currentBlanks.splice(blankCount)
    }

    blanks.value = currentBlanks
    saveBlanks()
}

// Update blank field - FIX: accept string or number
const updateBlankField = (index: number | string, field: string, value: string | number) => {
    if (field === 'questionNumber') {
        blanks.value[index][field] = typeof value === 'string' ? parseInt(value) || 0 : value
    } else {
        blanks.value[index][field] = value
    }
    saveBlanks()
}

const addAlternativeAnswer = (blankIndex: number | string) => {
    if (!blanks.value[blankIndex].alternativeAnswers) {
        blanks.value[blankIndex].alternativeAnswers = []
    }
    blanks.value[blankIndex].alternativeAnswers.push('')
    saveBlanks()
}

const updateAlternativeAnswer = (blankIndex: number | string, altIndex: number | string, value: string) => {
    blanks.value[blankIndex].alternativeAnswers[altIndex] = value
    saveBlanks()
}

const removeAlternativeAnswer = (blankIndex: number | string, altIndex: number | string) => {
    blanks.value[blankIndex].alternativeAnswers.splice(altIndex, 1)
    saveBlanks()
}

const saveBlanks = () => {
    listeningStore.updateComponent(props.component.id, {
        ...props.component.config,
        blanks: blanks.value
    })
}

watch(() => props.component.config.blanks, (newBlanks) => {
    if (newBlanks) {
        blanks.value = newBlanks
    }
}, { deep: true })

onMounted(() => {
    if (detectedBlanksCount.value > 0 && blanks.value.length === 0) {
        syncBlanksWithText()
    }
})

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<style scoped>
/* TipTap Editor Custom Styles */
:deep(.ProseMirror) {
    min-height: 250px;
    outline: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
}

/* Headings */
:deep(.ProseMirror h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    line-height: 1.2;
}

:deep(.ProseMirror h2) {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 1.25rem;
    margin-bottom: 0.625rem;
    line-height: 1.3;
}

:deep(.ProseMirror h3) {
    font-size: 1.25rem;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

:deep(.ProseMirror h4) {
    font-size: 1.125rem;
    font-weight: 700;
    margin-top: 0.875rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

/* Text formatting */
:deep(.ProseMirror strong) {
    font-weight: 700;
}

:deep(.ProseMirror em) {
    font-style: italic;
}

:deep(.ProseMirror u) {
    text-decoration: underline;
}

:deep(.ProseMirror s) {
    text-decoration: line-through;
}

/* Lists - FIX: Reduce spacing */
:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

:deep(.ProseMirror ul li),
:deep(.ProseMirror ol li) {
    margin-bottom: 0.25rem; /* Reduced from default */
    line-height: 1.6;
}

:deep(.ProseMirror ul) {
    list-style-type: disc;
}

:deep(.ProseMirror ul ul) {
    list-style-type: circle;
    margin-top: 0.25rem;
}

:deep(.ProseMirror ul ul ul) {
    list-style-type: square;
}

:deep(.ProseMirror ol) {
    list-style-type: decimal;
}

:deep(.ProseMirror ol ol) {
    list-style-type: lower-alpha;
    margin-top: 0.25rem;
}

/* Paragraphs */
:deep(.ProseMirror p) {
margin-top: 0.5rem;
margin-bottom: 0.5rem;
line-height: 1.7;
}
:deep(.ProseMirror p:first-child) {
margin-top: 0;
}
:deep(.ProseMirror [style="text-align: center"]) {
text-align: center;
}
:deep(.ProseMirror [style*="text-align: right"]) {
text-align: right;
}
:deep(.ProseMirror [style*="text-align: left"]) {
text-align: left;
}
</style>