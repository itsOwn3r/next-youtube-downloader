export const videoByQuality = async (videos:{ qualityLabel: string; contentLength: string; url: string }[],
  quality: string): Promise<{
    qualityLabel: string;
    contentLength: string;
    url: string;
  } | null> => {
  return new Promise((resolve, reject) => {
    try {
      const video = videos.find((video) => video.qualityLabel === quality) || null;

      if (video) {
       return resolve(video);
      } else {
        resolve(null); // or handle the case where no video is found
      }
    } catch (error) {
      console.log(error);
      reject("Something went wrong!");
    }
  });
};
