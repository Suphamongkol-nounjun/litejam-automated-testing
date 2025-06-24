// test/specs/local/LitejamLocal.e2e.js
import allure from '@wdio/allure-reporter';
import { browser, expect } from '@wdio/globals';
import ChordScreen from '../../pageobjects/chord.page.js';
import { ROOT_NOTES,CHORD_TYPES } from '../../pageobjects/chord.page.js';
import BluetoothPage from '../../pageobjects/bluetooth.page.js';
import { attachVisualTestResultsToAllure } from '../../../utils/allureUtils.js';
import { visualCheck,assertVisualMatch } from '../../../utils/visualUtils.js';
import { startScreenRecording, stopScreenRecording } from '../../../utils/recordScreen.js';

// ✅ FIXED: ใช้ function() เพื่อรักษา Test Context
describe('Notero LiteJam Application Tests', function () {
    this.timeout(180000); // เพิ่มเวลา timeout สำหรับทุกเทสใน suite นี้

    // // ✅ FIXED: ใช้ async function()
    // before(async function () {
    //     console.log('--- beforeAll: Initial app setup and permission handling ---');
    //     await browser.pause(3000);
    //     const permissionsButton = await $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');
    //     if (await permissionsButton.isDisplayed()) {
    //         console.log('Permission 1 displayed, clicking...');
    //         await permissionsButton.click();
    //         await browser.pause(2000);
    //     }
    //     const locationButton = await $('id=com.android.permissioncontroller:id/permission_allow_button');
    //     if (await locationButton.isDisplayed()) {
    //         console.log('Permission 2 displayed, clicking...');
    //         await locationButton.click();
    //         await browser.pause(3000);
    //     }
    //     const voiceButton = await $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button')
    //     if (await voiceButton.isDisplayed()) {
    //         console.log('Permission 3 displayed, clicking...');
    //         await voiceButton.click();
    //         await browser.pause(2000);
    //     }
    //     const introView = await $('//android.widget.ScrollView/android.view.View[3]');
    //     if (await introView.isDisplayed()) {
    //         console.log('Intro View displayed, clicking...');
    //         await introView.click();
    //         await browser.pause(2000);
    //     }
        
    //     console.log('--- beforeAll: Setup and permission handling done ---');
    // });
    before(async function () {
    console.log('--- beforeAll: Initial app setup and permission handling ---');

    const tryClick = async (selector, label) => {
        try {
            const el = await $(selector);
            if (await el.isDisplayed()) {
                console.log(`${label} displayed, clicking...`);
                await el.click();
                await browser.pause(3000);
            }
        } catch (e) {
            console.warn(`${label} not found or failed: ${e.message}`);
        }
    };

    await tryClick('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button', 'Permission 1');
    await tryClick('id=com.android.permissioncontroller:id/permission_allow_button', 'Permission 2');
    await tryClick('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button', 'Permission 3');
    await tryClick('//android.widget.ScrollView/android.view.View[3]', 'Intro View');

    console.log('--- beforeAll: Setup and permission handling done ---');
});

    beforeEach(async function () {
        const testName = this.currentTest.title.replace(/\s+/g, '_');
        console.log(`--- beforeEach: Starting test "${testName}" ---`);
        await startScreenRecording();
        this.testNameForReport = testName;
    });

    afterEach(async function () {
    const testName = this.testNameForReport || 'test';
    
    if (this.currentTest.state === 'failed') {
        const screenshot = await browser.takeScreenshot();
        allure.addAttachment(`❌ Screenshot (Fail) - ${testName}`, Buffer.from(screenshot, 'base64'), 'image/png');
    }

    await stopScreenRecording(testName);
});



    // ✅ FIXED: ใช้ function()
    describe('Application Startup and Connectivity', function () {
        allure.addFeature("Application Core");
        
        // ✅ REFACTORED: ใช้โครงสร้างที่สมบูรณ์
       it('TC-APP-001: should launch the app and default to Chord screen', async function () {
    const tagName = 'chord-screen-default';
    const deviceNameForFolder = browser.capabilities.desired?.deviceName || browser.capabilities.deviceName || 'unknown';

    allure.addStory("App Launch & Default Screen");
    allure.startStep('Verify default screen visually');

    try {
        await visualCheck(tagName);
        allure.addStep('✅ UI matches the baseline image');
        allure.endStep('passed');

    } catch (error) {
        allure.addStep(`❌ Visual check failed: ${error.message}`);

        // ✅ แนบภาพก่อนปิด step
        attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder);

        allure.endStep('failed'); // ปิด step หลังแนบภาพ

        throw error;
    }
});


        it('TC-APP-002: ควรเชื่อมต่อ Lite Jam RGB 24 ได้สำเร็จ และกลับมาหน้า Chord', async function () {
    const deviceNameForFolder = browser.capabilities.desired?.deviceName || browser.capabilities.deviceName || 'unknown-device';
    const tags = {
        setting: 'tap-setting',
        bluetooth: 'bluetooth-menu'
    };

    allure.addStory("Bluetooth Connectivity");
    allure.startStep('Execute Bluetooth connection and return flow');

    try {
        await BluetoothPage.openSettingTab();
        await visualCheck(tags.setting);
        allure.addStep('✅ Navigated to Settings tab');

        await BluetoothPage.openBluetoothMenu();
        await visualCheck(tags.bluetooth);
        allure.addStep('✅ Opened Bluetooth & Device menu');

        await BluetoothPage.clickRefresh();
        await browser.pause(5000);
        allure.addStep('✅ Clicked Refresh and waited');

        const device = await BluetoothPage.findDeviceWithRetry('Lite Jam RGB 24');
        expect(device).not.toBeNull();
        allure.addStep('✅ Found "Lite Jam RGB 24" device');

        const success = await BluetoothPage.connectToDevice('Lite Jam RGB 24');
        expect(success).toBe(true);
        allure.addStep('✅ Device connected successfully');

        const backButton = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button');
        await backButton.waitForDisplayed({ timeout: 5000 });
        await backButton.click();
        allure.addStep('✅ Navigated back to main screen');

        const chordTab = await $('~Chord\nTab 1 of 4');
        await chordTab.waitForDisplayed({ timeout: 5000 });
        expect(await chordTab.isDisplayed()).toBe(true);
        await chordTab.click();
        allure.addStep('✅ Verified return to Chord tab');

        allure.endStep('passed');

    } catch (error) {
        allure.addStep(`❌ Flow failed: ${error.message}`);

        // 🔥 แนบภาพทั้งหมดใน catch block เผื่อ fail แล้วไม่กลับมาที่ finally
        for (const tagName of Object.values(tags)) {
            attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder);
        }

        allure.endStep('failed');
        throw error;

    }
});

    });

    // ✅ FIXED: ใช้ function()
   describe('Check UI Chord Screen', function () {
    allure.addFeature("UI Verification");

    it('TC-CHORD-UI-001: ควรแสดงผล UI ของหน้า Chord ได้อย่างถูกต้อง', async function () {
        const tagName = 'chord-screen-ui';
        const deviceNameForFolder = browser.capabilities.desired?.deviceName || browser.capabilities.deviceName || 'unknown-device';

        allure.addStory("Chord Screen");
        allure.startStep('Verify Chord Screen UI (Functional & Visual)');

        try {
            // ✅ Functional UI Check
            await ChordScreen.verifyChordScreenUI();
            allure.addStep('✅ Functional check passed');

            const diff = await visualCheck(tagName); // ✅ ได้ค่ากลับมาแล้ว
            console.log(`Visual diff for ${tagName}: ${diff}%`);

            await assertVisualMatch(diff, tagName, deviceNameForFolder, { fail: 0 });


            allure.endStep('passed');

        } catch (error) {
            allure.addStep(`❌ Test failed: ${error.message}`);
            attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder); // ⬅ แนบแม้ fail
            allure.endStep('failed');
            throw error;
        }
    });

        it.only('TC-CHORD-UI-002: Check Popup Finger guide', async function () {
        const tagName = 'chord-screen-ui-finger-guide';
        const deviceNameForFolder = browser.capabilities.desired?.deviceName || browser.capabilities.deviceName || 'unknown-device';

        allure.addStory("Chord Screen Finger Guide");
        allure.startStep('Verify Chord Screen Finger Guide Popupl)');


        try {
            await ChordScreen.clickFingerguideButton();
            allure.addStep('✅ Clicked Finger Guide button');
            await ChordScreen.verifyFingerguideTitleDisplayed();
            allure.addStep('✅ Finger Guide title is displayed');

            await ChordScreen.verifyFingerguideTextDisplayed();
            allure.addStep('✅ Finger Guide text is displayed');

            const diff = await visualCheck(tagName); // ✅ ได้ค่ากลับมาแล้ว
            console.log(`Visual diff for ${tagName}: ${diff}%`);

            await assertVisualMatch(diff, tagName, deviceNameForFolder, { fail: 0 });

            await ChordScreen.closeFingerguidePopup();
            allure.addStep('✅ Closed Finger Guide popup');


            allure.endStep('passed');

        } catch (error) {
            allure.addStep(`❌ Test failed: ${error.message}`);
            attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder); // ⬅ แนบแม้ fail
            allure.endStep('failed');
            throw error;
        }
    });


