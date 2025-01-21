"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { GlobeLock } from 'lucide-react';
import { Switch } from '../ui/switch';


interface MainProps {

  proxy: {

    id: number;

    protocol: string;

    ip: string;

    port: number;

    isActive: boolean;

  } | null;

  defaultQuality: string | "360p" | "480p" | "720p" | "1080p";

}


const Proxy = ({ proxy, defaultQuality }: MainProps) => {

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [protocol, setProtocol] = useState<"http" | "https">("http");

  const [ip, setIp] = useState("");

  const [port, setPort] = useState(0);
  

  const [quality, setQuality] = useState<string |"360p" | "480p" | "720p" | "1080p">("480p");

  const router = useRouter();

  useEffect(() => {

    setProtocol((proxy?.protocol === "http" || proxy?.protocol === "https") ? proxy.protocol : "http");
    setIp(proxy?.ip || "127.0.0.1");
    setPort(proxy?.port || 443);
    setQuality(defaultQuality);
  },[defaultQuality, proxy]);



  const switchProxy = async () => {

    try {
      setIsLoading(true);

      const response = await fetch("/api/proxy/switch", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        toast.error("Failed to change proxy stete...", {
            duration: 4000,
            className: "text-xl"
          });
          return;
      }

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


  const proxyChangeHandler = async () => {
    if (!protocol || !ip || !port) {
        toast.error("You must provide valid data!", {
            duration: 4000,
            className: "text-xl"
          });
          return;      
    }
    try {
      setIsLoading(true);

      const response = await fetch("/api/proxy", {
        method: "POST",
        body: JSON.stringify({ protocol, ip, port }),
      });

      if (!response.ok) {
        toast.error("Failed to set the proxy...", {
            duration: 4000,
            className: "text-xl"
          });
          return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Proxy has been set successfully!", {
            duration: 4000,
            className: "text-xl"
          });
          setIsModalOpen(false);
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

  const proxyTestHandler = async () => {
    if (!protocol || !ip || !port) {
        toast.error("You must provide valid data!", {
            duration: 4000,
            className: "text-xl"
          });
          return;      
    }
    try {
      setIsLoading(true);

      const response = await fetch("/api/proxy/test", {
        method: "POST",
        body: JSON.stringify({ protocol, ip, port }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
            duration: 4000,
            className: "text-xl"
          });
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

  const qualityChangeHandler = async () => {
    if (!quality) {
        toast.error("You must provide valid data!", {
            duration: 4000,
            className: "text-xl"
          });
          return;      
    }
    try {
      setIsLoading(true);

      const response = await fetch("/api/quality", {
        method: "POST",
        body: JSON.stringify({ quality }),
      });

      const data = await response.json();

      if (data.success) {
        setIsModalOpen(false);
        toast.success(data.message, {
            duration: 4000,
            className: "text-xl"
          });
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


  const [activeTab, setActiveTab] = useState("settings");


  const switchChangeHandler = (e: "360p" | "480p" | "720p" | "1080p") => {
    console.log(e);
    setQuality(e);
  }

  return (
    <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
    <DialogTrigger className=""><GlobeLock className={cn(proxy?.isActive ? "text-green-600" : "text-red-500")} /></DialogTrigger>
    <DialogContent>
      <DialogDescription className='hidden'></DialogDescription>
      <DialogHeader>
        <DialogTitle className="hidden">Set/Delete Peoxy</DialogTitle>
      </DialogHeader>

      <div className="flex w-full gap-x-2">
        <Button className='w-full' onClick={() => setActiveTab("settings")} variant={activeTab === "settings" ? "default" : "outline"}>Settings</Button>
        <Button className='w-full' onClick={() => setActiveTab("proxy")} variant={activeTab === "proxy" ? "default" : "outline"}>Proxy</Button>
      </div>

      <Card className={cn(activeTab !== "settings" && "hidden")}>
            <CardHeader>
              <CardTitle>Default quality</CardTitle>
              <CardDescription>Set a default quality for downloading videos!</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={qualityChangeHandler}>
                <span className="flex items-center justify-between gap-x-4 py-3 text-lg border-b">360p<Switch checked={quality === "360p"} onClick={() => switchChangeHandler("360p")} /></span>
                <span className="flex items-center justify-between gap-x-4 py-3 text-lg border-b">480p<Switch checked={quality === "480p"} onClick={() => switchChangeHandler("480p")} /></span>
                <span className="flex items-center justify-between gap-x-4 py-3 text-lg border-b">720p<Switch checked={quality === "720p"} onClick={() => switchChangeHandler("720p")} /></span>
                <span className="flex items-center justify-between gap-x-4 py-3 text-lg border-b">1080p<Switch checked={quality === "1080p"} onClick={() => switchChangeHandler("1080p")} /></span>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button disabled={isLoading} className="bg-green-600 text-white" type="submit" onClick={qualityChangeHandler}>Save</Button>
            </CardFooter>
          </Card>

          <Card className={cn(activeTab !== "proxy" && "hidden")}>
            <CardHeader>
              <CardTitle>Set/Delete Peoxy</CardTitle>
              <CardDescription>Proxy is now {proxy?.isActive ? <span className="text-base text-green-600">Activated!</span> : <span className="text-base text-red-500">Deactivated!</span>}</CardDescription>
              <Button disabled={isLoading} onClick={switchProxy} variant="outline" className={cn("text-lg text-white", proxy?.isActive ? "bg-red-500" : "bg-green-500")}>{proxy?.isActive ? "Deactivate" : "Activate"}</Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={proxyChangeHandler}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    Protocol
                    <Select value={protocol} onValueChange={(value) => setProtocol(value as "http" | "https")}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select a protocol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Protocol</SelectLabel>
                          <SelectItem value="http">HTTP</SelectItem>
                          <SelectItem value="https">HTTPS</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    IP
                    <Input value={ip} onChange={(e) => setIp(e.target.value)} id="ip" placeholder="ip of proxy server" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    Port
                    <Input value={port} onChange={(e) => setPort(Number(e.target.value))} id="port" placeholder="port of proxy server" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button disabled={isLoading} onClick={() => setIsModalOpen(false)} variant="outline">Cancel</Button>
              <Button disabled={isLoading} className="bg-gray-600 text-white" type="submit" onClick={proxyTestHandler}>Test Proxy</Button>
              <Button disabled={isLoading} className="bg-green-600 text-white" type="submit" onClick={proxyChangeHandler}>Save</Button>
            </CardFooter>
          </Card>

    </DialogContent>
  </Dialog>
  )
}

export default Proxy