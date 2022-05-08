import * as vscode from 'vscode';
import {
  createImageDirWithImagePath,
  getImagePath,
  insertImageLocal,
  saveClipboardImageToFileAndGetPath,
} from '../utils';

const imagePaste = async () => {
  const { window } = vscode;
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const fileUri = editor.document.uri;
  if (!fileUri) {
    return;
  }

  if (fileUri.scheme === 'untitled') {
    window.showInformationMessage('粘贴图片前需要先保存本文件。');
    return;
  }

  const { selection, document } = editor;
  const selectText = document.getText(selection);

  if (selectText && !/^[\w\-.]+$/.test(selectText)) {
    window.showInformationMessage('文件名有误');
    return;
  }

  const filePath = fileUri.fsPath;

  const imagePath: string = getImagePath(filePath, '', './images');

  try {
    const path = await createImageDirWithImagePath(imagePath);
    saveClipboardImageToFileAndGetPath(path, (imagePath: string) => {
      if (!imagePath) {
        return;
      }
      if (imagePath === 'no image') {
        return;
      }
      insertImageLocal(imagePath, editor);
    });
  } catch (e) {
    window.showErrorMessage('文件夹创建失败');
    return;
  }
};

export const markdownImagePasteCommand = (
  _context: vscode.ExtensionContext
) => {
  return ['markdown-image-paste', imagePaste] as const;
};
