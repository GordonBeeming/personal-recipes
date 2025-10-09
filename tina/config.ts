import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  // Schema updated: 2025-10-09 - thumbnailImage field added
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "recipe",
        label: "Recipes",
        path: "content/recipes",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              // Generate filename from title
              return `${values?.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`;
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Short Description",
            description: "A brief description for recipe cards (1-2 sentences)",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "datetime",
            name: "date",
            label: "Date Added",
            required: true,
          },
          {
            type: "string",
            name: "source",
            label: "Recipe Source",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              "Breakfast",
              "Lunch",
              "Dinner",
              "Dessert",
              "Appetizer",
              "Snack",
            ],
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            required: true,
            list: true,
          },
          {
            type: "string",
            name: "prepTime",
            label: "Prep Time",
            required: true,
          },
          {
            type: "string",
            name: "cookTime",
            label: "Cook Time",
            required: true,
          },
          {
            type: "string",
            name: "totalTime",
            label: "Total Time",
            required: true,
          },
          {
            type: "string",
            name: "servings",
            label: "Servings",
            required: true,
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image",
            description: "Full-size image for recipe detail page (WebP recommended: 1200x675px, ~80-120KB)",
          },
          {
            type: "image",
            name: "thumbnailImage",
            label: "Thumbnail Image",
            description: "Smaller image for recipe cards on home page (WebP recommended: 600x338px, ~40-60KB)",
          },
          {
            type: "image",
            name: "images",
            label: "Gallery Images",
            list: true,
            description: "Additional recipe photos (WebP recommended: 800x800px, ~60-100KB each)",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Recipe Content",
            isBody: true,
          },
        ],
      },
    ],
  },
});
