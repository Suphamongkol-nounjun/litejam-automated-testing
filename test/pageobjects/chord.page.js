import { $ } from '@wdio/globals';
import { expect } from '@wdio/globals';
import { scrollToTop } from '../../utils/swipeUtils'; // Import ฟังก์ชันเลื่อนจอ

/**
 * Constants สำหรับใช้ในไฟล์เทส เพื่อวนลูปทดสอบ
 */
export const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CHORD_TYPES = [
    "Major", "Minor", "7", "5", "dim", "dim7", "aug", "sus2", "sus4",
    "maj7", "m7", "7sus4", "maj9", "maj11", "maj13", "maj9#11", "maj13#11",
    "add9", "6add9", "maj7b5", "maj7#5", "m6", "m9", "m11", "m13", "madd9",
    "m6add9", "mmaj7", "mmaj9", "m7b5", "m7#5", "6", "9", "11", "13",
    "7b5", "7#5", "7b9", "7#9", "7(b5,b9)", "7(b5,#9)", "7(#5,b9)", "7(#5,#9)",
    "9b5", "9#5", "13#11", "13b9", "11b9", "sus2sus4", "-5"
];

class ChordScreen {
    /**
     * ส่วนเก็บ Locators ทั้งหมดของหน้านี้
     */
    locators = {
        guitarChordsText: 'Guitar Chords',
        instructionText: 'Please choose a root note and a chord type.',
        chooseYourChordText: 'Choose your Chord',
        chordTabText: 'Type of chord...',
        fretboardClass: 'android.widget.HorizontalScrollView',
        fingerguideButtonXpath: '//android.widget.ScrollView/android.view.View[3]',
        fingerguideTitle: 'LED Colour Guide',
        firstFingerguideText: 'RED LED = First Finger',
        secondFingerguideText: 'GREEN LED = Second Finger',
        thirdFingerguideText: 'BLUE LED = Third Finger',
        fourthFingerguideText: 'YELLOW LED = Fourth Finger',
        openStringText: 'WHITE LED = Play String Open',
        unlitStrokeText: "UNLIT STRING: Don't Play That String",
        closePopupfigerGuide: 'Scrim',

        allPatternButtonsXpath: "//android.view.View[starts-with(@content-desc, 'chord-pattern-')]",
    };

    // --- Element Accessors (ส่วนสำหรับเข้าถึง Element) ---

    get guitarChordsText() { return $(`~${this.locators.guitarChordsText}`); }
    get instructionText() { return $(`~${this.locators.instructionText}`); }
    get chooseYourChordText() { return $(`~${this.locators.chooseYourChordText}`); }
    get chordTab() { return $(`~${this.locators.chordTabText}`); }
    get fretboard() { return $(this.locators.fretboardClass); }
    get fingerguideButton() { return $(this.locators.fingerguideButtonXpath); }
    get fingerguideTitle() { return $(`~${this.locators.fingerguideTitle}`); }
    get firstFingerguideText() { return $(`~${this.locators.firstFingerguideText}`); }
    get secondFingerguideText() { return $(`~${this.locators.secondFingerguideText}`); }
    get thirdFingerguideText() { return $(`~${this.locators.thirdFingerguideText}`); }
    get fourthFingerguideText() { return $(`~${this.locators.fourthFingerguideText}`); }
    get openStringText() { return $(`~${this.locators.openStringText}`); }
    get unlitStrokeText() { return $(`~${this.locators.unlitStrokeText}`); }
    get closePopupfigerGuide() { return $(`~${this.locators.closePopupfigerGuide}`); }

    

   /**
     * ✅ CHANGED: อัปเดตให้ใช้ Accessibility ID รูปแบบใหม่
     * @param {string} note - ตัวอย่าง: 'C', 'G#', 'A'
     */
    rootNoteButton(note) {
        return $(`~chord-note-${note}\n${note}`);
    }
     /**
     * ✅ CHANGED: อัปเดตให้ใช้ Accessibility ID รูปแบบใหม่
     * @param {string} type - ตัวอย่าง: 'Major', 'm7', 'dim'
     */
    chordTypeButton(type) {
        return $(`~chord-type-${type}\n${type}`);
    }

    positionButton(position) {
        return $(`~${String(position)}`);
    }
    fingerguideButtonXpath() {
        return $(this.locators.fingerguideButtonXpath);
    }

    // --- Action Methods (ส่วนของฟังก์ชันการกระทำ) ---

