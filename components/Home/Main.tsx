"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Main = () => {
    const [url, setUrl] = useState("");

    console.log(url);

    const handleFetch = async () => {
        if (!url) {
            return;
        }
        try {
            const response = await fetch("/api/fetch", {
                method: "POST",
                body: JSON.stringify({url})
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
  return (
    <div className="min-h-[70%] flex items-center justify-center flex-col w-full">
      <Input
        className="max-w-[90%] md:max-w-[30%] p-6 text-2xl"
        placeholder="Enter Youtube URL"
        onChange={e => setUrl(e.target.value)}
      />
      <span>
        e.g.{" "}
        <code className="text-sm text-zinc-400">
          https://www.youtube.com/watch?v=dQw4w9WgXcQ
        </code>
      </span>
      <Button onClick={() => handleFetch()} className="px-7 text-2xl mt-4" variant="secondary">
        Fetch
      </Button>
    </div>
  );
};

export default Main;
