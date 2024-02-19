export const generateCode = () => {
    // Generate a random number between 0 and 999999, then pad with leading zeros
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
};