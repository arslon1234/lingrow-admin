<template>
	<main>
		<section class="card flex justify-between items-center">
			<h1 class="title">Chats</h1>
			<UInput
				class="min-w-[264px]"
				v-model="search"
				:ui="{
					rounded: 'rounded-lg',
					color: { white: { outline: 'shadow-none ring-grey-border' } }
				}"
				color="white"
				icon="i-heroicons-magnifying-glass-20-solid"
				size="lg"
				placeholder="Search chat"
			/>
		</section>
		<section class="grid grid-cols-12 gap-x-3 mt-3">
			<div class="col-span-3 h-[calc(100vh-100px)] overflow-y-auto flex flex-col gap-y-2">
				<div
					v-for="(chat, ind) in chats"
					:key="ind"
					@click="selectedChat !== chat.id ? selectedChat = chat.id : selectedChat = null"
					:class="[selectedChat === chat.id && 'dark:border-purple/[.5] dark:hover:border-purple/[.5]']"
					class="rounded-lg cursor-pointer border-2 border-white dark:border-dark-0 dark:hover:border-transparent hover:border-purple/[.15] bg-white duration-500 hover:bg-purple/[.08] py-2.5 px-4 space-y-3 dark:bg-dark-0 dark:hover:bg-white/[.08]"
				>
					<div class="flex justify-between items-center">
						<h4 class="dark:text-white/[.8] font-bold">{{ chat.name }}</h4>
						<p class="text-xs font-medium dark:text-grey-5">{{ chat.lastMessageDate }}</p>
					</div>
					<div class="mt-2 flex justify-between items-end gap-x-2">
						<p class="truncate text-sm dark:text-white/[.5]">{{ chat.lastMessage }}</p>
						<div class="shrink-0">
							<UBadge v-if="chat.unread > 0" size="xs" :ui="{rounded: 'rounded-full', variant: {solid: 'dark:bg-purple dark:text-white'}}">{{ chat.unread }}</UBadge>
							<DoubleCheckIcon v-else class="dark:text-grey-5 w-5 h-5" />
						</div>
					</div>
				</div>
			</div>
			<div class="col-span-9 bg-white dark:bg-dark-0 rounded-lg overflow-hidden">
				<transition name="fade" mode="out-in">
					<div v-if="selectedChat" class="flex flex-col h-full">
						<div class="py-3 px-4 border-b dark:border-white/[.05] border-grey-border flex justify-between items-center">
							<div class="space-y-2">
								<h3 class="font-bold">{{ chats.find(chat => chat.id === selectedChat).name }}</h3>
								<p class="text-xs dark:text-grey-1 font-medium">{{ chats.find(chat => chat.id === selectedChat).lastOnline }}</p>
							</div>
							<UButton variant="outline" class="shrink-0" size="md" :ui="{ rounded: 'rounded-xl', variant: { outline: 'ring-black/[.1] bg-purple/[.1] dark:ring-white/[.1] dark:bg-white/[.1] dark:hover:bg-white/[.05]'} }">
								<template #leading>
									<PhoneIcon class="w-5 h-5 dark:text-dark-timer-0 text-purple" />
								</template>
							</UButton>
						</div>
						<div class="px-4 py-3 flex-1 space-y-2">
							<div ref="chat" class="overflow-y-auto h-[calc(100dvh-246px)] overflow-x-hidden [&::-webkit-scrollbar-thumb]:hidden scroll-smooth">
									<transition-group name="chat" tag="div" class="flex flex-col gap-y-1">
										<div
											v-for="message in chats.find(chat => chat.id === selectedChat).messages"
											:key="message.id"
											:class="
												!message.isMine
													? 'bg-background-grey_3 self-start dark:border dark:border-white/[.1]  dark:bg-white/[0.1]'
													: 'bg-purple dark:bg-purple/[.6] self-end'
											"
											class="relative py-2 px-4 rounded-xl w-fit min-w-0 max-w-[24rem]"
										>
											<p
												:class="!message.isMine ? '' : 'text-white'"
												style="unicode-bidi: plaintext; word-break: break-word"
												class="w-fit whitespace-pre-wrap text-sm font-semibold dark:text-white/[0.8]"
											>
												{{ message.message }}
												<span
													:class="!message.isMine ? '' : 'text-white'"
													class="dark:text-white/[0.6] text-black text-[11px] inline-block shrink-0 translate-x-2 translate-y-2 float-right"
												>{{ message.date }}</span
												>
											</p>
<!--											<div v-else class="w-[50px] relative text-sm">-->
<!--												&nbsp;-->
<!--												<div class="circle bg-grey-0 dark:bg-white/[.6]"></div>-->
<!--												<div class="circle bg-grey-0 dark:bg-white/[.6]"></div>-->
<!--												<div class="circle bg-grey-0 dark:bg-white/[.6]"></div>-->
<!--											</div>-->
										</div>
									</transition-group>
								</div>
							<div class="space-y-2">
								<div class="flex gap-x-2">
									<UInput
										ref="input"
										autofocus
										name="chatInput"
										class="grow"
										size="xl"
										placeholder="Message..."
										v-model.trim="chatInput"
										:ui="{
											rounded: 'rounded-lg',
											padding: {
												xl: 'px-4 py-2'
											},
											placeholder: 'placeholder-black-0/[.4] placeholder:text-sm',
											color: {
												white: {
													outline: 'shadow-none bg-black-0/[.04] ring-1 ring-inset ring-grey-border focus:ring-2 focus:ring-primary-800 dark:focus:ring-primary-900'
												}
											},
											icon: {
												trailing: {
													pointer: 'pointer-events-auto'
												}
											}
										}"
									/>
									<UButton
										@click="submitChatText"
										size="lg"
										variant="solid"
										icon="i-heroicons-paper-airplane"
									>
										<template #leading>
											<ArrowUpIcon class="w-5 h-5 text-white" />
										</template>
									</UButton>
								</div>
							</div>
						</div>
					</div>
					<div class="h-full flex items-center justify-center" v-else>
						<h2 class="font-bold">Choose who you would like to write to</h2>
					</div>
				</transition>
			</div>
		</section>
	</main>
</template>

<script setup>
// importing icons
import DoubleCheckIcon from '~/assets/icons/double-check.svg';
import PhoneIcon from '~/assets/icons/phone.svg';
import ArrowUpIcon from '~/assets/icons/arrow-up.svg';

// importing composable
import { useChats } from '~/composables/pages/chats';

const {
	input,
	loading,
	selectedChat,
	submitChatText,
	chatInput,
	chats
} = await useChats();
</script>
