import { $,expect } from '@wdio/globals';

export class Navbar {
  // --- 🔍 Locators ---
  settingTab = '~Setting\nTab 4 of 4';
  chordTab = '~Chord\nTab 1 of 4'
  scaleTab = '~Scale\nTab 2 of 4';
  performTab = '~Perform\nTab 3 of 4';

  async clickSettingTab() {
    const el = await $(this.settingTab);
    await el.waitForDisplayed({ timeout: 5000 });
    expect(await el.isDisplayed()).toBe(true);
    await el.click();
  }
  async clickChordTab() {
    const el = await $(this.chordTab);
    await el.waitForDisplayed({ timeout: 5000 });
    expect(await el.isDisplayed()).toBe(true);
    await el.click();
  }
  async clickScaleTab() {
    const el = await $(this.scaleTab);
    await el.waitForDisplayed({ timeout: 5000 });
    expect(await el.isDisplayed()).toBe(true);
    await el.click();
  }
  async clickPerformTab() {
    const el = await $(this.performTab);
    await el.waitForDisplayed({ timeout: 5000 });
    expect(await el.isDisplayed()).toBe(true);
    await el.click();
  }

  


  
}

export default new Navbar();
