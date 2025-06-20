// test/specs/app.launch.spec.js
import allure from '@wdio/allure-reporter';
import { expect } from '@wdio/globals'; 
import { captureAndCompareScreenshot, takeScreenshot } from '../../../utils/screenshotUtils.js'; 
import { startScreenRecording,stopScreenRecording } from '../../../utils/recordScreen.js';
import ChordScreen from '../../pageobjects/chord.page.js';

describe('Application Startup and Default State', function () {
  this.timeout(90000); 

  allure.addFeature("Application Core");
  allure.addStory("App Launch & Default Screen");

before(async () => {
  console.log('--- beforeAll: Initial app setup and permission handling ---');

  // Pause for app to launch
  await browser.pause(3000); 

  // กรณีที่ต้องเคลียร์ app (เปิดใช้เมื่อจำเป็น)
  // await driver.execute('mobile: clearApp', { appId: 'co.notero.litejam' });
  // await browser.pause(3000); 

  // Handle permission 1
  const permissionsButton = await $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');
  if (await permissionsButton.isDisplayed()) {
    console.log('Permission 1 displayed, clicking...');
    await permissionsButton.click();
    await browser.pause(2000);
  }

  // Handle permission 2
  const locationButton = await $('id=com.android.permissioncontroller:id/permission_allow_button');
  if (await locationButton.isDisplayed()) {
    console.log('Permission 2 displayed, clicking...');
    await locationButton.click();
    await browser.pause(2000);
  }

  // ScrollView View[3] คลิกเพื่อเข้าหน้าแรก
  const introView = await $('//android.widget.ScrollView/android.view.View[3]');
  if (await introView.isDisplayed()) {
    console.log('Intro View displayed, clicking...');
    await introView.click();
    await browser.pause(2000);
  }

  console.log('--- beforeAll: Setup and permission handling done ---');
});

 beforeEach(async function () {
    const testName = this.currentTest.title.replace(/\s+/g, '_'); // แปลงชื่อให้ใช้เป็นชื่อไฟล์ได้
    console.log(`--- beforeEach: Starting test "${testName}" ---`);
    await startScreenRecording();
    this.testNameForReport = testName; // เก็บไว้ใช้ตอนหลังEach
  });

afterEach(async function () {
  const testName = this.testNameForReport;
  await stopScreenRecording(testName);

  const screenshotBase64 = await browser.takeScreenshot();
  allure.addAttachment(`📷 Screenshot - ${testName}`, Buffer.from(screenshotBase64, 'base64'), 'image/png');
});

 it('TC-APP-001: should launch the app and default to Chord screen', async function () {
  allure.startStep('Verify default screen is Chord tab and content');
  await ChordScreen.verifyChordScreenUI();
  allure.addStep('✅ All UI elements verified');
  allure.endStep('passed');
});
});