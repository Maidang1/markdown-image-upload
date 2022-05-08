import { IUrl } from '../typings';

export const renderHtml = (urls: IUrl[]) => {
  if (urls.length === 0) {
    return `<h1 class="empty">暂无上传图片</h1>`;
  }
  const res = `${urls.map((url) => {
    return `
              <div class="image-container">
                <div class="image-url">
                  <img src="${url.fullPath}" alt="img">
                </div>
                <div class="button-group">
                  <span class="delete" data-url="${url.originPath}" data-type="delete" data-sha="${url.sha}">删除</span>
                  <span class="copy" data-url="${url.fullPath}" data-type="copy" data-sha="">复制链接</span>
                </div>
              </div>
            `;
  })}`;
  return `<div class="image-container-wrapper">${res}</div>`;
};
export const getWebviewContent = (urls: IUrl[]) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <style>
          .empty {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .image-container-wrapper {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }
          .image-container {
            display: flex;
            width: 220px;
            height: 220px;
            flex-direction: column;
            align-items: center;
          }
          .image-url {
            width: 200px;
            height: 200px;
          }
          .image-url img {
            width: 200px;
            height: 200px;
          }
          .button-group {
            font-size: 12px;
          }
          .button-group span {
            cursor: pointer;
          }
        </style>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
        </head>
        <body>
          <div id="root">
          ${renderHtml(urls)}
          </div>
        </body>
        <script>
        (function(){
          const vscode = acquireVsCodeApi();
          const root = document.getElementById('root');
          window.addEventListener('message', (event) => {
            const message = event.data;
            if(message.command === 'preview-update') {
              const content = message.content;
              root.innerHTML = content
            }
          })
          root.addEventListener('click', (e) => {
            const dataset = e.target.dataset;
            const { url, type, sha } = dataset;
            vscode.postMessage({
              command: 'preview-click',
              data: {
                url,
                type,
                sha
              }
            });
          });
        }());
        </script>
        </html>
    `;
};
