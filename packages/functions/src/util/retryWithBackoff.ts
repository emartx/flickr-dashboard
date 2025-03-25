const retryWithBackoff = async <T>(
	fn: () => Promise<T>,
	retries = 5,
	initialDelay = 1000
): Promise<T> => {
	let attempt = 0;
	let delay = initialDelay;

	while (true) {
		try {
			return await fn();
		} catch (error: unknown) {
			attempt++;

			const err = error as { message: string; code: number };
			const isRateLimit =
				err?.message?.includes("rate limit") || err?.code === 429;

			if (attempt >= retries || !isRateLimit) {
				throw err;
			}

			console.warn(
				`⚠️ Retry #${attempt} after ${delay}ms due to error: ${
					err.message || err
				}`
			);
			await new Promise((resolve) => setTimeout(resolve, delay));
			delay *= 2;
		}
	}
};

export default retryWithBackoff;
