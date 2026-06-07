import { defineField, defineType } from "sanity";

export default defineType({
  name: "pageComponent",
  title: "Page Component",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "componentName",
      title: "Component Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "mdxTag",
      title: "MDX Tag",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "mdxTag",
    },
  },
  initialValue: {
    title: "Flight Map",
    componentName: "FlightMap",
    mdxTag: "<FlightMap />",
    description:
      "Embeds the flight route map using the checked-in CSV data from src/data/flights.csv.",
  },
});

export interface PageComponent {
  title: string;
  componentName: string;
  mdxTag: string;
  description: string;
}
