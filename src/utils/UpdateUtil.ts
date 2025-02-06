import axios, {AxiosResponse} from "axios";
import packageJson from "../../package.json";
import VersionUtil from "@/utils/VersionUtil.ts";
import {GithubReleaseInfo} from "@/types/base/GithubReleaseInfo.ts";
import logger from "@/utils/logger/Logger.ts";

export default class UpdateUtil {

  public static async checkUpdate(): Promise<boolean> {
    try {
      const response = await this.getLatestInfo();
      const latestVersion = (response.data as GithubReleaseInfo).tag_name;
      const currentVersion = packageJson.version;
      logger.info(`Current version: ${currentVersion}, Latest version: ${latestVersion}`);
      return VersionUtil.compareVersion(currentVersion, latestVersion);
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  public static getLatestInfo(): Promise<AxiosResponse<unknown>> {
    return axios.get(
      "https://api.github.com/repos/xiaochen0517/chat-gpt-box/releases/latest",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
  }
}
