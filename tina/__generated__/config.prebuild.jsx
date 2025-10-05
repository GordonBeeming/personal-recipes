// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  // Tina Cloud config
  clientId: process.env.VITE_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "recipe",
        label: "Recipes",
        path: "content/recipes",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date Added",
            required: true
          },
          {
            type: "string",
            name: "source",
            label: "Recipe Source",
            required: true
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
              "Snack"
            ]
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            required: true,
            list: true
          },
          {
            type: "string",
            name: "prepTime",
            label: "Prep Time",
            required: true
          },
          {
            type: "string",
            name: "cookTime",
            label: "Cook Time",
            required: true
          },
          {
            type: "string",
            name: "totalTime",
            label: "Total Time",
            required: true
          },
          {
            type: "string",
            name: "servings",
            label: "Servings",
            required: true
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image"
          },
          {
            type: "image",
            name: "images",
            label: "Gallery Images",
            list: true
          },
          {
            type: "rich-text",
            name: "body",
            label: "Recipe Content",
            isBody: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
