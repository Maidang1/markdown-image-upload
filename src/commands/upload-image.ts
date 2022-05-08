import * as vscode from 'vscode';
import { CDN_URL } from '../const';
import { checkIsImg, getFileName, imagePathToBase64 } from '../utils';
import { createInstance } from '../utils/request';
export const uploadImageCommand = (context: vscode.ExtensionContext) => {
  return [
    'upload-image',
    async () => {
      const activeTextEditor = vscode.window.activeTextEditor;
      const username = context.globalState.get('username') as string;
      const repo = context.globalState.get('repo') as string;
      const token = context.globalState.get('token') as string;
      const instance = createInstance(token);
      if (activeTextEditor) {
        const { document, selection, edit } = activeTextEditor;
        const text = document.getText(selection);
        // 判断选中的链接是不是图片
        if (checkIsImg(text)) {
          let content = await imagePathToBase64(text);

          if (content === null) {
            vscode.window.showErrorMessage('请检查路径是否存在');
          } else {
            try {
              const res = await instance.request(
                'PUT /repos/{owner}/{repo}/contents/{path}',
                {
                  owner: username,
                  repo,
                  path: `images/${getFileName(text)}`,
                  message: 'image commit',
                  content,
                }
              );
              // return res.data.content?.path;
              edit((editBuilder) => {
                if (res.data.content?.path) {
                  editBuilder.replace(
                    selection,
                    `${CDN_URL}/${username}/${repo}/${res.data.content.path}`
                  );
                }
              });
            } catch (e: any) {
              vscode.window.showErrorMessage(e);
            }
          }
        } else {
          vscode.window.showErrorMessage('请选择图片');
        }
        if (!text) {
          vscode.window.showErrorMessage('没有选中文字');
        }
      } else {
        vscode.window.showErrorMessage('没有打开的文件');
      }
    },
  ] as const;
};
