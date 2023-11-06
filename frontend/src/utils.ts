export const formatTime = (milliseconds: number | undefined): string => {
  if (typeof milliseconds === 'undefined') {
    return "--:--.---";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor(milliseconds % 1000);

  return `${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s ${ms.toString().padStart(3, '0')}ms`;
};