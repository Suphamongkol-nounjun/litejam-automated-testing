describe("Connect to Lite Jam RGB 24 Bluetooth", function () {
    this.timeout(60000); // เพิ่มเวลาเป็น 60 วินาที เพื่อรองรับการสแกน
  
    it("Scan and connect to Lite Jam RGB 24", async function () {
      let deviceElement;
      let found = false;
  
      // วนลูปเพื่อกดปุ่ม Scan และค้นหาอุปกรณ์ที่ต้องการ
      while (!found) {
        // ค้นหาปุ่ม Scan และคลิกเพื่อเริ่มต้นการสแกน
        const scanButton = await browser.$(
          '//android.widget.Button[@content-desc="Scan"]'
        );
        await scanButton.click();
  
        // รอแปปนึงให้การสแกน Bluetooth เสร็จ (ปรับระยะเวลาให้เหมาะสม)
        await browser.pause(5000); // รอ 5 วินาที (ปรับได้ตามต้องการ)
  
        // ค้นหาด้วย XPath ของ content-desc ที่มีชื่อ "Lite Jam RGB 24" โดยไม่สนใจ "-30"
        deviceElement = await browser.$(
          '//android.widget.ImageView[contains(@content-desc, "Lite Jam RGB 24")]'
        );
  
        // ตรวจสอบว่าเจออุปกรณ์หรือยัง
        const isDisplayed = await deviceElement.isDisplayed();
        if (isDisplayed) {
          // ถ้าเจอ, คลิกที่อุปกรณ์
          found = true;
          await deviceElement.click();
          console.log("Device found and clicked.");
          break; // ออกจากลูปเมื่อเชื่อมต่อสำเร็จ
        } else {
          // ถ้ายังไม่เจอ, ให้ทำการสแกนใหม่
          console.log("Device not found, scanning again...");
        }
      }
  
      // เชื่อมต่อกับอุปกรณ์สำเร็จแล้ว
      console.log("Successfully connected to Lite Jam RGB 24 Bluetooth.");
  
      // ใช้ UiScrollable เพื่อเลื่อนหาปุ่มที่มีชื่อ "ee01 Properties: Write, "
      let propertiesButton;
      try {
        propertiesButton = await browser.$(
          'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("ee01\nProperties: Write, "))'
        );
        console.log("Scrolled and found the Properties button.");
      } catch (error) {
        console.log("Error while scrolling or finding the button: ", error);
      }
  
      // รอจนกว่า element จะพร้อมใช้งานและคลิกได้
      await browser.waitUntil(async () => {
        const isDisplayed = await propertiesButton.isDisplayed();
        const isClickable = await propertiesButton.isClickable();
        return isDisplayed && isClickable;
      }, {
        timeout: 10000, // รอสูงสุด 10 วินาที
        timeoutMsg: 'Properties button not clickable after 10 seconds'
      });
  
      // คลิกที่ปุ่ม Properties
      await propertiesButton.click();
      console.log('Clicked on Properties button.');
    });
  });
  