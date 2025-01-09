import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AudioLinesIcon,
  PlusIcon,
  VideoIcon,
} from "lucide-react"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

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
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
]
