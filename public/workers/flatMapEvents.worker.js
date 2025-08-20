self.addEventListener('message', async (e) => {
	console.log('Worker received message:', e.data);
	try {
		const events = e.data;
		const processedEvents = events?.flatMap((item) => item?.events || [])
		self.postMessage({ success: true, data: processedEvents });
	} catch (error) {
		self.postMessage({ success: false, error: error.message });
	}
});
