import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/ARG_invitation";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      trailingSlash: true,
      basePath: githubPagesBasePath,
      assetPrefix: githubPagesBasePath,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
