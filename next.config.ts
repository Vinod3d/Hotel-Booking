import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images:{
  remotePatterns:[
    {
      protocol: "https",
      hostname: "utfs.io",
      pathname: "/**",
      port: ''
    }
  ]
 }
};

export default nextConfig;
 