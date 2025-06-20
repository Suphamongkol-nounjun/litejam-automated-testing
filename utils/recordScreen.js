import fs from 'fs';
import path from 'path';
import allure from '@wdio/allure-reporter';

export async function startScreenRecording() {
  await driver.startRecordingScreen();
}

export async function stopScreenRecording(testName) {
  const base64Video = await driver.stopRecordingScreen();
  const buffer = Buffer.from(base64Video, 'base64');
  const filePath = path.resolve(`./allure-results/${testName}-recording.mp4`);

  fs.writeFileSync(filePath, buffer);
  allure.addAttachment(`${testName} - Screen Recording`, buffer, 'video/mp4');
  console.log(`📹 Saved screen recording to ${filePath}`);
}
