<template>
	<div :class="ui.wrapper" v-bind="attrs">
		<div :class="[ui.base, ui.divide]">
			<slot v-if="$slots.caption || caption" name="caption">
				<caption :class="ui.caption">
					{{
						caption
					}}
				</caption>
			</slot>
			<div :class="ui.thead">
				<div
					:class="[ui.tr.base, 'dark:hover:!bg-[#292A2C] grid grid-cols-[2%_4%_11%_8%_12%_15%_1fr_1fr_1fr_1fr_4%_7%_145px]']">
					<div v-if="modelValue" scope="col" class="flex items-center justify-center w-full"
						:class="[ui.checkbox.padding, 'border-b border-grey-border dark:border-white/[0.08]']">
						<UCheckbox :model-value="indeterminate || selected?.length > 0" class="z-10"
							:indeterminate="indeterminate" v-bind="ui.default.checkbox" aria-label="Select all"
							@change="onChange" />
					</div>

					<div v-for="(column, index) in columns" :key="index" scope="col"
						:class="[ui.th.base, ui.th.padding, ui.th.color, ui.th.font, ui.th.size, column.class]"
						:aria-sort="getAriaSort(column)">
						<slot :name="`${column.key}-header`" :column="column" :sort="sort" :on-sort="onSort">
							<UButton v-if="column.sortable" v-bind="{ ...(ui.default.sortButton || {}), ...sortButton }"
								:icon="!sort.column || sort.column !== column.key ? sortButton.icon || ui.default.sortButton.icon : sort.direction === 'asc' ? sortAscIcon : sortDescIcon"
								:label="column[columnAttribute]" @click="onSort(column)"
								:ui="{ base: '!text-xl px-2 py-1' }" />
							<span v-else>{{ column[columnAttribute] }}</span>
						</slot>
					</div>
				</div>

				<div v-if="loading && progress">
					<div :colspan="0" :class="ui.progress.wrapper">
						<UProgress v-bind="{ ...(ui.default.progress || {}), ...progress }" size="2xs" />
					</div>
				</div>
			</div>
			<div :class="['divide-grey-border/[.5] dark:divide-white/[0.05] [&>tr]:duration-200 ']">
				<div v-if="loadingState && loading && !rows.length">
					<div :colspan="columns.length + (modelValue ? 1 : 0) + ($slots.expand ? 1 : 0)">
						<slot name="loading-state">
							<div :class="ui.loadingState.wrapper">
								<UIcon v-if="loadingState.icon" :name="loadingState.icon" :class="ui.loadingState.icon"
									aria-hidden="true" />
								<p :class="ui.loadingState.label">
									{{ loadingState.label }}
								</p>
							</div>
						</slot>
					</div>
				</div>

				<div v-else-if="emptyState && !rows.length">
					<div :colspan="columns.length + (modelValue ? 1 : 0) + ($slots.expand ? 1 : 0)">
						<slot name="empty-state">
							<div :class="ui.emptyState.wrapper">
								<UIcon v-if="emptyState.icon" :name="emptyState.icon" :class="ui.emptyState.icon"
									aria-hidden="true" />
								<p :class="ui.emptyState.label">
									{{ emptyState.label }}
								</p>
							</div>
						</slot>
					</div>
				</div>

				<template v-else>
					<RecycleScroller ref="scroller" page-mode :items="rows" :item-size="53" :key-field="'id'"
						:key="scrollerKey" :buffer="1000">
						<template v-slot="{ item, index }">
							<div v-if="seenEventsHeader && item?.type === 'group'"
								:class="[ui.tr.base, isSelected(item) && ui.tr.selected, $attrs.onSelect && ui.tr.active, item?.class]"
								@click="() => toggleOpened(index)"
								class="text-black bg-purple/[.1] !cursor-pointer hover:bg-purple/[.15] text-sm dark:text-white/[0.6] dark:!bg-dark-timer-0/[.1] grid grid-cols-[2%_15%_20%_15%_1fr_minmax(0,calc(3/7*100%+4%))_7%_145px]">
								<div v-if="$slots.expand"
									:class="[ui.td.padding, ui.td.font, ui.td.size, 'ps-6 flex items-center justify-center']">
									<UButton size="sm" v-bind="{ ...(ui.default.expandButton || {}), ...expandButton }"
										:ui="{
											base: 'dark:hover:!bg-dark-timer-0/[.1]'
										}" @click.capture.stop="toggleOpened(index)">
										<template #leading>
											<ChevronDownIcon
												class="text-black stroke-[.6px] dark:text-white/[0.6] w-4 h-4 duration-200"
												:class="[(!openedRows || openedRows.length == 0) && 'rotate-180']" />
										</template>
									</UButton>
								</div>
								<!-- <div class="flex-1 flex items-center whitespace-nowrap !font-medium"
									:class="[ui.td.padding, ui.td.font, ui.td.size]">
									{{ item.date }}
								</div> -->
								<div class="flex items-center justify-between w-full whitespace-nowrap !font-medium group"
									:class="[ui.td.padding, ui.td.font, ui.td.size]">
									<div class="flex items-center mr-2">
										<ChevronDownIcon
											class="text-black stroke-[.6px] dark:text-white/[0.6] w-4 h-4 duration-200 group-hover:text-purple dark:group-hover:text-purple"
											:class="[(!openedRows || openedRows.length == 0 || !openedRows.includes(index)) && 'rotate-180']" />
									</div>
									<span class="flex-1">{{ item.date }}</span>
								</div>
								<div class="flex-1 flex gap-x-2 items-center justify-end"
									:class="[ui.td.padding, ui.td.font, ui.td.size]">
									<TrailerIcon class="text-purple w-6 dark:text-purple" />
									<p>{{ item?.dailyForm?.trailers.join(', ') }}</p>
								</div>
								<div class="flex-1 flex gap-x-2 items-center justify-end"
									:class="[ui.td.padding, ui.td.font, ui.td.size]">
									<FileIcon class="text-purple w-4 h-4 dark:text-purple" />
									<p>{{ item?.dailyForm?.shippingDocuments.join(', ') }}</p>
								</div>
								<div class="flex-1 flex items-center gap-x-2 !font-medium"
									:class="[ui.td.padding, ui.td.font, ui.td.size]">
									<UsersIcon class="text-purple w-4 h-4 dark:text-purple" />
									<p>{{ item?.dailyForm?.hasCoDriver ? 'Yes' : 'No' }}</p>
								</div>
								<div class="flex-1" :class="[ui.td.padding, ui.td.font, ui.td.size]"></div>
								<div class="flex-1" :class="[ui.td.padding, ui.td.font, ui.td.size]"></div>
								<div :class="[ui.td.padding, ui.td.font, ui.td.size]"
									class="flex items-center justify-center !font-medium">
									<p v-if="item?.dailyForm?.isCertified"
										class="text-green-3 dark:text-green-3 text-center">Signed</p>
									<p v-else class="text-red-0 dark:text-red-0 text-center">Unsigned</p>
								</div>
								<div class="flex-1 flex items-center" :class="[ui.td.padding, ui.td.font, ui.td.size]">
									<UButton :disabled="disabledActions"
										@click.capture.stop="emit('editEvents', item?.date)" size="sm" variant="soft"
										:ui="{ variant: { soft: 'bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent' } }">
										<template #leading>
											<PencilIcon class="text-purple h-3.5 w-3.5 dark:text-purple" />
										</template>
									</UButton>
								</div>
							</div>
							<div v-else-if="$props.filterTable != 2 && openedRows.length > 0 && seenEvents && item?.type === 'event'"
								:class="[
									ui.tr.base,
									isSelected(item) && ui.tr.selected,
									$attrs.onSelect && ui.tr.active,
									item?.class,
									'grid grid-cols-[2%_4%_11%_8%_12%_15%_1fr_1fr_1fr_1fr_4%_7%_145px]',
									item.status == 4 && 'opacity-55'
								]" @click="() => onSelect(item)" :data-id="item.id" @mouseenter="
									(ent) => {
										if (!isSelected(ent)) {
											if (item?.errorTitles?.length > 0) {
												ent.target.classList.add('bg-red-0/[.3]', 'dark:bg-red-0/[.2]');
											} else if (item?.warningTitles?.length > 0) {
												ent.target.classList.add('bg-yellow-1/[.3]', 'dark:bg-yellow-1/[.2]');
											} else {
												ent.target.classList.add('bg-purple/[.20]', 'dark:bg-white/[.20]');
											}
										}
									}
								" @mouseleave="
									(ent) => {
										if (!isSelected(ent)) {
											if (item?.errorTitles?.length > 0) {
												ent.target.classList.remove('bg-red-0/[.3]', 'dark:bg-red-0/[.2]');
											} else if (item?.warningTitles?.length > 0) {
												ent.target.classList.remove('bg-yellow-1/[.3]', 'dark:bg-yellow-1/[.2]');
											} else {
												ent.target.classList.remove('bg-purple/[.20]', 'dark:bg-white/[.20]');
											}
										}
									}
								" @mousedown="handleMouseDown" @contextmenu.prevent>
								<div v-if="modelValue" :class="[
									ui.checkbox.padding,
									'border-b border-grey-border dark:border-white/[0.08] last:border-b-0 flex items-center justify-center',
									rows[index - 1]?.type === 'group' && 'border-t',
									rows[index + 1]?.type === 'group' && 'border-b-0'
								]">
									<UCheckbox :model-value="isSelected(item)"
										@update:model-value="(checked) => toggleSelect(item, checked)" :value="item"
										v-bind="ui.default.checkbox" aria-label="Select row"
										@click.capture.stop="() => onSelect(item)" />
								</div>
								<div v-for="(column, subIndex) in columns" :key="subIndex" :class="[
									ui.td.base,
									ui.td.padding,
									ui.td.color,
									ui.td.font,
									ui.td.size,
									column?.rowClass,
									'whitespace-normal',
									'flex items-center',
									subIndex == 10 && 'justify-center',
									subIndex == 8 && 'truncate'
								]">
									<slot :name="`${column.key}-data`" :column="column" :row="item" :index="subIndex"
										:get-row-data="(defaultValue) => `${item.actionState} ${getRowData(item, column.key, defaultValue)}`">
										<div v-if="getRowData(item, column.key) && (subIndex === 8 || subIndex == 4)"
											class="relative w-full h-full text-left flex align-center">
											<UTooltip :content="{
												side: 'top',
												sideOffset: 1
											}" :open-delay="200" :ui="{
												background: 'bg-purple/[.2] dark:bg-white/[.1]',
												color: 'black',
												width: 'w-fit max-w-fit',
												rounded: 'before:rounded-lg',
												text: 'text-lg'
											}" :popper="{ placement: 'top-start' }" :text="getRowData(item, column.key)">
												<p class="truncate w-full h-full flex items-center"
													:class="{ 'w-[13vw]': subIndex == 4 }">{{
														getRowData(item, column.key) }}</p>
											</UTooltip>
										</div>

										<template v-else>
											{{ getRowData(item, column.key) }}
										</template>
									</slot>
									<UTooltip v-if="item?.warningTitles?.length || item?.errorTitles?.length"
										:open-delay="200" :ui="{
											background: item?.errorTitles?.length ? 'bg-red-0 dark:bg-red-0' : 'bg-yellow-1 dark:bg-yellow-1',
											color: 'text-white',
											width: 'w-fit max-w-fit',
											ring: item?.errorTitles?.length ? 'ring-red-0 dark:ring-red-0' : 'ring-yellow-1 dark:ring-yellow-1',
											arrow: {
												ring: item?.errorTitles?.length ? 'before:ring-red-0 dark:before:ring-red-0' : 'before:ring-yellow-1 dark:before:ring-yellow-1',
												background: item?.errorTitles?.length ? 'before:bg-red-0 dark:before:bg-red-0' : 'before:bg-yellow-1 dark:before:bg-yellow-1',
												placement: `!left-1/2 !-translate-x-1/2`
											},
											rounded: 'before:rounded-lg'
										}" :popper="{ placement: 'top-start', arrow: true }" class="absolute left-0 bottom-0 w-full h-full z-1" :text="(item?.errorTitles?.length ? item.errorTitles.join(' | ') : '') +
											(item?.warningTitles?.length ? (item?.errorTitles?.length ? ' | ' : '') + item?.warningTitles.join(' | ') : '') 
											">
										&nbsp;
									</UTooltip>
								</div>
							</div>
						</template>
					</RecycleScroller>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import ChevronDownIcon from '~/assets/icons/chevron-down.svg';
