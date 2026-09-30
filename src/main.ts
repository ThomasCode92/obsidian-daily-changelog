import { Plugin, Notice } from "obsidian";

export default class DailyChangelogPlugin extends Plugin {
  async onload() {
    console.log("Loading Daily Changelog Plugin");

    this.addCommand({
      id: "open-changelog",
      name: "Open today's changelog",
      callback: () => {
        console.log("Placeholder: Open today's changelog");
        new Notice("Daily Changelog: Placeholder command executed!");
      },
    });
  }

  async onunload() {
    console.log("Unloading Daily Changelog Plugin");
  }
}
