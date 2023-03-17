---
title: Github Pages
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 1
---

Pyro provides an easy way to publish to Github Pages using Github Actions, which
comes for free with every GitHub repository.

Place the following file in `.github/workflows/deploy.yml`.

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    permissions:
      id-token: write 
      pages: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Download Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Install Pyro
        run: deno run -Ar https://deno.land/x/pyro/install.ts

      - name: Build the website
        run: pyro build

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: './build'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```
