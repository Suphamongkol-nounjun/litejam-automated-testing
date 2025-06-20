import { $ } from '@wdio/globals';

export class BluetoothPage {
  // --- 🔍 Locators ---
  settingTab = '~Setting\nTab 4 of 4';
  bluetoothMenu = '~Bluetooth & Device';
  refreshButton =
    '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.Button';
  deviceByName = (name) => `~${name}`;
  connectButtonsByDevice = (name) =>
    `//android.view.View[@content-desc="${name}"]/android.widget.Button`;
  connectingText = '~Connecting...';
  connectedText = '~CONNECTED';
  connectText = '~(Connect: 1 Device)';

  // --- 🧭 Actions ---
  async openSettingTab() {
    const el = await $(this.settingTab);
    await el.waitForDisplayed({ timeout: 5000 });
    await el.click();
  }

  async openBluetoothMenu() {
    const el = await $(this.bluetoothMenu);
    await el.waitForDisplayed({ timeout: 5000 });
    await el.click();
  }

  async clickRefresh() {
    const el = await $(this.refreshButton);
    await el.waitForDisplayed({ timeout: 5000 });
    await el.click();
  }

  async findDeviceWithRetry(deviceName, maxAttempts = 3) {
    for (let i = 0; i < maxAttempts; i++) {
      const device = await $(this.deviceByName(deviceName));
      if (await device.isDisplayed()) {
        return device;
      }

      if (i < maxAttempts - 1) {
        await this.clickRefresh();
        await browser.pause(5000);
      }
    }
    return null;
  }

  async connectToDevice(deviceName) {
    const buttons = await $$(this.connectButtonsByDevice(deviceName));
    for (const btn of buttons) {
      await btn.waitForDisplayed({ timeout: 5000 });
      await btn.click();

      try {
        const connecting = await $(this.connectingText);
        await connecting.waitForDisplayed({ timeout: 5000 });

        const connected = await $(this.connectedText);
        const connectStatus = await $(this.connectText);
        await connected.waitForDisplayed({ timeout: 5000 });
        await connectStatus.waitForDisplayed({ timeout: 5000 });

        return true;
      } catch (e) {
        // Fail silently and try next button
      }

      await browser.pause(3000);
    }
    return false;
  }
}

export default new BluetoothPage();