    async clickRootNote(note) {
        await (await this.rootNoteButton(note)).click();
    }

    /**
     * ✅ CHANGED: อัปเดตให้ UI Automator ใช้ description รูปแบบใหม่ที่เจาะจงกว่าเดิม
     * @param {string} typeName 
     */
    async clickChordType(typeName) {
        const fullDescription = `chord-type-${typeName}\n${typeName}`;
        const selector = `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("${fullDescription}"))`;
        const chordButton = await $(selector);
        await chordButton.waitForDisplayed({ timeout: 10000 });
        await chordButton.click();
    }

    /**
     * คลิกที่ปุ่ม Position
     * @param {number|string} position 
     */
    async clickPosition(position) {
        await (await this.positionButton(position)).click();
    }
    async clickFingerguideButton() {
        await this.fingerguideButton.click();
    }
    async closeFingerguidePopup() {
        await this.closePopupfigerGuide.click();
    }

    /**
     * เลื่อนหน้าจอกลับไปบนสุด (โดยการเรียกใช้ฟังก์ชันจาก swipeUtils)
     */
    async scrollToTop() {
        await scrollToTop();
    }


    // --- Verification Method (ส่วนของฟังก์ชันการตรวจสอบ) ---

    /**
     * ตรวจสอบองค์ประกอบพื้นฐานของหน้าจอ Chord ว่าแสดงผลครบถ้วนหรือไม่
     */
    async verifyChordScreenUI() {
        await expect(this.guitarChordsText).toBeDisplayed();
        await expect(this.instructionText).toBeDisplayed();
        await expect(this.fretboard).toBeDisplayed();
        await expect(this.chooseYourChordText).toBeDisplayed();
        await expect(this.chordTab).toBeDisplayed();
        await expect(this.fingerguideButton).toBeDisplayed();
    }
    /**
       * ตรวจสอบว่า title ของคอร์ดที่แสดงอยู่ตรงกับ root + chordType ที่เลือก
       * @param {string} rootNote เช่น 'C'
       * @param {string} chordType เช่น 'Major'
       */
      async verifyDisplayedChordTitle(rootNote, chordType) {
          const expectedTitle = `${rootNote} ${chordType}`;
          const titleElement = await $(`~${expectedTitle}`);
          await expect(titleElement).toBeDisplayed();
      }
      async verifyFingerguideButtonDisplayed() {
          await expect(this.fingerguideButton).toBeDisplayed();
      }
      async verifyFingerguideTitleDisplayed() {
            await expect(this.fingerguideTitle).toBeDisplayed();
          }

          async verifyFingerguideTextDisplayed() {
  
                await expect(this.firstFingerguideText).toBeDisplayed();
                await expect(this.secondFingerguideText).toBeDisplayed();
                await expect(this.thirdFingerguideText).toBeDisplayed();
                await expect(this.fourthFingerguideText).toBeDisplayed();
                await expect(this.openStringText).toBeDisplayed();
                await expect(this.unlitStrokeText).toBeDisplayed();
                

          }


    /**
     * ✅ ADDED: ฟังก์ชันใหม่สำหรับนับจำนวน Pattern ทั้งหมดที่แสดงบนหน้าจอ
     * @returns {Promise<number>} จำนวนของ Pattern ที่หาเจอ
     */
    async countAvailablePatterns() {
        // ใช้ $$ เพื่อหา elements ทั้งหมดที่ตรงกับ XPath
        const patternButtons = await $$(this.locators.allPatternButtonsXpath);
        console.log(`[PageObject] Found ${patternButtons.length} pattern buttons.`);
        // คืนค่าจำนวน elements ที่หาเจอ ซึ่งก็คือจำนวน Pattern ทั้งหมด
        return patternButtons.length;
    }
    /**
     * ✅ REFACTORED: เปลี่ยนจากนับจำนวน เป็นการคืนค่า Array ของปุ่ม Pattern ทั้งหมด
     * @returns {Promise<WebdriverIO.ElementArray>} Array ของปุ่ม Pattern ที่หาเจอ
     */
    async getAllPatternButtons() {
        // ใช้ $$ เพื่อหา elements ทั้งหมดที่ตรงกับ XPath
        const patternButtons = await $$(this.locators.allPatternButtonsXpath);
        console.log(`[PageObject] Found ${patternButtons.length} pattern buttons.`);
        return patternButtons;
    }

 
}

export default new ChordScreen();