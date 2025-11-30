<template>
    <div class="w-full">
        <!-- Table -->
        <UTable :rows="filteredRows" :columns="columns" :loading="loading" :empty-state="{
            icon: emptyIcon,
            label: emptyLabel
        }" :ui="{
            wrapper: 'rounded-lg border border-gray-200 dark:border-gray-800',
            th: { base: 'text-left bg-gray-50 dark:bg-gray-800' },
            td: { base: 'whitespace-nowrap' }
        }">
            <!-- Dynamic Column Slots -->
            <template v-for="column in columns" :key="column.key" #[`${column.key}-data`]="{ row }">
                <slot :name="`column-${column.key}`" :row="row" :value="row[column.key]">
                    {{ row[column.key] }}
                </slot>
            </template>

            <!-- Actions Column -->
            <template v-if="showActions" #actions-data="{ row }">
                <slot name="actions-column" :row="row">
                    <UDropdown :items="getRowActions(row)" :popper="{ placement: 'bottom-end' }">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </slot>
            </template>

            <!-- Loading State -->
            <template #loading-state>
                <div class="flex items-center justify-center py-12">
                    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
                </div>
            </template>

            <!-- Empty State -->
            <template #empty-state>
                <div class="flex flex-col items-center justify-center py-12 text-gray-500">
                    <UIcon :name="emptyIcon" class="w-16 h-16 mb-4" />
                    <p class="text-lg font-medium">{{ emptyLabel }}</p>
                    <p v-if="emptyDescription" class="text-sm mt-2">{{ emptyDescription }}</p>
                </div>
            </template>
        </UTable>

        <!-- Pagination -->
        <div v-if="showPagination && totalPages > 1" class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">
                Showing {{ startItem }} to {{ endItem }} of {{ total }} results
            </div>
            <UPagination v-model="currentPage" :page-count="pageSize" :total="total" :max="5" :ui="{
                wrapper: 'flex items-center gap-1',
                rounded: '!rounded-lg',
                default: {
                    activeButton: { variant: 'solid' },
                    inactiveButton: { color: 'white' }
                }
            }" />
        </div>
    </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref, watch } from 'vue';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    class?: string;
}

interface ActionItem {
    label: string;
    icon?: string;
    click: (row: T) => void;
    disabled?: (row: T) => boolean;
    color?: string;
}

interface Props {
    columns: Column[];
    rows: T[];
    loading?: boolean;
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchKeys?: string[];
    showPagination?: boolean;
    pageSize?: number;
    showActions?: boolean;
    actions?: ActionItem[] | ((row: T) => ActionItem[]);
    emptyIcon?: string;
    emptyLabel?: string;
    emptyDescription?: string;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    showSearch: true,
    searchPlaceholder: 'Search...',
    searchKeys: () => [],
    showPagination: true,
    pageSize: 10,
    showActions: false,
    actions: () => [],
    emptyIcon: 'i-heroicons-inbox',
    emptyLabel: 'No data available',
    emptyDescription: ''
});

const emit = defineEmits<{
    'row-click': [row: T];
    'page-change': [page: number];
}>();

// Search
const searchQuery = ref('');

// Pagination
const currentPage = ref(1);

// Computed
const filteredRows = computed(() => {
    let result = [...props.rows];

    // Search filter
    if (searchQuery.value && props.searchKeys.length > 0) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter((row) =>
            props.searchKeys.some((key) =>
                String(row[key] || '').toLowerCase().includes(query)
            )
        );
    }

    // Pagination
    if (props.showPagination) {
        const start = (currentPage.value - 1) * props.pageSize;
        const end = start + props.pageSize;
        result = result.slice(start, end);
    }

    return result;
});

const total = computed(() => {
    if (searchQuery.value && props.searchKeys.length > 0) {
        const query = searchQuery.value.toLowerCase();
        return props.rows.filter((row) =>
            props.searchKeys.some((key) =>
                String(row[key] || '').toLowerCase().includes(query)
            )
        ).length;
    }
    return props.rows.length;
});

const totalPages = computed(() => Math.ceil(total.value / props.pageSize));

const startItem = computed(() => {
    if (total.value === 0) return 0;
    return (currentPage.value - 1) * props.pageSize + 1;
});

const endItem = computed(() => {
    const end = currentPage.value * props.pageSize;
    return Math.min(end, total.value);
});

// Get row actions
function getRowActions(row: T) {
    if (typeof props.actions === 'function') {
        return [props.actions(row).map(action => ({
            label: action.label,
            icon: action.icon,
            click: () => action.click(row),
            disabled: action.disabled ? action.disabled(row) : false
        }))];
    }
    return [props.actions.map(action => ({
        label: action.label,
        icon: action.icon,
        click: () => action.click(row),
        disabled: action.disabled ? action.disabled(row) : false
    }))];
}

// Watch page change
watch(currentPage, (newPage) => {
    emit('page-change', newPage);
});

// Reset page when search changes
watch(searchQuery, () => {
    currentPage.value = 1;
});
</script>