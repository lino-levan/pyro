---
title: Configuration
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 1
---

Pyro has a very simplistic view of configurations, there is only one file you
need to worry about (being `pyro.yml`).

## What goes into a `pyro.yml`?

This is just a standard yaml configuration file. Inside you will define all
properties related to pyro and plugins you may install.

```yaml
# The title of the site
title: Pyro

# The Github repository for the documentation site (optional)
github: https://github.com/lino-levan/pyro

# Any copyright information you want to include in the footer (optional)
copyright: |-
  Copyright © 2023 Lino Le Van
  MIT Licensed

# Links in the footer (optional)
footer:
  # Header of the column
  Learn:
    - Introduction /
    - Installation /getting-started/installation
  Community:
   - Discord https://discord.gg/XJMMSSC4Fj
   - Support https://github.com/lino-levan/pyro/issues/new

# Any plugins you want to be used (optional)
plugin:
  - https://deno.land/x/pyro/plugins/demo.tsx
```

## How do I configure individual pages?

You can configure individual page metadata using markdown frontmatter. We
support yaml/toml/json.

Here is an example in YAML:

```md
---
title: Title of Page
description: Metadata description of page
index: 0
---
```

- `title` - The title of the page which also shows up as a large header
- `description` - The description of the page for SEO and embeds
- `index` - Used in determining [sidebar order](/guides/docs/sidebar)
