
export const sanitizedFileName = (title: string, videoId: string) => {
  const sanitized = title.replace(/[<>:*"\/\\|?*\x00-\x1F]/g, "");
  const nameOfFile = `${sanitized}~~${videoId}`;

  return nameOfFile;
};
