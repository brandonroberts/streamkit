// Resolve promise after duration
export const wait = async (duration: number) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};