---
title: Configuration
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 1
---

Pyro has a very simplistic view of configurations, there is only one file you
need to worry about (being `deno.jsonc`).

## What goes into a `deno.jsonc`?

This is just a regular deno configuration file so all of the regular fields can
go into there. There is one additional namespace which contains all of the
configuration specific to Pyro.

```json
{
  // ...
  "pyro": {
    // The title of the site
    "title": "Pyro",
    // The Github repository for the documentation site (optional)
    "github": "https://github.com/lino-levan/pyro"
  }
}
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
