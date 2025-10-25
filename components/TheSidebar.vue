<template>
	<aside @mouseenter="isHoverEnabled ? openSidebar() : null" @mouseleave="isHoverEnabled ? closeSidebar() : null"
		:class="{ '!w-[76px] ': !sidebarOpen }"
		class="fixed left-0 top-0 overflow-y-auto flex flex-col gap-y-6 justify-between py-6 px-4 basis-[246px] bg-background-brown_2 h-screen w-[246px] duration-300 z-50 dark:bg-dark-bg_sidebar-0">
		<div class="grow">
			<h2 :class="{ 'text-center': !sidebarOpen }" class="text-xl font-semibold text-white">{{ sidebarOpen ?
				'Lingrow' :
				'EN' }}</h2>
			<div class="h-[1px] bg-brown-0 w-full relative mt-4 dark:bg-brown">
				<UButton @click="toggleSidebar"
					class="absolute -right-4 top-0 -translate-y-1/2  dark:bg-white/[0.1] dark:hover:bg-white/[0.2]"
					:ui="{ rounded: 'rounded-l-lg rounded-r-none', variant: { solid: 'bg-brown-0 hover:bg-brown' } }"
					size="sm">
					<template #trailing>
						<UIcon name="i-heroicons-chevron-left-20-solid"
							class="w-4 h-4 ms-auto transform transition-transform duration-200 dark:bg-white"
							:class="[isHoverEnabled && 'rotate-180']" />
					</template>
				</UButton>
			</div>
			<div class="mt-6 space-y-2 text-white dark:text-white/[0.8]">
				<UButton to="/listening" active-class="!text-white"
					:class="{ '!text-white': route.path.includes('listening') }" variant="ghost"
					:label="sidebarOpen ? 'Listening' : ''" block size="xl" :ui="{
						rounded: 'rounded-lg',
						block: 'justify-start',
						padding: { xl: 'px-3 py-2.5' },
						size: { xl: 'text-xs' },
						font: 'font-medium',
						base: 'uppercase tracking-wide',
						variant: { ghost: 'hover:bg-brown-0 text-white/[0.7] dark:hover:bg-white/[0.1] dark:text-white/[0.7]' }
					}">
					<template #leading>
						<BellIcon class="w-5 shrink-0" />
					</template>
				</UButton>
				<UButton to="/reading" active-class="!text-white"
					:class="{ '!text-white': route.path.includes('reading') }" variant="ghost"
					:label="sidebarOpen ? 'Reading' : ''" block size="xl" :ui="{
						rounded: 'rounded-lg',
						block: 'justify-start',
						padding: { xl: 'px-3 py-2.5' },
						size: { xl: 'text-xs' },
						font: 'font-medium',
						base: 'uppercase tracking-wide',
						variant: { ghost: 'hover:bg-brown-0 text-white/[0.7] dark:hover:bg-white/[0.1] dark:text-white/[0.7]' }
					}">
					<template #leading>
						<FileIcon class="w-5 shrink-0" />
					</template>
				</UButton>
				<UButton to="/writing" active-class="!text-white"
					:class="{ '!text-white': route.path.includes('writing') }" variant="ghost"
					:label="sidebarOpen ? 'Writing' : ''" block size="xl" :ui="{
						rounded: 'rounded-lg',
						block: 'justify-start',
						padding: { xl: 'px-3 py-2.5' },
						size: { xl: 'text-xs' },
						font: 'font-medium',
						base: 'uppercase tracking-wide',
						variant: { ghost: 'hover:bg-brown-0 text-white/[0.7] dark:hover:bg-white/[0.1] dark:text-white/[0.7]' }
					}">
					<template #leading>
						<MessageIcon class="w-5 shrink-0" />
					</template>
				</UButton>

			</div>
		</div>

		<!-- <UPopover v-model:open="isPopoverOpen" :popper="{ placement: 'right-end', offsetDistance: 0 }">
			<div :class="sidebarOpen ? 'py-2 px-3' : 'py-1 px-1'"
				class="space-y-1 bg-brown-0 w-full max-w-[350px] rounded-lg border border-white/[.1] cursor-pointer duration-300 dark:bg-white/[0.1] dark:text-white/[0.8]">
				<h4 :class="sidebarOpen ? 'text-sm' : 'text-xs'"
					class="text-white/[.7] font-medium uppercase tracking-wide whitespace-nowrap">
					{{ sidebarOpen ? getCarrierName() : getCarrierName().slice(0, 3) }}
				</h4>
				<div class="h-[1px] w-full bg-white/[0.1]"></div>
				<p :class="sidebarOpen ? 'text-xs px-0' : 'text-[10px] px-1'"
					class="text-white/[.7] uppercase font-medium tracking-wide whitespace-nowrap">
					{{ sidebarOpen ? getCarrierGroupName() : getCarrierGroupName().slice(0, 3) }}
				</p>
			</div>
			<template #panel>
				<div class="p-4 space-y-3 rounded-lg w-[340px] dark:bg-dark-0">
					<div class="space-y-2">
						<UInput v-model="searchCarrier" :ui="{
							padding: { xl: 'px-3 py-2' },
							rounded: 'rounded-lg',
							color: { white: { outline: 'shadow-none ring-grey-border placeholder:text-sm font-normal' } }
						}" color="white" icon="i-heroicons-magnifying-glass-20-solid" size="xl" placeholder="Search Carrier" />
						<ul v-if="filteredCarriers.length > 0"
							class="border max-h-60 overflow-y-auto rounded-lg border-grey-border dark:border-white/[0.1]">
							<li @click="setCarrier(carrier); setCarrierTimeZoneId(carrier.timeZoneInfo.ianaId); carrierId = carrier.id"
								v-for="(carrier, i) in filteredCarriers" :key="i"
								:style="{ backgroundColor: filteredCarriers.find((n) => n === selectedCarrier) === carrier ? 'rgba(70, 90, 149, 0.1)' : '' }"
								class="border-b border-grey-border text-sm last:border-b-0 py-2 px-4 duration-200 first:rounded-t-lg last:rounded-b-lg hover:bg-purple/[.04] cursor-pointer flex items-center justify-between dark:border-white/[0.1] dark:text-white/[0.8] dark:hover:bg-white/[0.1]">
								{{ carrier.name }}
								<UIcon v-if="filteredCarriers.find((n) => n === selectedCarrier) === carrier"
									name="i-heroicons-check" class="text-purple dark:text-white/[0.8]" />
							</li>
						</ul>
						<div v-else
							class="border rounded-lg py-2 px-4 flex items-center justify-center min-h-40 font-medium uppercase">
							no
							data
						</div>
					</div>

					<div class="pt-2 z-50">
						<UButton variant="ghost"
							class="w-full justify-start text-xs border border-black/[0.1] text-black font-medium rounded-lg dark:border-white/[0.1]  dark:text-white/[0.6] dark:hover:bg-white/[0.1]">
							<User1Icon class="w-5" />
							001
						</UButton>
						<UButton variant="ghost"
							class="w-full justify-start text-xs border border-black/[0.1] text-black rounded-lg mt-2 dark:border-white/[0.1] dark:text-white/[0.6] dark:hover:bg-white/[0.1]">
							<SettengsIcon class="w-5" />
							Settings
						</UButton>
						<UButton @click="authStore.logout()" variant="ghost"
							class="w-full justify-start text-xs border text-red-0 border-red-0/[.5] hover:bg-red-0/[.05] font-medium rounded-lg mt-2 dark:border-white/[0.1] dark:text-white/[0.6] dark:hover:bg-white/[0.1]">
							<LogautIcon class="w-5" />
							Log out
						</UButton>
						<div class="w-full pt-2 flex justify-end">
							<ClientOnly>
								<UButton class="dark:hover:bg-white/[0.1]"
									:icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
									color="gray" variant="ghost" aria-label="Theme" @click="isDark = !isDark" />
								<template #fallback>
									<div class="w-8 h-8"></div>
								</template>
							</ClientOnly>
						</div>
					</div>
				</div>
			</template>
		</UPopover> -->
	</aside>
