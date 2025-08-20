// importing packages
import { useTimeZoneHelper } from '~/helpers/timezone';

export const useChats = async () => {
	// route
	const route = useRoute();

	// time zone utils
	const { getStartOf, getEndOf, formatToUTC, convertToTimeZone } = useTimeZoneHelper();

	// selected chat
	const selectedChat = ref<number | null>(parseInt(route.query.chatId as string) || null);

	watch(() => selectedChat.value, async () => {
		await navigateTo({ query: { chatId: selectedChat.value ? selectedChat.value : undefined } });
		await nextTick();
		input.value?.$refs?.input.focus();
	});

	// chat input
	const chatInput = ref<string>('');
	const input = ref<{ $refs: { input: { focus: () => void } } } | null>(null);

	// chats
	const chats = ref([
		{
			id: 1,
			name: 'Robinzo Kruzo',
			lastMessage: 'Alright, ping me when ready.',
			lastMessageDate: '14:22',
			lastOnline: '15:00',
			unread: 2,
			messages: [
				{ id: 1, message: 'Hey, are you coming to the office today?', date: '13:30', isMine: false },
				{ id: 2, message: 'Thinking about it. Depends on the traffic.', date: '13:35', isMine: true },
				{ id: 3, message: 'We need to go over the quarterly report.', date: '13:37', isMine: false },
				{ id: 4, message: 'Got it. I’ll be there by 2 PM.', date: '13:40', isMine: true },
				{ id: 5, message: 'Perfect. Let’s grab coffee after?', date: '13:44', isMine: false },
				{ id: 6, message: 'Sure thing. Caffeine is much needed!', date: '13:45', isMine: true },
				{ id: 7, message: 'Alright, ping me when ready.', date: '14:22', isMine: false },
			],
		},
		{
			id: 2,
			name: 'David Patrick',
			lastMessage: 'Let’s catch up next week then.',
			lastMessageDate: '12:03',
			lastOnline: '13:20',
			unread: 0,
			messages: [
				{ id: 1, message: 'Hey, do you have time for a quick call today?', date: '11:45', isMine: false },
				{ id: 2, message: 'I’m packed until 4. Maybe tomorrow?', date: '11:48', isMine: true },
				{ id: 3, message: 'Alright. Let’s catch up next week then.', date: '12:03', isMine: false },
			],
		},
		{
			id: 3,
			name: 'Lora Parkinson',
			lastMessage: 'Cool, I’ll check it out tonight.',
			lastMessageDate: '10:47',
			lastOnline: '12:32',
			unread: 1,
			messages: [
				{ id: 1, message: 'Uploaded the prototype to Figma.', date: '09:20', isMine: true },
				{ id: 2, message: 'Nice! Where can I find it?', date: '09:35', isMine: false },
				{ id: 3, message: 'Shared the link via email.', date: '09:37', isMine: true },
				{ id: 4, message: 'Got it. The color palette looks really clean.', date: '10:00', isMine: false },
				{ id: 5, message: 'Thanks! I was experimenting with softer tones.', date: '10:15', isMine: true },
				{ id: 6, message: 'Cool, I’ll check it out tonight.', date: '10:47', isMine: false },
			],
		},
		{
			id: 4,
			name: 'Zuxra Tojiyeva',
			lastMessage: 'Ping me if you need more edits.',
			lastMessageDate: '09:32',
			lastOnline: '07:31',
			unread: 4,
			messages: [
				{ id: 1, message: 'Final version of the logo is ready.', date: '08:00', isMine: false },
				{ id: 2, message: 'Looks amazing. Love the minimal vibe!', date: '08:12', isMine: true },
				{ id: 3, message: 'Glad you like it.', date: '08:20', isMine: false },
				{ id: 4, message: 'Ping me if you need more edits.', date: '09:32', isMine: false },
			],
		},
		{
			id: 5,
			name: 'Abdulla Omonov',
			lastMessage: 'Yup, received the zip file.',
			lastMessageDate: '05:12',
			lastOnline: '09:43',
			unread: 3,
			messages: [
				{ id: 1, message: 'Sent you the assets for the homepage redesign.', date: '04:30', isMine: true },
				{ id: 2, message: 'Yup, received the zip file.', date: '05:12', isMine: false },
			],
		},
		{
			id: 6,
			name: 'Tojibek Bekmurodov',
			lastMessage: 'Perfect, thanks for the quick response.',
			lastMessageDate: '11:54',
			lastOnline: '11:12',
			unread: 0,
			messages: [
				{ id: 1, message: 'Can you send me the database credentials again?', date: '11:10', isMine: false },
				{ id: 2, message: 'Sure, sending them now.', date: '11:12', isMine: true },
				{ id: 3, message: 'Perfect, thanks for the quick response.', date: '11:54', isMine: false },
			],
		},
		{
			id: 7,
			name: 'Sardor Tashkentov',
			lastMessage: 'Awesome! Looking forward to it.',
			lastMessageDate: '15:18',
			lastOnline: '15:19',
			unread: 1,
			messages: [
				{ id: 1, message: 'Want to join the dev meetup this Friday?', date: '15:12', isMine: false },
				{ id: 2, message: 'Absolutely! Send me the details.', date: '15:15', isMine: true },
				{ id: 3, message: 'Awesome! Looking forward to it.', date: '15:18', isMine: false },
			],
		},
		{
			id: 8,
			name: 'Jessica Miles',
			lastMessage: 'Any feedback on the dashboard redesign?',
			lastMessageDate: '12:44',
			lastOnline: '13:10',
			unread: 0,
			messages: [
				{ id: 1, message: 'Any feedback on the dashboard redesign?', date: '12:44', isMine: false },
				{ id: 2, message: 'It’s really intuitive! Just a couple of spacing issues.', date: '12:45', isMine: true },
				{ id: 3, message: 'Got it, will fix and send a new version.', date: '12:47', isMine: false },
			],
		},
		{
			id: 9,
			name: 'Fayzullo Karimov',
			lastMessage: 'Let me know when the staging build is up.',
			lastMessageDate: '16:05',
			lastOnline: '16:07',
			unread: 2,
			messages: [
				{ id: 1, message: 'We’re deploying the fixes now.', date: '15:45', isMine: true },
				{ id: 2, message: 'Let me know when the staging build is up.', date: '16:05', isMine: false },
			],
		},
		{
			id: 10,
			name: 'Ella Nolan',
			lastMessage: 'I’ll book the hotel and send you the confirmation.',
			lastMessageDate: '13:22',
			lastOnline: '13:30',
			unread: 0,
			messages: [
				{ id: 1, message: 'Let’s plan the trip next week.', date: '13:10', isMine: true },
				{ id: 2, message: 'Sure! I’ll book the hotel and send you the confirmation.', date: '13:22', isMine: false },
			],
		},
	])

	const submitChatText = () => {
		const messages = chats.value.find(chat => chat.id === selectedChat.value)?.messages
		messages?.push({ id: messages.length + 1 , message: chatInput.value, date: convertToTimeZone().format('HH:mm'), isMine: true });
		chatInput.value = '';
	}

	defineShortcuts({
		enter: {
			usingInput: 'chatInput',
			handler: () => {
				if (chatInput.value) {
					submitChatText();
				}
			}
		}
	});

	// loading
	const loading = ref<boolean>(false);

	return {
		input,
		loading,
		selectedChat,
		submitChatText,
		chatInput,
		chats
	};
};
