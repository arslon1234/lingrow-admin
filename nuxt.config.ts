// https://nuxt.com/docs/api/configuration/nuxt-config
import svgLoader from 'vite-svg-loader';

export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: {
		enabled: true,

		timeline: {
			enabled: true
		}
	},
	hooks: {
		'prerender:routes'({ routes }) {
			routes.clear(); // Do not generate any routes (except the defaults)
		}
	},
	app: {
		pageTransition: {
			name: 'fade',
			mode: 'out-in'
		},
		layoutTransition: {
			name: 'fade',
			mode: 'out-in'
		}
	},
	typescript: {
		typeCheck: true
	},
	ssr: false,
	devServer: {
		port: parseInt(process.env.LOCAL_PORT as string) ?? 8001
	},
	modules: ['@pinia/nuxt', '@nuxt/ui', '@nuxtjs/tailwindcss', 'dayjs-nuxt', 'nuxt-rating', '@nuxt/image'],
	dayjs: {
		locales: ['en', 'fr'],
		plugins: ['relativeTime', 'utc', 'timezone'],
		defaultLocale: 'en',
		defaultTimezone: 'America/New_York'
	},
	css: ['~/assets/css/main.css'],
	colorMode: {
		preference: 'light'
	},
	vite: {
		plugins: [svgLoader()],
		worker: {
			format: 'iife'
		}
		// optimizeDeps: {
		// 	include: ['~/utils/violation'],
		// },
		// build: {
		// 	rollupOptions: {
		// 		output: {
		// 			entryFileNames: '[name].js',
		// 			chunkFileNames: '[name].js',
		// 			assetFileNames: '[name].[ext]',
		// 		},
		// 	},
		// },
	},
	runtimeConfig: {
		public: {
			API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
			TG_BOT_URL: process.env.TG_BOT_URL ?? 'https://t.me/YourBotUsername'
			// BASE_URL_CHAT: process.env.BASE_URL_CHAT ?? 'wss://ai.routeeld.uz/',
			// GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY ?? 'AIzaSyC0gkkJ9mycfaiKZO4SK7LUIvJMQp5DqDI',
			// GOOGLE_MAPS_MAP_ID: process.env.GOOGLE_MAPS_MAP_ID ?? 'fd5c5000ce539c3b'
		}
	},
	build: {
		transpile: ['@vuepic/vue-datepicker']
	}
});
