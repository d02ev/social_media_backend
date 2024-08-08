export class Helper {
  genCustomFileName = (originalFileName: string): string => {
    const timestamp_str = Date.now().toString();
    return timestamp_str + '_' + originalFileName;
  };
}