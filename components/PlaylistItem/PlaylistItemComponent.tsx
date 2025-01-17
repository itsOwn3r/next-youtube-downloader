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
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Edit, RefreshCcw } from "lucide-react";
  


const PlaylistItemComponent = ({ id, titleNonMutate, autoUpdateNonMutate }: {id: string; titleNonMutate: string; autoUpdateNonMutate: boolean }) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  
  const [title, setTitle] = useState("");
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);

  useEffect(() => {
    
    setTitle(titleNonMutate);
    setAutoUpdate(autoUpdateNonMutate);

  },[autoUpdateNonMutate, titleNonMutate]);
  
  const addPlaylistHandler = async () => {
    if (!autoUpdate || !title) {
        toast.error("You must provide valid data!", {
            duration: 4000,
            className: "text-xl"
          });
          return;      
    }

    try {
      setIsLoading(true);

      const response = await fetch("/api/playlist/edit", {
        method: "POST",
        body: JSON.stringify({ autoUpdate, title, id }),
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
  
  const refetchPlaylist = async () => {

    try {
      setIsLoading(true);

      const response = await fetch(`/api/playlist/refetch/${id}`);

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
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
    <div className="flex items-center gap-x-2">
      <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
      <DialogTrigger disabled={isLoading} className={cn(buttonVariants({ className: "bg-green-600 hover:bg-green-300 text-white"}))}>Edit <Edit /></DialogTrigger>
      <DialogContent>
        <DialogDescription className='hidden'></DialogDescription>
        <DialogHeader>
          <DialogTitle className="hidden">Refresh</DialogTitle>
        </DialogHeader>

        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-x-2">Edit playlist <Edit /></CardTitle>
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
                  <Input disabled value={`https://www.youtube.com/playlist?list=${id}`} id="link" placeholder="link of playlist" />
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
      
      <Button disabled={isLoading} onClick={refetchPlaylist} className="bg-green-600 hover:bg-green-300 text-white">
        Refetch <RefreshCcw />
      </Button>

      </div>
  )
}

export default PlaylistItemComponent;