const CHORD_CHUNK_SIZE = 10; // แบ่งเป็นชุดละ 10 คอร์ด

ROOT_NOTES.forEach(rootNote => {
    const totalChunks = Math.ceil(CHORD_TYPES.length / CHORD_CHUNK_SIZE);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const chordChunk = CHORD_TYPES.slice(
            chunkIndex * CHORD_CHUNK_SIZE,
            (chunkIndex + 1) * CHORD_CHUNK_SIZE
        );

        it.skip(`TC-CHORD-${rootNote}-Chunk-${chunkIndex + 1}: should verify ${rootNote} ${chordChunk.length} chords`, async function () {
            this.timeout(5 * 60 * 1000); // เพิ่ม timeout ต่อเคส

            const deviceNameForFolder = browser.capabilities.desired?.deviceName || browser.capabilities.deviceName;
            let lastTagName = '';

            allure.addStory("Chord Diagram Verification");
            allure.startStep(`Verify chord root ${rootNote} with chunk ${chunkIndex + 1}`);

            try {
                await ChordScreen.clickRootNote(rootNote);
                allure.addStep(`Selected Root Note: '${rootNote}'`);

                for (const chordType of chordChunk) {
                    allure.startStep(`-- Testing Chord Type: '${chordType}' --`);
                    try {
                        await ChordScreen.clickChordType(chordType);
                        await ChordScreen.scrollToTop();
                        await ChordScreen.verifyDisplayedChordTitle(rootNote, chordType);
                        await browser.pause(2000);

                        allure.addStep(`Selected Chord Type: '${chordType}'`);

                        const patternButtons = await ChordScreen.getAllPatternButtons();
                        allure.addStep(`Found ${patternButtons.length} patterns to test.`);

                        if (patternButtons.length === 0) {
                            allure.addStep(`❌ No chord patterns found for chord type '${chordType}'`);
                            throw new Error(`No chord patterns found for chord type '${chordType}'`);
                        }

                        let patternIndex = 1;
                        for (const patternButton of patternButtons) {
                            await patternButton.waitForDisplayed({ timeout: 5000 });
                            await patternButton.click();
                            allure.addStep(`---- Clicking and verifying Pattern: ${patternIndex}`);

                            const tagName = `${rootNote}-${chordType}-pattern${patternIndex}`
                                .replace('#', 's').replace(/\W/g, '-').toLowerCase();
                            lastTagName = tagName;

                            allure.startStep('Visual Check');
                            try {
                                const diff = await visualCheck(tagName);
                                console.log(`Visual diff for ${tagName}: ${diff}%`);
                                await assertVisualMatch(diff, tagName, deviceNameForFolder, { fail: 0 });

                                allure.addStep('✅ UI matches baseline image');
                            } finally {
                                allure.endStep();
                            }

                            patternIndex++;
                        }
                    } catch (err) {
                        allure.addStep(`❌ Failed Chord Type '${chordType}': ${err.message}`);
                        allure.endStep('failed');
                        throw err;
                    }
                    allure.endStep('passed');
                }
                allure.endStep('passed');
            } catch (error) {
                allure.addStep(`❌ Test failed on tag: '${lastTagName}'. Error: ${error.message}`);
                attachVisualTestResultsToAllure(allure, lastTagName, deviceNameForFolder);
                allure.endStep('failed');
                throw error;
            }
        });
    }
});
});
});
