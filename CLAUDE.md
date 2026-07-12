# Repo notes for AI coding clients

## Check the Tina schema before touching recipe content or the parser

The recipe frontmatter is driven by the TinaCMS schema in `tina/config.ts`. Before you add or edit a recipe's frontmatter, add a field, or change how frontmatter is parsed, read the matching field definition in that file and make the change match its `type`.

This bites in a way that isn't obvious from the markdown alone. Every frontmatter field maps to a typed Tina field, and Tina's indexer assumes the YAML value matches that type. Get it wrong and indexing crashes at build/dev time instead of failing gracefully.

The one that already caught us: `servings` is `type: "string"`, so it must be quoted in YAML — `servings: "4"`. An unquoted `servings: 4` parses as a YAML number, and Tina's indexer throws `TypeError: resolvedValue.substring is not a function` while indexing the file. Match the pattern the existing recipes use rather than "tidying" a value into a bare number.

There are two rendering paths and a change has to satisfy both:

- **Tina** (dev, and prod when indexing succeeds) — needs the value to match the schema type.
- **Static fallback** (`src/lib/recipes.ts`) — a hand-rolled frontmatter parser used when Tina data isn't available. It strips surrounding quotes so a quoted `"4"` renders as `4`. If you add a field that needs special handling, update this parser too, not just the frontmatter.

So the rule: schema first, then the frontmatter, then confirm the static parser handles it. When in doubt, copy an existing recipe that already works (e.g. `content/recipes/air-fryer-pork-belly-with-mash-and-roasted-veg.md`).

## Running locally

`./run.sh` installs deps if needed and runs `npm run dev` (TinaCMS + Vite). The dev server runs Tina's local datalayer alongside Vite, so a separate `tinacms build` won't run alongside it.
