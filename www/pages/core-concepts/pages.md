---
title: Pages
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 0
---

In this section, we will learn about creating pages in Pyro.

## Add a Markdown page​

Create a file called `/pages/hello.md`:

```md
---
title: hello page title
description: hello page description
---

# Hello

How are you doing today?
```

Once you save the file, the development server will automatically reload the
changes. Now open [http://localhost:8000/hello](http://localhost:8000/hello) and
you will see the new page you just created!

## Add a MDX page

Create a file called `/pages/hello_mdx.md`:

```mdx
---
title: hello mdx
description: mdx demo
---

<h1 style={{color:red}}>a red header</h1>
```

Once you save the file, the development server will automatically reload the
changes. Now open
[http://localhost:8000/hello_mdx](http://localhost:8000/hello_mdx) and you will
see the new page you just created!

## Routing

If you are familiar with other static site generators or tools like Next.js,
this "file-sytem routing" approach will feel very similar (because it's the
same)! Let's go through some samples to clarify the behavior:

- `/pages/index.md` → `[baseUrl]`
- `/pages/foo.md` → `[baseUrl]/foo`
- `/pages/foo/test.md` → `[baseUrl]/foo/test`
- `/pages/foo/index.md` → `[baseUrl]/foo`
