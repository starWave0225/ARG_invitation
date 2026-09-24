import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isOffline = process.env.OFFLINE_BUILD === "true";
const githubPagesBasePath = "/ARG_invitation";

const nextConfig: NextConfig = isGitHubPages || isOffline
  ? {
      output: "export",
      trailingSlash: true,
      basePath: isOffline ? "" : githubPagesBasePath,
      assetPrefix: isOffline ? "" : githubPagesBasePath,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
