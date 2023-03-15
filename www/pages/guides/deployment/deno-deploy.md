---
title: Deno Deploy
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 0
---

Pyro provides an easy way to publish to Deno Deploy using Github Actions, which
comes for free with every GitHub repository.

Place the following file in `.github/workflows/deploy.yml` and replace
`DENO_DEPLOY_PROJECT` with the name of your project on Deno Deploy.

```yaml
name: Deploy

on: [push, pull_request]

jobs:
  deploy:
    runs-on: ubuntu-latest

    permissions:
      id-token: write # This is required to allow the GitHub Action to authenticate with Deno Deploy.
      contents: read

    steps:
      - name: Clone repository
        uses: actions/checkout@v3

      - name: Download Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Install Pyro
        run: deno run -Ar https://deno.land/x/pyro/install.ts

      - name: Build the website
        working-directory: ./www
        run: pyro build

      - name: Deploy to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: DENO_DEPLOY_PROJECT
          entrypoint: https://deno.land/std/http/file_server.ts
          root: ./www/build
```
