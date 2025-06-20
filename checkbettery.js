import allure from '@wdio/allure-reporter';
import { expect } from "chai";
import { captureAndCompareScreenshot, takeScreenshot } from "./utils/screenshotUtils.js";

describe("Settings Menu Test", function () {
  this.timeout(30000);

  // เรียก addFeature สำหรับ Feature หลักของชุดเทส
  allure.addFeature("Settings");

  const menuItems = ["About phone", "Wi-Fi", "Bluetooth", "Battery"];

  menuItems.forEach((menu) => {
    it(`Scroll to ${menu} and Click`, async function () {
      // เพิ่ม Story สำหรับแต่ละเมนู
      allure.addStory(`User can access ${menu} menu`);
      
      allure.startStep(`Scroll to ${menu}`);
      const menuElement = await browser.$(
        `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${menu}"))`
      );

      expect(await menuElement.isDisplayed()).to.be.true;
      await takeScreenshot(`${menu}Menu`);
      allure.endStep("passed");

      allure.startStep(`Click on ${menu}`);
      await menuElement.click();
      allure.endStep("passed");

      allure.startStep(`Verify ${menu} screen`);
      const titleElement = await browser.$("android.widget.TextView");
      expect(await titleElement.getText()).to.include(menu);
      await captureAndCompareScreenshot(`${menu}Screen`);
      allure.endStep("passed");

      // ✅ กดปุ่ม Back กลับมาหน้า Settings
      allure.startStep("Navigate back to Settings");
      await driver.back();
      allure.endStep("passed");
    });
  });
});
