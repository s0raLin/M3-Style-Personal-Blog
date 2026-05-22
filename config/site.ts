const REPO_NAME = "M3-Style-Personal-Blog";

const ORIGIN = "https://s0ralin.github.io";

const BASE_PATH = `/${REPO_NAME}/`;

export const SITE_CONFIG = {
  repo: REPO_NAME,

  origin: ORIGIN,

  base: BASE_PATH,

  siteUrl: `${ORIGIN}${BASE_PATH}`,

  apiBase: "http://localhost:3001",

  seo: {
    title: "蒼璃の博客",
    description: "Material 3 风格个人博客",
  },
} as const;
