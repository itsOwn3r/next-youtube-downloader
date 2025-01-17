"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
  


const PlaylistComponent = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [link, setLink] = useState("");

  
  const addPlaylistHandler = async () => {
    if (!autoUpdate || !link || !title) {
        toast.error("You must provide valid data!", {
            duration: 4000,
            className: "text-xl"
          });
          return;      
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/playlist/add", {
        method: "POST",
        body: JSON.stringify({ autoUpdate, link, title }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Playlist Added!", {
            duration: 4000,
            className: "text-xl"
          });
          setIsModalOpen(false);
          router.refresh();
      } else {
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
    } finally {
      setIsLoading(false)
    }
  };
  
  return (
    <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
    <DialogTrigger className={cn(buttonVariants({ className: "bg-green-600 hover:bg-green-300 text-white"}))}>Create New</DialogTrigger>
    <DialogContent>
      <DialogDescription className='hidden'></DialogDescription>
      <DialogHeader>
        <DialogTitle className="hidden">Add new Playlist</DialogTitle>
      </DialogHeader>

      <Card className="">
        <CardHeader>
          <CardTitle>Add new Playlist</CardTitle>
          <CardDescription>You can add as much Playlists as you want and keep track of them even with auto-update!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addPlaylistHandler}>
            <div className="grid w-full items-center gap-4">

              <div className="flex flex-col space-y-1.5">
                Title
                <Input value={title} onChange={(e) => setTitle(e.target.value)} id="title" placeholder="title of playlist" />
              </div>

              <div className="flex flex-col space-y-1.5">
                Update
                <Select value={autoUpdate ? "true" : "false"} onValueChange={(value) => setAutoUpdate(value === "true" ? true : false)}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select an update method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Update</SelectLabel>
                      <SelectItem value="true">Auto Update</SelectItem>
                      <SelectItem value="false">Manual Update</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                Link
                <Input value={link} onChange={(e) => setLink(e.target.value)} id="url" placeholder="https://www.youtube.com/playlist?list=xxx" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button disabled={isLoading} onClick={() => setIsModalOpen(false)} variant="outline">Cancel</Button>
          <Button disabled={isLoading} className="bg-green-600 text-white" type="submit" onClick={addPlaylistHandler}>Save</Button>
        </CardFooter>
      </Card>

      </DialogContent>
      </Dialog>
  )
}

export default PlaylistComponent