</template>

<script setup>
//icon
import BellIcon from '~/assets/icons/bell-03.svg';
import MessageIcon from '~/assets/icons/message-text-square-01.svg';
import FileIcon from '~/assets/icons/file-02.svg';
import IftaIcon from '~/assets/icons/ifta.svg';
import ListIcon from '~/assets/icons/list.svg';
import LogautIcon from '~/assets/icons/log-out-02.svg';
import MapIcon from '~/assets/icons/map-01.svg';
import SettengsIcon from '~/assets/icons/settings-02.svg';
import ToolIcon from '~/assets/icons/tool-02.svg';
import TruckIcon from '~/assets/icons/truck-02.svg';
import UserIcon from '~/assets/icons/user-01.svg';
import UsersIcon from '~/assets/icons/users-01.svg';
import User1Icon from '../assets/icons/user-02.svg';


// stores
import { useIndex } from '~/store';
// import { useAuthStore } from '~/store/auth';
// import { useCarrierStore } from '~/store/carrier';

// store variables
// const authStore = useAuthStore();
// const carrierStore = useCarrierStore();

// destructuring stores
const { sidebar } = storeToRefs(useIndex());
// const { carriers } = storeToRefs(carrierStore);

// carriers
const isPopoverOpen = ref(false);
const searchCarrier = ref('');
const carrierId = ref(getCarrierId());
// const selectedCarrier = computed(() => carriers.value.find((carrier) => carrier.id === carrierId.value));
// const filteredCarriers = computed(() => carriers.value.filter((carrier) => carrier.name.toLowerCase().includes(searchCarrier.value.toLowerCase())));

