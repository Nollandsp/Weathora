import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
} from "lucide-react";

const configs = {
  "01d": { Icon: Sun,           color: "#F59E0B", bg: "rgba(251,191,36,0.18)"   },
  "01n": { Icon: Moon,          color: "#818CF8", bg: "rgba(129,140,248,0.18)"  },
  "02d": { Icon: CloudSun,      color: "#F59E0B", bg: "rgba(251,191,36,0.13)"   },
  "02n": { Icon: CloudMoon,     color: "#818CF8", bg: "rgba(129,140,248,0.13)"  },
  "03d": { Icon: Cloud,         color: "#94A3B8", bg: "rgba(148,163,184,0.18)"  },
  "03n": { Icon: Cloud,         color: "#94A3B8", bg: "rgba(148,163,184,0.18)"  },
  "04d": { Icon: Cloud,         color: "#64748B", bg: "rgba(100,116,139,0.18)"  },
  "04n": { Icon: Cloud,         color: "#64748B", bg: "rgba(100,116,139,0.18)"  },
  "09d": { Icon: CloudDrizzle,  color: "#60A5FA", bg: "rgba(96,165,250,0.18)"   },
  "09n": { Icon: CloudDrizzle,  color: "#60A5FA", bg: "rgba(96,165,250,0.18)"   },
  "10d": { Icon: CloudRain,     color: "#3B82F6", bg: "rgba(59,130,246,0.18)"   },
  "10n": { Icon: CloudRain,     color: "#3B82F6", bg: "rgba(59,130,246,0.18)"   },
  "11d": { Icon: CloudLightning,color: "#A855F7", bg: "rgba(168,85,247,0.18)"   },
  "11n": { Icon: CloudLightning,color: "#A855F7", bg: "rgba(168,85,247,0.18)"   },
  "13d": { Icon: CloudSnow,     color: "#BAE6FD", bg: "rgba(186,230,253,0.18)"  },
  "13n": { Icon: CloudSnow,     color: "#BAE6FD", bg: "rgba(186,230,253,0.18)"  },
  "50d": { Icon: CloudFog,      color: "#94A3B8", bg: "rgba(148,163,184,0.18)"  },
  "50n": { Icon: CloudFog,      color: "#94A3B8", bg: "rgba(148,163,184,0.18)"  },
};

export default function WeatherIcon({ iconCode, size = 48, className = "" }) {
  const cfg = configs[iconCode] || configs["01d"];
  const { Icon, color, bg } = cfg;
  const wrap = Math.round(size * 1.75);

  return (
    <div
      className={`flex items-center justify-center rounded-full flex-shrink-0 ${className}`}
      style={{ width: wrap, height: wrap, background: bg }}
    >
      <Icon size={size} color={color} strokeWidth={1.5} />
    </div>
  );
}
