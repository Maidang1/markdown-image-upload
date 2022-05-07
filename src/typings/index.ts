import { Octokit } from 'octokit';
export interface IInstance {
  createRepo: (params: { owner: string; repo: string }) => Promise<any>;
  uploadImage: (params: {
    owner: string;
    repo: string;
    path: string;
    content: string;
  }) => Promise<any>;
  requestInstance: Octokit;
}