import PencilIcon from '~/assets/icons/edit-01.svg';
import FileIcon from '~/assets/icons/file-06.svg';
import TrailerIcon from '~/assets/icons/trailer.svg';
import UsersIcon from '~/assets/icons/users-01.svg';

import appConfig from '#build/app.config';
import { table } from '#ui/ui.config';
import { useVModel } from '@vueuse/core';
import { defu } from 'defu';
import { upperFirst } from 'scule';
import { computed, defineComponent, ref, toRef } from 'vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { useUI } from '~/node_modules/@nuxt/ui/dist/runtime/composables/useUI';
import { get, mergeConfig } from '~/node_modules/@nuxt/ui/dist/runtime/utils';

// uuid

const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.table, table);

function defaultComparator(a, z) {
	return a === z;
}

function defaultSort(a, b, direction) {
	if (a === b) {
		return 0;
	}
	if (direction === 'asc') {
		return a < b ? -1 : 1;
	} else {
		return a > b ? -1 : 1;
	}
}

export default defineComponent({
	inheritAttrs: false,
	props: {
		modelValue: {
			type: Array,
			default: null
		},
		by: {
			type: [String, Function],
			default: () => defaultComparator
		},
		rows: {
			type: Array,
			default: () => []
		},
		columns: {
			type: Array,
			default: null
		},
		columnAttribute: {
			type: String,
			default: 'label'
		},
		sort: {
			type: Object,
			default: () => ({})
		},
		sortMode: {
			type: String,
			default: 'auto'
		},
		sortButton: {
			type: Object,
			default: () => config.default.sortButton
		},
		sortAscIcon: {
			type: String,
			default: () => config.default.sortAscIcon
		},
		sortDescIcon: {
			type: String,
			default: () => config.default.sortDescIcon
		},
		expandButton: {
			type: Object,
			default: () => config.default.expandButton
		},
		loading: {
			type: Boolean,
			default: false
		},
		loadingState: {
			type: Object,
			default: () => config.default.loadingState
		},
		emptyState: {
			type: Object,
			default: () => config.default.emptyState
		},
		caption: {
			type: String,
			default: null
		},
		progress: {
			type: Object,
			default: () => config.default.progress
		},
		class: {
			type: [String, Object, Array],
			default: () => ''
		},
		ui: {
			type: Object,
			default: () => ({})
		},
		filterTable: {
			type: Number,
			default: 0
		},
		disabledActions: {
			type: Boolean,
			default: false
		}
	},

	components: { TrailerIcon, FileIcon, UsersIcon, PencilIcon, ChevronDownIcon, RecycleScroller },
	emits: ['update:modelValue', 'update:sort', 'editEvents', 'selectedRowEvent', 'toggleEvents', 'toggle-events'],
	setup(props, { emit, attrs: $attrs, expose }) {
		const { ui, attrs } = useUI('table', toRef(props, 'ui'), config, toRef(props, 'class'));
		const columns = computed(
			() =>
				props.columns ??
				Object.keys(props.rows[0] ?? {}).map((key) => ({
					key,
					label: upperFirst(key),
					sortable: false,
					class: void 0,
					sort: defaultSort
				}))
		);
		const sort = useVModel(props, 'sort', emit, {
			passive: true,
			defaultValue: defu({}, props.sort, { column: null, direction: 'asc' })
		});
		const scroller = ref();
		const scrollerKey = ref(0);
		const openedRows = ref([]);
		const savedSort = { column: sort.value.column, direction: null };

		const seenEventsHeader = computed(() => props.filterTable !== 1);
		const seenEvents = computed(() => props.filterTable !== 2);
		const modelValueRef = toRef(props, 'modelValue');
		const rows = computed(() => {
			if (!sort.value?.column || props.sortMode === 'manual') {
				return props.rows.flatMap((item, index) => {
					const groupId = `group-${index}`;

					const group = {
						id: groupId,
						date: item.date,
						dailyForm: item.dailyForm,
						type: 'group'
					};

					const events = (item.events || []).map((event) => ({
						...event,
						id: event.id || `event-${index}-${eventIndex}`,
						type: 'event'
					}));

					// return [group, ...events]

					if (props.filterTable == 2) {
						return [group];
					} else if (seenEventsHeader.value) {
						if (openedRows.value.includes(index)) {
							return [group, ...events];
						}
						return [group];
					} else if (seenEvents.value) {
						return [...events];
					}
				});
			}
			const { column, direction } = sort.value;
			return props.rows.slice().sort((a, b) => {
				const aValue = get(a, column);
				const bValue = get(b, column);
				const sort2 = columns.value.find((col) => col.key === column)?.sort ?? defaultSort;
				return sort2(aValue, bValue, direction);
			});
		});
		const selected = computed({
			get() {
				return modelValueRef.value ? [...modelValueRef.value] : [];
			},
			set(value) {
				emit('update:modelValue', value ? [...value] : []);
			}
		});
		const indeterminate = computed(() => selected.value && selected.value.length > 0 && selected.value.length < props.rows.reduce((acc, item) => acc + item.events.length, 0));
		function toggleSelect(event, checked) {
			const next = new Set(selected.value);
			if (checked) next.add(event);
			else next.delete(event);
			selected.value = next;
		}
		const disabledActions = computed(() => props.disabledActions);
		const emptyState = computed(() => {
			if (props.emptyState === null) return null;
			return { ...ui.value.default.emptyState, ...props.emptyState };
		});
		const loadingState = computed(() => {
			if (props.loadingState === null) return null;
			return { ...ui.value.default.loadingState, ...props.loadingState };
		});
		const savedOpenedRows = ref([]);
		watch(
			() => props.filterTable,
			(newValue) => {
				if (newValue === 1) {
					rows.value.forEach((_, ind) => {
						if (!openedRows.value.includes(ind)) {
							openedRows.value.push(ind);
						}
					});
				} else if (newValue === 2) {
					openedRows.value = [];
				} else {
					openedRows.value = rows.value.map((_, ind) => ind);
				}
				nextTick(() => {
					scrollerKey.value = props.filterTable;
				});
			},
			{ immediate: true }
		);
		function compare(a, z) {
			if (typeof props.by === 'string') {
				const property = props.by;
				return a?.[property] === z?.[property];
			}
			return props.by(a, z);
		}

		function isSelected(row) {
			if (!props.modelValue) {
				return false;
			}
			return selected.value?.some((item) => item.id === row.id);
		}

		function onSort(column) {
			if (sort.value.column === column.key) {
				const direction = !column.direction || column.direction === 'asc' ? 'desc' : 'asc';
				if (sort.value.direction === direction) {
					sort.value = defu({}, savedSort, { column: null, direction: 'asc' });
				} else {
					sort.value = { column: sort.value.column, direction: sort.value.direction === 'asc' ? 'desc' : 'asc' };
				}
			} else {
				sort.value = { column: column.key, direction: column.direction || 'asc' };
			}
		}

		function onSelect(row) {
			if (!$attrs.onSelect) {
				return;
			}
			$attrs.onSelect(row);
		}

		async function selectAllRows() {
			selected.value = rows.value?.filter((row) => row?.type === 'event') || [];
		}

		defineShortcuts({
			shift_enter: {
				handler: () => {
					if (JSON.stringify(selected.value) === JSON.stringify(rows.value?.filter((row) => row?.type === 'event'))) {
						selected.value = [];
					} else {
						selectAllRows();
					}
				}
			}
		});

		function onChange(checked) {
			if (checked) {
				emit('toggle-events', true);
				selectAllRows();
			} else {
				emit('toggle-events', false);
				selected.value = [];
			}
		}

		function getRowData(row, rowKey, defaultValue = '') {
			return get(row, rowKey, defaultValue);
		}

		function toggleOpened(index) {

			const clickedRow = rows.value[index];

			if (clickedRow?.type !== 'group') {
				return;
			}

			const groupId = clickedRow.id; // "group-0", "group-1", etc.
			const originalGroupIndex = parseInt(groupId.split('-')[1]);

			if (openedRows.value.includes(originalGroupIndex)) {
				openedRows.value = openedRows.value.filter(i => i !== originalGroupIndex);
			} else {
				openedRows.value = [...openedRows.value, originalGroupIndex];
			}

			savedOpenedRows.value = [...openedRows.value];
			nextTick(() => {
				scrollerKey.value++;
			});
		}

		function getAriaSort(column) {
			if (!column.sortable) {
				return void 0;
			}
			if (sort.value.column !== column.key) {
				return 'none';
			}
			if (sort.value.direction === 'asc') {
				return 'ascending';
			}
			if (sort.value.direction === 'desc') {
				return 'descending';
			}
			return void 0;
		}

		// scroll to row
		const scrollToRow = async (id, doSelect = false) => {
			const index = rows.value.findIndex((element) => element.id === id);
			if (index === -1) return;

			await nextTick();
			scroller.value.scrollToItem(index); // Force render

			const rowElement = document.querySelector(`[data-id="${id}"]`);
			if (!rowElement) return;

			// Scroll to center smoothly
			rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

			// Reset background color if needed
			rowElement.classList.remove('bg-red-0/[.3]', 'dark:bg-red-0/[.2]', 'bg-yellow-1/[.3]', 'dark:bg-yellow-1/[.2]', 'bg-purple/[.20]', 'dark:bg-white/[.20]');

			const event = rows.value[index];

			if (event?.errorTitles?.length > 0) {
				rowElement.classList.add('bg-red-0/[.3]', 'dark:bg-red-0/[.2]');
			} else if (event?.warningTitles?.length > 0) {
				rowElement.classList.add('bg-yellow-1/[.3]', 'dark:bg-yellow-1/[.2]');
			} else {
				rowElement.classList.add('bg-purple/[.20]', 'dark:bg-white/[.20]');
			}

			if (doSelect) {
				$attrs.onSelect(event);
			}
		};

		// scroll on chart
		const handleMouseDown = (event) => {
			if (event.button === 2 || (event.button === 0 && !selected.value.map((row) => row.id).includes(event.currentTarget.getAttribute('data-id')))) {
				const rowId = event.currentTarget.getAttribute('data-id');
				emit('selectedRowEvent', rowId);
			}
		};

		onMounted(() => {
			openedRows.value = props.rows.map((_, i) => i);
		});

		expose({ scrollToRow });

		return {
			// eslint-disable-next-line vue/no-dupe-keys
			ui,
			attrs,
			// eslint-disable-next-line vue/no-dupe-keys
			sort,
			// eslint-disable-next-line vue/no-dupe-keys
			columns,
			// eslint-disable-next-line vue/no-dupe-keys
			rows,
			scroller,
			scrollerKey,
			selected,
			indeterminate,
			// eslint-disable-next-line vue/no-dupe-keys
			emptyState,
			// eslint-disable-next-line vue/no-dupe-keys
			loadingState,
			openedRows,
			emit,
			isSelected,
			onSort,
			onSelect,
			onChange,
			getRowData,
			toggleOpened,
			getAriaSort,
			seenEventsHeader,
			seenEvents,
			disabledActions,
			handleMouseDown,
			toggleSelect
		};
	}
});
</script>
