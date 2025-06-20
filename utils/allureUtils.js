// test/utils/allureUtils.js
import fs from 'fs';
import path from 'path';

/**
 * ค้นหาไฟล์ในโฟลเดอร์ที่ชื่อขึ้นต้นด้วย tag + '--'
 * เช่น tag: 'chord-screen-default' => ไฟล์จริง: 'chord-screen-default--1080x2400.png'
 */
function findFileByTag(directory, tag) {
    if (!fs.existsSync(directory)) {
        console.log(`[Allure-Attach] Directory not found: ${directory}`);
        return null;
    }

    const files = fs.readdirSync(directory);
    const foundFile = files.find(file => file.startsWith(`${tag}--`) && file.endsWith('.png'));

    if (foundFile) {
        console.log(`[Allure-Attach] Found file: ${foundFile}`);
    } else {
        console.log(`[Allure-Attach] No file found for tag: ${tag} in ${directory}`);
    }

    return foundFile ? path.join(directory, foundFile) : null;
}

/**
 * แนบภาพผลลัพธ์ visual test (baseline, actual, diff) เข้ากับ Allure Report
 * @param {object} allure - Allure reporter instance
 * @param {string} tagName - ชื่อแท็กของรูปภาพ (ที่ใช้ใน checkScreen)
 * @param {string} deviceName - ชื่ออุปกรณ์จาก capabilities
 */
export function attachVisualTestResultsToAllure(allure, tagName, deviceName) {
    try {
        const deviceFolder = deviceName.replace(/\s+/g, '_').toLowerCase();
        console.log(`[Allure-Attach] Attaching results for tag: "${tagName}" on device: "${deviceFolder}"`);

        const baselineDir = path.join(process.cwd(), 'tests', 'baseline', deviceFolder);
        const actualDir = path.join(process.cwd(), 'tmp', 'actual', deviceFolder);
        const diffDir = path.join(process.cwd(), 'tmp', 'diff', deviceFolder);

        const baselinePath = findFileByTag(baselineDir, tagName);
        const actualPath = findFileByTag(actualDir, tagName);
        const diffPath = findFileByTag(diffDir, tagName);

        if (baselinePath) {
            allure.addAttachment('Baseline Image (ภาพต้นฉบับ)', fs.readFileSync(baselinePath), 'image/png');
        }
        if (actualPath) {
            allure.addAttachment('Actual Image (ภาพที่เทส)', fs.readFileSync(actualPath), 'image/png');
        }
        if (diffPath) {
            allure.addAttachment('Difference Image (จุดที่แตกต่าง)', fs.readFileSync(diffPath), 'image/png');
        }

    } catch (error) {
        console.error('[Allure-Attach] Failed to attach visual test results:', error);
        allure.addStep('Error occurred while attaching visual test results.');
    }
}
