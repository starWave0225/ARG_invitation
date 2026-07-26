import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isEdgeOnePages = process.env.EDGEONE_PAGES === "true";
const isStaticExport = isGitHubPages || isEdgeOnePages;
const githubPagesBasePath = "/ARG_invitation";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      ...(isGitHubPages
        ? {
            basePath: githubPagesBasePath,
            assetPrefix: githubPagesBasePath,
          }
        : {}),
    }
  : {};

export default nextConfig;
