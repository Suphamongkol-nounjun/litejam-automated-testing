import { $ } from '@wdio/globals';

class SettingPage {
  get settingTab() {
    return $('~Setting\nTab 4 of 4');
  }

  get bluetoothDeviceMenu() {
    return $('~Bluetooth & Device');
  }

  async openSettingTab() {
    await this.settingTab.waitForDisplayed({ timeout: 5000 });
    await this.settingTab.click();
  }

  async openBluetoothMenu() {
    await this.bluetoothDeviceMenu.waitForDisplayed({ timeout: 5000 });
    await this.bluetoothDeviceMenu.click();
  }
}

export default new SettingPage();
