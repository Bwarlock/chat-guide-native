export const validateEmail = (input) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(input);
};

export const validatePassword = (input) => {
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	return passwordRegex.test(input);
};

export function createUniqueIdentifier() {
	const milliseconds = Date.now(); // Current time in milliseconds since January 1, 1970
	// const randomNum = Math.floor(Math.random() * 1000); // Random number to ensure uniqueness

	return milliseconds;
}
