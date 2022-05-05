// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'https://api.github.com',
//   headers: {
//     Authorization: 'token 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',
//     Accept: 'application/vnd.github.v3+json',
//   },
// });

// export const createRepo = (name: string) => {
//   const res = instance.post('/user/repos', {
//     name: 'image_repo',
//   });
// };

import { Octokit } from 'octokit';

const instance = new Octokit({
  auth: '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',
});

/** 创建一个仓库 */
export const createRepo = async ({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) => {
  await instance.request('PATCH /repos/{owner}/{repo}', {
    owner,
    repo,
    name: repo,
    homepage: 'https://github.com',
    private: false,
  });
};

/** 上传图片 */
export const uploadImage = async ({
  owner,
  repo,
  path,
  content,
}: {
  owner: string;
  repo: string;
  path: string;
  content: string;
}) => {
  const res = await instance.request(
    'PUT /repos/{owner}/{repo}/contents/{path}',
    {
      owner,
      repo,
      path,
      message: 'image commit',
      content,
    }
  );
  return res.data.content?.path;
};
