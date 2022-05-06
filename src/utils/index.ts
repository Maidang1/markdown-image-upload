import { readFile } from 'fs/promises';
export function check_is_img(url: string) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
}

export const imagePathToBase64 = async (path: string) => {
  try {
    const content = await readFile(path, 'base64');
    return content;
  } catch (e) {
    return null;
  }
};
