import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'W7S',
  tagline: 'Open source deploy platform for GitHub-native apps',
  url: 'https://docs.w7s.io',
  baseUrl: '/docs/',
  trailingSlash: true,
  organizationName: 'w7s-io',
  projectName: 'docs',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/w7s-io/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'W7S Docs',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/w7s-io/w7s-io',
          label: 'Core',
          position: 'right',
        },
        {
          href: 'https://github.com/w7s-io/w7s-cloud',
          label: 'Deploy Action',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Getting Started', to: '/'},
            {label: 'Deploy From GitHub', to: '/deploy-from-github/'},
            {label: 'Custom Domains', to: '/custom-domains/'},
          ],
        },
        {
          title: 'GitHub',
          items: [
            {label: 'W7S Core', href: 'https://github.com/w7s-io/w7s-io'},
            {label: 'Deploy Action', href: 'https://github.com/w7s-io/w7s-cloud'},
            {label: 'Examples', href: 'https://github.com/w7s-io/example-fullstack-ts'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} W7S.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
