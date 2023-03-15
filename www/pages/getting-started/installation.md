---
title: Installation
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 0
---

Pyro(raptor) is essentially just a [Deno CLI tool](https://deno.land).

## Requirements

- Deno version 1.31.2 or above (which can be checked by running
  `deno --version`). You can use `deno upgrade` or [tea](https://tea.xyz) for
  managing multiple versions of Deno on a single machine (if neccessary).

If these requirements are met, you should be able to install the CLI:

```bash
deno run -Ar https://deno.land/x/pyro/install.ts
```

## Scaffold your first site

With the CLI installed, scaffolding your first Pyro site is easy:

```
pyro gen my-pyro-site
```

In the future, this will support community-made templates but for now there are
no other configuration options available.

## Project structure

Assuming you are using the default template and you named your site
`my-pyro-site`, you will see the following files generated under the
`my-pyro-site/` directory.

```
my-pyro-site
├── pages
│   ├── getting-started
│   │   ├── index.md
│   │   └── submenu.md
│   └── index.md
├── static
│   └── icon.png
└── pyro.yml
```

### Project structure rundown

- `/pages/` - Contains the markdown files for your documentation. We will go
  into more detail into how this is organized in
  [Configuration](/getting-started/configuration).
- `/static/` - Contains any static assets that you may need (images, audio,
  etc.)
- `pyro.yml` - The only real configuration file for your site. Your site name as
  well as any plugins will be defined here. Again there is more detail in
  [Configuration](/getting-started/configuration).

## Running the development server

To preview your changes as you edit the files, you can run a local development
server that will serve your website and reflect the latest changes.

```bash
cd my-pyro-site
pyro dev
```

By default, a browser window will open at http://localhost:8000.

Congratulations! You have just created your first Pyro site! Browse around the
site to see what's available.

## Build

Pyro is a modern static website generator so we need to build the website into a
directory of static contents and put it on a web server so that it can be
viewed. To build the website:

```bash
pyro build
```

and contents will be generated within the `/build` directory, which can be
copied to any static file hosting service like
[GitHub pages](https://pages.github.com/), [Vercel](https://vercel.com/) or
[Netlify](https://www.netlify.com/). Check out the docs on
[deployment](/guides/deployment) for more details.

## Problems?​

Ask for help on our
[Github repository](https://github.com/lino-levan/pyro/issues/new) or our
[Discord server](https://discord.gg/XJMMSSC4Fj).
