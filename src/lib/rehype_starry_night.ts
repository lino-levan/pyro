import {
  all,
  createStarryNight,
  Element,
  ElementContent,
  Node,
  type Plugin,
  Root,
  toString,
  visit,
} from "../../deps.ts";

const starryNight = await createStarryNight(all);

export function rehypeStarryNight(): Plugin<Node[], Root> {
  const prefix = "language-";

  return (tree) => {
    visit(tree, "element", (node: Element, index: number, parent: Element) => {
      if (!parent || index === null || node.tagName !== "pre") {
        return;
      }

      const head = node.children[0];

      if (
        !head ||
        head.type !== "element" ||
        head.tagName !== "code" ||
        !head.properties
      ) {
        return;
      }

      const classes = head.properties.className;

      if (!Array.isArray(classes)) return;

      const language = classes.find(
        (d) => typeof d === "string" && d.startsWith(prefix),
      );

      if (typeof language !== "string") return;

      const scope = starryNight.flagToScope(language.slice(prefix.length));

      // Maybe warn?
      if (!scope) return;

      // @ts-ignore idk I didn't write this and typescript is complaining
      const fragment = starryNight.highlight(toString(head), scope);
      const children = fragment.children as Array<ElementContent>;

      parent.children.splice(index, 1, {
        type: "element",
        tagName: "div",
        properties: {
          className: [
            "highlight",
            "highlight-" + scope.replace(/^source\./, "").replace(/\./g, "-"),
          ],
        },
        children: [{
          type: "element",
          tagName: "pre",
          properties: {},
          children,
        }],
      });
    });
  };
}
