const runConcurrent = async <T>(
	items: T[],
	handler: (item: T) => Promise<void>,
	concurrency = 5
): Promise<void> => {
	const queue = [...items];
	const workers: Promise<void>[] = [];

	async function worker() {
		while (queue.length > 0) {
			const item = queue.shift();
			if (item) {
				try {
					await handler(item);
				} catch (err) {
					console.error("❌ Task failed:", err);
				}
			}
		}
	}

	for (let i = 0; i < concurrency; i++) {
		workers.push(worker());
	}

	await Promise.all(workers);
};

export default runConcurrent;
