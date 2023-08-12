import IconArrowRight from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/arrow-right.tsx";
import { type PageProps } from "../../page.ts";

export const config = {
  title: "Home",
  description:
    "Pyro was designed from the ground up to be no-config and incredibly fast.",
};

export default function Page(props: PageProps) {
  return (
    <div class="flex flex-col items-center pb-16 bg-white dark:bg-black dark:text-white">
      {props.header}
      <div class="flex justify-center items-center py-32 max-w-screen-xl">
        <div class="flex flex-col gap-8 items-center px-8 max-w-screen-md">
          <h1 class="text-4xl sm:text-6xl font-bold text-center sm:text-left">
            The{" "}
            <span class="text-red-500">SSG documentation site framework</span>
            {" "}
            you've been waiting for.
          </h1>
          <div class="w-full hidden sm:flex flex-col gap-1">
            <p class="text-gray-600 dark:text-gray-400">
              Run the following to{" "}
              <a
                href="/getting-started/installation"
                class="underline text-red-500"
              >
                install Pyro
              </a>:
            </p>
            <code class="bg-gray-100 dark:bg-gray-900 rounded flex items-center justify-between pl-4 overflow-hidden w-max">
              deno run -Ar https://deno.land/x/pyro/install.ts{" "}
              <a
                href="/getting-started/installation"
                class="bg-red-500 ml-4 p-4 text-white h-full"
              >
                <IconArrowRight />
              </a>
            </code>
          </div>
        </div>
        <div class="grow hidden md:flex items-center justify-center px-8">
          <img class="w-full" src="/pyro_bg.png" />
        </div>
      </div>
      <div class="mx-8 pb-8 flex flex-col gap-4 max-w-screen-lg">
        <h1 class="text-4xl font-semibold">Rundown</h1>
        <ul class="grid md:grid-cols-2 w-full text-xl gap-8">
          <li class="bg-gray-100 dark:bg-gray-900 rounded p-4 flex items-center gap-4">
            <span class="text-4xl">⚡️</span>{" "}
            <span>
              Pyro will help you ship a{" "}
              <b>beautiful documentation site in no time</b>.
            </span>
          </li>
          <li class="bg-gray-100 dark:bg-gray-900 rounded p-4 flex items-center gap-4">
            <span class="text-4xl">💸</span>{" "}
            <span>
              Building a custom tech stack is expensive. Instead,{" "}
              <b>focus on your content</b> and just write Markdown files.
            </span>
          </li>
          <li class="bg-gray-100 dark:bg-gray-900 rounded p-4 flex items-center gap-4">
            <span class="text-4xl">💥</span>{" "}
            <span>
              Ready for more? <b>Advanced features</b>{" "}
              like versioning, i18n, search and theme customizations are
              built-in with zero config required.
            </span>
          </li>
          <li class="bg-gray-100 dark:bg-gray-900 rounded p-4 flex items-center gap-4">
            <span class="text-4xl">🧐</span>{" "}
            <span>
              Pyro at its core is a{" "}
              <b>static-site generator</b>. That means it can be deployed{" "}
              <b>anywhere</b>.
            </span>
          </li>
        </ul>

        <h2 class="text-4xl font-semibold mt-8">Getting started</h2>

        <p>
          Understand Pyro in <b>5 minutes</b> by trying it out!
        </p>

        <p>First install Pyro</p>

        <code class="bg-gray-100 dark:bg-gray-900 rounded p-4">
          deno run -Ar https://deno.land/x/pyro/install.ts
        </code>

        <p>Create the site</p>

        <code class="bg-gray-100 dark:bg-gray-900 rounded p-4">
          pyro gen my-site
        </code>

        <p>Start the dev server</p>

        <code class="bg-gray-100 dark:bg-gray-900 rounded p-4">
          cd my-site && pyro dev
        </code>

        <p>
          Open{" "}
          <a href="http://localhost:8000" class="underline text-red-500">
            http://localhost:8000
          </a>{" "}
          and create your first site!
        </p>

        <h1 class="text-4xl font-semibold mt-8">Features</h1>

        <p>Pyro was built from the ground up to maximize DX.</p>

        <ul class="list-disc list-inside flex flex-col gap-4">
          <li>
            <b>Built with Deno, Preact, and Typescript</b>
            <br />
            Stop using antiquated technology in your stack. Embrace the new!
          </li>
          <li>
            <b>Created for developer experience first</b>
            <br />
            Stop using tools that make you miserable. Life is too short.
          </li>
          <li>
            <b>No configuration required</b>
            <br />
            Pyro has fantastic defaults, and uses a lot of magic to make sure
            that your experience is as smooth as possible. No more hunting down
            plugins!
          </li>
        </ul>
      </div>
      {props.footer}
    </div>
  );
}