// watching selected carrier
watch(carrierId, (newCarrier) => {
	if (newCarrier) {
		// Reload the page when selectedCarrier changes
		window.location.reload();
	}
});
const setCarrier = (row) => {
	console.log(row)
	setCarrierId(row.id);
	setCarrierName(row.name);
	setCarrierGroupName(row.provider.name);
};
// route
const route = useRoute();

// emits
const emit = defineEmits(['sidebarToggle']);

// sidebar state
const sidebarOpen = ref(sidebar.value === 'open');
const isHoverEnabled = ref(sidebar.value !== 'open');

// color mode
const colorMode = useColorMode();

// Open the sidebar
const openSidebar = () => {
	if (isHoverEnabled.value) sidebarOpen.value = true;
};

// Close the sidebar
const closeSidebar = () => {
	if (isHoverEnabled.value) sidebarOpen.value = false;
};

// Toggle the sidebar
const toggleSidebar = () => {
	if (isHoverEnabled.value) {
		isHoverEnabled.value = false;
		if (sidebarOpen.value) {
			sidebar.value = 'open';
		} else {
			sidebar.value = 'close';
		}
		emit('sidebarToggle', sidebarOpen.value);
	} else {
		isHoverEnabled.value = true;
		sidebarOpen.value = !sidebarOpen.value;
		if (sidebarOpen.value) {
			sidebar.value = 'open';
		} else {
			sidebar.value = 'close';
		}
		emit('sidebarToggle', sidebarOpen.value);
	}
};

const isDark = computed({
	get() {
		return colorMode.value === 'dark';
	},
	set() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
	}
});

watch(isPopoverOpen, async (newValue) => {
	if (newValue) {
		// if (!route.path.includes('dot-inspection') && !route.path.includes('activity')) {
		// 	await carrierStore.getCarriesFilter();
		// }
	}
});
</script>
