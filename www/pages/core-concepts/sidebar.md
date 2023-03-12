---
title: Sidebar
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 1
---

Pyro can **create a sidebar automatically** from your **filesystem structure**:
each folder creates a sidebar category, and each file creates a documentation
link.

While categories can just be empty, often times we want to fill them with
content like any other documentation link. This can be done by placing an
`index.md` under the folder or creating a file at the same level with the same
name.

## Metadata

Most of the time, we want to place the items on the sidebar using a specific
order (instead of being alphabetical). We can do this using the `index` property
of the frontmatter. Pages are sorted from least index to most index. Pages
without an index property will be treated as having an index of 0.

This page has an index of 1 (as it is the second page of the category). In
frontmatter, it would look something like this:

```md
---
index: 1
---
```
