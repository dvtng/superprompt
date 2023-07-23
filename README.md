<div align="center">
  <a href="https://github.com/dvtng/superprompt">
      <img src="public/logo.svg" alt="Logo" width="60" height="60" />
  </a>
  <h1 align="center">superprompt</h1>
  <p align="center">
    The Prompt Development Environment for GPT.
  </p>
  <img src="public/screenshot.png" alt="Superprompt screenshot" width="100%" />
</div>

## Use

To quickly get started, visit [superprompt.dvtng.com](https://superprompt.dvtng.com). Alternatively, follow the instructions below to run it locally.

## Running locally

Clone this repository.

```sh
git clone https://github.com/dvtng/superprompt.git
```

Install dependencies.

```sh
cd superprompt
npm install
```

Start the server.

```sh
npm run dev
```

## Writing prompt templates

Superprompt enables you to create prompt templates with placeholders.

### Variables

A `{name}` is a **variable** placeholder that allows you to input values for substitution.

```
What is a good product name for {product_description}?
```

### Generators

Use the `{*}` **generator** placeholder to create multi-step conversations.

```
Name 3 experts who'd be great at answering "{question}"
{*}
Now answer the question from the perspective of each expert.
```

When encountering a **generator** placeholder, superprompt yields to GPT to generate the next message.

You can combine a **generator** placeholder with a variable name to store the generated output.

```
Describe the tone of the following text in one word. Choose between professional and casual:
{them}
{*tone}
Rewrite the following text in a {tone} tone:
{you}
```

In this example, the generated `{*tone}` value is stored and reused as `{tone}` later in the prompt.

### Functions (experimental)

Superprompt provides some built-in functions that can be called from templates
by placing them in a placeholder, e.g. `{now()}`.

Please note that these are currently experimental and may change in the future.

#### google(query)

Searches Google with the given query.

```
{google("What is Apple's current stock price?")}
```

#### now()

Returns the current date as a string.

#### location()

Returns the user's current location as a JSON object. Uses the browser's
geolocation API and requires the user to grant permission.

#### math(expression)

Evaluates a mathematical expression.

#### weather(latitude, longitude)

Retrieves the current weather at the given latitude and longitude as a JSON
object.

#### file:query(question)

Searches a file for excerpts that are related to the question and outputs them.

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

#### file:summarize()

Summarizes the contents of a file.

```
The following is a book summary:
---
{book:summarize()}
---
Give me 5 adjectives that describe the book.
```
