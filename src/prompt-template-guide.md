### Variables

A `{name}` is treated as a **variable** placeholder, and superprompt will detect these and automatically show inputs for substituting their values.

```
What is a good product name for {product_description}?
```

### Generators

You can template multi-step conversations by using the `{*}` **generator** placeholder.

```
Name 3 experts who'd be great at answering "{question}"
{*}
Now answer the question from the perspective of each expert.
```

When superprompt encounters a **generator** placeholder, it temporarily yields to GPT to generate the next message.

**Generator** placeholders can be combined with a variable name to store the generated output in that variable.

```
Describe the tone of the following text in one word. Choose between professional and casual:
{them}
{*tone}
Rewrite the following text in a {tone} tone:
{you}
```

In the previous example, the generated `{*tone}` value is stored and then reused later in the prompt as `{tone}`.

### Functions (experimental)

Superprompt provides 2 built-in functions – `query` and `summarize` – for working with text files.

Note that these are currently experimental and are likely to change in future.

#### query(question)

Searches a file for excerpts that are related to the question and outputs those.

```
Consider the following excerpts:
---
{book:query(question)}
---
Pretend to be the character {character_name} from the above excerpts.
I'm going to ask you questions and I want you to respond as {character_name} would.
Take care to mimic their personality and mannerisms.
Let's start.
{question}
```

#### summarize

Summarizes the contents of a file.

```
The following is a book summary:
---
{book:summarize}
---
Give me 5 adjectives that describe the book.
```
