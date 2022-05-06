import * as vscode from 'vscode';
import { check_is_img, imagePathToBase64 } from '../utils';
import { uploadImage } from '../utils/request';
export const uploadImageCommand = {
  command: 'upload-image',
  cb: async () => {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
      const { document, selection } = activeTextEditor;
      const text = document.getText(selection);
      // 判断选中的链接是不是图片
      if (check_is_img(text)) {
        let content = await imagePathToBase64(text);

        if (content === null) {
          vscode.window.showInformationMessage('请检查路径是否存在');
        } else {
          vscode.window.showInformationMessage(content);
          try {
            const res = await uploadImage({
              owner: 'Maidang1',
              repo: 'image_repo',
              path: 'image',
              content,
            });
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        vscode.window.showInformationMessage('请选择图片');
      }
      if (!text) {
        vscode.window.showInformationMessage('没有选中文字');
      }
    } else {
      vscode.window.showInformationMessage('没有打开的文件');
    }
  },
};
