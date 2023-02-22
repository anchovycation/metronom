export default {
  title: 'metronom',
  base: '/metronom/',
  description: 'Metronom is user friendly Redis ORM',
  lang: "en-US",
  lastUpdated: true,
  themeConfig: {
    logo: "/metronom.png",
    nav: [
      { text: "Github", link: "https://github.com/anchovycation/metronom" },
      { text: "npm", link: "https://www.npmjs.com/package/metronom" },
      {
        text: "Releases",
        link: "https://github.com/anchovycation/metronom/releases",
      },
    ],
    sidebar: [
      {
        text: "Getting Started",
        link: "getting-started/",
        items: [
          {
            text: "What is Metronom?",
            link: "getting-started/",
          },
          {
            text: "Installation",
            link: "getting-started/installation",
          },
          {
            text: "Let's start",
            link: "getting-started/lets-start",
          },
        ],
      },
      {
        text: "Detailed Documentation",
        link: "docs/",
        items: [
          {
            text: "Metronom",
            link: "docs/classes/Metronom.default.html",
          },
          {
            text: "Model",
            link: "docs/classes/Model.default.html",
          },
          {
            text: "ModelInstance",
            link: "docs/classes/ModelInstance.default.html",
          },
        ],
      },
      {
        text: "Migrating",
        items: [
          {
            text: "Migrating to v2.0.0",
            link: "migrating/to-v2-0-0.html",
          },
        ],
      },
      {
        text: "Change Notes",
        link: "change-notes/"
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/anchovycation/metronom" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2022-present",
    },
  },

  head: [
    ["link", { rel: "icon", href: `metronom/metronom.png` }],
    ["meta", { name: "theme-color", content: "#6688C1" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["link", { rel: "stylesheet", href: "/styles.css" }],
    [
      "script",
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-NLB1TXWH4F",
      },
    ],
    [
      "script",
      {},
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NLB1TXWH4F');
      `,
    ],
  ],
}