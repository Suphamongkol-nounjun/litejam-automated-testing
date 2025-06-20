// test/utils/swipeUtils.js

/**
 * ทำการปัดหน้าจอในทิศทางที่กำหนด
 * @param {'up' | 'down' | 'left' | 'right'} direction - ทิศทางที่จะปัด
 */
async function swipe(direction) {
    const { width, height } = await browser.getWindowSize();

    let startX, startY, endX, endY;

    switch (direction) {
        case 'up': // ปัดขึ้น (เลื่อนลง)
            startX = endX = width / 2;
            startY = height * 0.8;
            endY = height * 0.2;
            break;
        case 'down': // ปัดลง (เลื่อนขึ้น)
            startX = endX = width / 2;
            startY = height * 0.2;
            endY = height * 0.8;
            break;
        // สามารถเพิ่ม case 'left' และ 'right' ได้ในอนาคต
        default:
            throw new Error(`Invalid swipe direction: ${direction}`);
    }

    await browser.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 600, origin: 'pointer', x: endX, y: endY },
                { type: 'pointerUp', button: 0 },
            ],
        },
    ]);
    await browser.pause(500);
}


/**
 * เลื่อนหา Element ที่ต้องการจนเจอ หรือจนกว่าจะครบจำนวนครั้งที่กำหนด
 * @param {WebdriverIO.Element} targetElement - Element ที่ต้องการค้นหา
 * @param {number} maxSwipes - จำนวนครั้งสูงสุดที่จะปัด
 * @returns {Promise<boolean>} - คืนค่า true ถ้าเจอ, false ถ้าไม่เจอ
 */
export async function swipeUntilElementIsVisible(targetElement, maxSwipes = 5) {
    for (let i = 0; i < maxSwipes; i++) {
        if (await targetElement.isDisplayed()) {
            return true; // เจอแล้ว!
        }
        await swipe('up'); // ถ้ายังไม่เจอ ก็ปัดขึ้น (เพื่อเลื่อนจอลง)
    }
    return false;
}

/**
 * ทำการเลื่อนหน้าจอลง (เพื่อกลับไปด้านบนสุด)
 */
export async function scrollToTop() {
    console.log('Scrolling to top by swiping down...');
    await swipe('down');
}