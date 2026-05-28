import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'W7S',
  tagline: 'Open source deploy platform for GitHub-native apps',
  url: 'https://w7s.io',
  baseUrl: '/docs/',
  favicon: 'https://github.com/w7s-io.png',
  trailingSlash: true,
  organizationName: 'w7s-io',
  projectName: 'docs',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://api.fontshare.com',
        crossorigin: 'anonymous',
      },
    },
  ],
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap',
    'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,900&display=swap',
  ],
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
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'W7S',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/w7s-io/w7s-core',
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
      copyright: `Copyright ${new Date().getFullYear()} W7S LLC`,
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Getting Started', to: '/'},
            {label: 'Deploy From GitHub', to: '/deploy-from-github/'},
            {label: 'Self Host W7S', to: '/self-host/'},
            {label: 'Custom Domains', to: '/custom-domains/'},
          ],
        },
        {
          title: 'GitHub',
          items: [
            {label: 'W7S Core', href: 'https://github.com/w7s-io/w7s-core'},
            {label: 'Deploy Action', href: 'https://github.com/w7s-io/w7s-cloud'},
            {label: 'Examples', href: 'https://github.com/w7s-io/example-fullstack-ts'},
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
