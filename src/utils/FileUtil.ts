export class FileUtil {

  static startDownLoad(fileName: string, content: string) {
    const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  }

}