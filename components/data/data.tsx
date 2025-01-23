import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AudioLinesIcon,
  PlusIcon,
  VideoIcon,
} from "lucide-react"


export const statuses = [
  {
    value: "all",
    label: "All",
    icon: PlusIcon,
  },
  {
    value: "audio",
    label: "Audio",
    icon: AudioLinesIcon,
  },
  {
    value: "video",
    label: "Video",
    icon: VideoIcon,
  }
]

export const priorities = [
  {
    label: "Less than 100MB",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Less than 1GB",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "More than 1GB",
    value: "high",
    icon: ArrowUp,
  },
]
