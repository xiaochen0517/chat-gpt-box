export default class VersionUtil {

  public static compareVersion(currentVersion: string, latestVersion: string): boolean {
    currentVersion = this.replaceVersion(currentVersion);
    latestVersion = this.replaceVersion(latestVersion);
    const currentVersionArr = currentVersion.split(".");
    const latestVersionArr = latestVersion.split(".");
    for (let index = 0; index < this.getMaxNumByArr(currentVersionArr, latestVersionArr); index++) {
      const current = this.stringToNumber(currentVersionArr[index]);
      const latest = this.stringToNumber(latestVersionArr[index]);
      if (current < latest) {
        return true;
      }
    }
    return false;
  }

  private static replaceVersion(version: string): string {
    return version.replace(/^[vV]/, "");
  }

  private static stringToNumber(version: string): number {
    if (!version || version.length <= 0) {
      return 0;
    }
    const numberStr = version.replace(/\D/g, "");
    if (!numberStr || numberStr.length <= 0) {
      return 0;
    }
    const parsedInt = parseInt(numberStr);
    if (isNaN(parsedInt)) {
      return 0;
    }
    return parsedInt;
  }

  private static getMaxNumByArr(arr1: unknown[], arr2: unknown[]): number {
    if (!arr1 && !arr2) {
      return 0;
    }
    if (!arr1) {
      return arr2.length;
    }
    if (!arr2) {
      return arr1.length;
    }
    return Math.max(arr1.length, arr2.length);
  }
}
