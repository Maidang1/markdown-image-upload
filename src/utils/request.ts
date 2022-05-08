import { Octokit } from 'octokit';
import { CDN_URL } from '../const';
import { IUrl } from '../typings';

const instance = null;

export const createInstance = (token: string) => {
  if (instance) {
    return instance;
  }

  return new Octokit({
    auth: token,
  });
};

export const getRepoContent = async (
  instance: Octokit,
  username: string,
  repo: string
) => {
  const { data } = await instance.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: username,
      repo,
      path: 'images',
    }
  );

  let urls: IUrl[] = [];

  if (Array.isArray(data)) {
    urls = data.map(({ path, sha }) => ({
      fullPath: `${CDN_URL}/${username}/${repo}/${path}`,
      originPath: path,
      sha,
    }));
  }

  if (Object.keys(urls).length !== 0 && !Array.isArray(data)) {
    const { path, sha } = data;
    urls = [
      {
        fullPath: `${CDN_URL}/${username}/${repo}/${path}`,
        originPath: path,
        sha,
      },
    ];
  }

  return urls;
};

export const deleteFile = async (
  instance: Octokit,
  username: string,
  repo: string,
  url: string,
  sha: string
) => {
  try {
    await instance.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
      owner: username,
      repo,
      path: url,
      message: 'delete file',
      sha,
    });
  } catch (e: any) {
    throw e;
  }
};
