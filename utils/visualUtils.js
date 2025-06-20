// test/utils/visualUtils.js
import { expect } from '@wdio/globals';
import { attachVisualTestResultsToAllure } from './allureUtils.js';
import allure from '@wdio/allure-reporter';

/**
 * ทำการตรวจสอบภาพหน้าจอและยืนยันผล
 * @param {string} tagName - ชื่อแท็กของรูปภาพที่จะใช้เปรียบเทียบ
 */
export async function visualCheck(tagName) {
    await browser.pause(500); // ใส่ pause เล็กน้อยเผื่อหน้าจอมี animation
    const misMatchPercentage = await browser.checkScreen(tagName);
    return misMatchPercentage;
}

/**
 * ตรวจสอบ visual diff ตาม threshold ที่ยืดหยุ่น
 * @param {number} diff - ค่าความแตกต่างที่ได้จาก visualCheck
 * @param {string} tagName - ชื่อรูป baseline
 * @param {string} deviceNameForFolder - ใช้แนบไฟล์หลักฐานใน Allure
 * @param {object} thresholds - { warn: %, fail: % } เช่น { warn: 5, fail: 15 }
 */
export async function assertVisualMatch(diff, tagName, deviceNameForFolder, thresholds = { warn: 0, fail: 0 }) {
   const { warn, fail } = thresholds;

    if (diff > fail) {
        allure.addStep(`❌ Visual mismatch too high: ${diff.toFixed(3)}% (❗ Fail > ${fail}%)`);
        attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder);
        allure.endStep('failed');
        throw new Error(`Visual mismatch: ${diff.toFixed(3)}% > ${fail}%`);
    }

    if (diff > warn) {
        allure.addStep(`⚠️ Visual mismatch warning: ${diff.toFixed(3)}% (Warn > ${warn}%)`);
        attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder);
    } else {
        allure.addStep(`✅ Visual match: ${diff.toFixed(3)}% (Within acceptable range)`);
    }

    allure.endStep('passed');
}