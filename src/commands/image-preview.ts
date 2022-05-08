import * as vscode from 'vscode';
import { IUrl } from '../typings';
import { createInstance, deleteFile, getRepoContent } from '../utils/request';
import { getWebviewContent, renderHtml } from '../utils/template';

export const markdownImagePreviewCommand = (
  context: vscode.ExtensionContext
) => {
  return [
    'markdown-image-preview',
    async () => {
      const token = context.globalState.get('token') as string;
      const repo = context.globalState.get('repo') as string;
      const username = context.globalState.get('username') as string;
      const instance = createInstance(token);
      let urls: IUrl[] = [];
      try {
        urls = await getRepoContent(instance, username, repo);
        await context.globalState.update('urls', urls);
      } catch (e) {
        vscode.window.showErrorMessage('获取仓库内容失败' + e);
      }

      const panel = vscode.window.createWebviewPanel(
        'imagePreview',
        '图片预览',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewContent(urls);
      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command !== 'preview-click') {
            return;
          }
          const { type, url, sha } = message.data;
          if (type === 'delete') {
            try {
              await deleteFile(instance, username, repo, url, sha);
              const originUrl = context.globalState.get('urls') as IUrl[];
              const urls = originUrl.filter((item) => item.originPath !== url);
              const content = renderHtml(urls);
              panel.webview.postMessage({
                command: 'preview-update',
                content,
              });
              await context.globalState.update('urls', urls);
            } catch (e) {
              vscode.window.showErrorMessage(`删除失败：${e}`);
            }
          } else if (type === 'copy') {
            await vscode.env.clipboard.writeText(url);
            vscode.window.showInformationMessage('已复制到剪切板');
          }
        },
        undefined,
        context.subscriptions
      );
    },
  ] as const;
};
