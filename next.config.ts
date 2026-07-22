import type { NextConfig } from "next";

// Cafe24 Linux hosting serves plain static files over Apache — no Node.js
// process, no image-optimization server, no rewrites. `output: "export"`
// produces a fully static `out/` folder; `trailingSlash` gives every route
// its own `index.html` (so `/guide/` resolves without server-side routing
// rules); `images.unoptimized` is required because the default next/image
// loader needs a running Node server we won't have.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
