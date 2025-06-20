import { expect } from "chai";
import { captureAndCompareScreenshot,takeScreenshot } from "./utils/screenshotUtils.js"

describe("Verify Scrolling and Clicking on Battery", function () {
  this.timeout(30000);

  it("Scroll to Battery and Click", async function () {
    // ค้นหา Battery และ Scroll ไปที่มัน
    const batteryElement = await browser.$(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Battery"))'
    );
    
    // ตรวจสอบว่า Battery ปรากฏ และคลิก
    expect(await batteryElement.isDisplayed()).to.be.true;
    await takeScreenshot("BatteryMenu")
    await batteryElement.click();
  });

  it("Check Battery Details Screen", async function () {
    // ตรวจสอบว่าเข้าสู่หน้า Battery
    const batteryTitle = await browser.$("android.widget.TextView");
    expect(await batteryTitle.getText()).to.include("Battery");

    await captureAndCompareScreenshot("Batterysetting");

  });
});
