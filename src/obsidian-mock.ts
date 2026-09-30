export class Plugin {
  addCommand(options: any) {
    return { id: options.id };
  }
  addSettingTab(options: any) {
    return {};
  }
}

export class PluginSettingTab {
  display() {}
}

export class Setting {
  constructor(public name: string) {}
  addText(options: any) {}
  addDropdown(options: any) {}
  addToggle(options: any) {}
}

export class Notice {
  constructor(public message: string) {
    console.log(`Notice: ${message}`);
  }
}

