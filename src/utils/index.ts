import { spawn } from 'child_process';
import { readFile } from 'fs/promises';
import * as vscode from 'vscode';
// import path = require('path');
import * as path from 'path';
import * as fs from 'fs';

export function checkIsImg(url: string) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
}

export const imagePathToBase64 = async (path: string) => {
  try {
    const content = await readFile(path.trim(), 'base64');
    return content;
  } catch (e) {
    return null;
  }
};

/** 根据时间戳生成文件名 */
export const getFileName = (file: string) => {
  const time = new Date().valueOf();
  const fileName = file.split('.');

  const ext = fileName.pop();

  return time + '.' + ext;
};

export function saveClipboardImageToFileAndGetPath(
  imagePath: string,
  cb: Function
) {
  if (!imagePath) {
    return;
  }
  let platform = process.platform;
  if (platform === 'win32') {
    // Windows
    const scriptPath = path.join(__dirname, '../src/lib/pc.ps1');
    const powershell = spawn('powershell', [
      '-noprofile',
      '-noninteractive',
      '-nologo',
      '-sta',
      '-executionpolicy',
      'unrestricted',
      '-windowstyle',
      'hidden',
      '-file',
      scriptPath,
      imagePath,
    ]);
    powershell.on('exit', function (code: any, signal: any) {});
    powershell.stdout.on('data', function (data: any) {
      let msg = data.toString().trim();
      if (data.toString().trim() === 'no image') {
        cb('no image');
      } else {
        cb(imagePath);
      }
    });
  } else if (platform === 'darwin') {
    // Mac
    let scriptPath = path.join(__dirname, '../src/lib/mac.applescript');

    let ascript = spawn('osascript', [scriptPath, imagePath]);
    ascript.on('exit', function (code: any, signal: any) {});

    ascript.stdout.on('data', function (data: any) {
      cb(data.toString().trim());
    });
  } else {
    // Linux

    let scriptPath = path.join(__dirname, '../src/lib/linux.sh');

    let ascript = spawn('sh', [scriptPath, imagePath]);
    ascript.on('exit', function (code: any, signal: any) {});

    ascript.stdout.on('data', function (data: any) {
      let result = data.toString().trim();
      if (result === 'no xclip') {
        vscode.window.showInformationMessage(
          'You need to install xclip command first.'
        );
        return;
      }
      cb(result);
    });
  }
}

export const createImageDirWithImagePath = function (imagePath: string) {
  return new Promise<string>((resolve, reject) => {
    let imageDir = path.dirname(imagePath);
    fs.exists(imageDir, (exists: any) => {
      if (exists) {
        resolve(imagePath);
        return;
      }
      fs.mkdir(imageDir, (err: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(imagePath);
      });
    });
  });
};

export const getImagePath = function (
  filePath: string,
  rawFilename: string,
  localPath: string
) {
  // 图片名称
  let imageFileName = '';
  let now = Date.now();
  if (!rawFilename) {
    imageFileName = now + '.png';
  } else {
    imageFileName = now + '-' + rawFilename;
  }

  // 图片本地保存路径
  let folderPath = path.dirname(filePath);
  let imagePath = '';
  if (path.isAbsolute(localPath)) {
    imagePath = path.join(localPath, imageFileName);
  } else {
    imagePath = path.join(folderPath, localPath, imageFileName);
  }

  return imagePath;
};

export const insertImageLocal = (
  filePath: string,
  editor: vscode.TextEditor
) => {
  const name = path.basename(filePath);

  const img = `![${name}](${filePath})`;

  editor.edit((textEditorEdit) => {
    textEditorEdit.insert(editor.selection.active, img);
  });
};
