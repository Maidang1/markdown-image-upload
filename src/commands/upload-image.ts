import * as vscode from 'vscode';
import { CDN_URL } from '../const';
import {
  checkIsImg,
  ensureAbsolutePath,
  getFileName,
  imagePathToBase64,
} from '../utils';
import { createInstance } from '../utils/request';
import * as fs from 'fs';
export const uploadImageCommand = (context: vscode.ExtensionContext) => {
  return [
    'upload-image',
    async (...args: any) => {
      const activeTextEditor = vscode.window.activeTextEditor;
      const enableSettings =
        vscode.workspace.getConfiguration('enable_settings');

      const username = (
        !enableSettings
          ? context.globalState.get('username')
          : vscode.workspace.getConfiguration('username')
      ) as string;
      const repo = (
        !enableSettings
          ? context.globalState.get('repo')
          : vscode.workspace.getConfiguration('repo')
      ) as string;
      const token = (
        !enableSettings
          ? context.globalState.get('token')
          : vscode.workspace.getConfiguration('token')
      ) as string;
      const instance = createInstance(token);
      if (activeTextEditor) {
        const { document, selection, edit } = activeTextEditor;
        let text;
        const [hasCodeLen, url, range] = args;
        if (hasCodeLen) {
          text = url;
        } else {
          text = document.getText(selection);
        }
        text = ensureAbsolutePath(text);
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
              if (hasCodeLen) {
                edit((editBuilder) => {
                  if (res.data.content?.path) {
                    editBuilder.replace(
                      range,
                      `(${CDN_URL}/${username}/${repo}/${res.data.content.path})`
                    );
                  }
                });
              } else {
                edit((editBuilder) => {
                  if (res.data.content?.path) {
                    editBuilder.replace(
                      selection,
                      `${CDN_URL}/${username}/${repo}/${res.data.content.path}`
                    );
                  }
                });
              }
              const isAutoDelete =
                vscode.workspace.getConfiguration('auto_delete');
              isAutoDelete && fs.rm(content, () => {});
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
