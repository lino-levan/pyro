---
title: Markdown Features
description: Pyro was designed from the ground up to be no-config and incredibly fast.
index: 2
---

Pyro supports the entirety of the markdown spec as well as many common
extensions.

Below are some examples from the excellent
[markdownguide.org](https://www.markdownguide.org/cheat-sheet/)

## Headings

```md
### H3

#### H4

##### H5
```

### H3

#### H4

##### H5

## Formatted text

```md
**bold text**

_italicized text_

> blockquote

[text with link](https://www.example.com)

~~Crossed out text~~
```

**bold text**

_italicized text_

> blockquote

[text with link](https://www.example.com)

~~Crossed out text~~

## Lists

```md
### Numbered list

1. First item
2. Second item
3. Third item

### Unordered list

- First item
- Second item
- Third item

### Checklist

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
```

### Numbered list

1. First item
2. Second item
3. Third item

### Unordered list

- First item
- Second item
- Third item

### Checklist

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

## Code blocks

````md
`code`

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
`` `
```
````

`code`

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

## HTML

```md
<image src="/icon.png" width="100px">

<button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded" onClick="alert('hi!')">Click
Me</button>
```

<image src="/icon.png" width="100px">

<button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded" onClick="alert('hi!')">Click
Me</button>

## Separator

```md
---
```

---

## Tables

```md
| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |
```

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |
