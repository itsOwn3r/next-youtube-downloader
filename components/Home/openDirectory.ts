import toast from "react-hot-toast";

export const openDirectory = async (folder: string, file?: string) => {

    try {

    const response = await fetch("/api/open", {
      method: "POST",
      body: JSON.stringify({ videos: folder === "videos" ? true : false, file: file ? file : undefined }),
    });

    const data = await response.json();

    if (!data.success) {
        toast.error(data.message, {
            duration: 4000,
            className: "text-xl"
          });        
    }
    } catch (error) {
        toast.error((error as Error).message, {
            duration: 4000,
            className: "text-xl"
          });
    }
  };