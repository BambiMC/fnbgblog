import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://blog.fnbg.de",
  author: "Fabian Berger",
  desc: "Small blog about small problems",
  title: "FNBG - Blog",
  ogImage: "logo.svg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/BambiMC",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/fabian-berger-nbg/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:me@fnbg.de",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@bambi1569",
    linkTitle: `${SITE.title} on YouTube`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/profiles/76561198171864078/",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
];
