export class Helper {
  genCustomFileName = (originalFileName: string): string => {
    const timestamp_str = Date.now().toString();
    return timestamp_str + '_' + originalFileName;
  };

  genVerificationLink = (verificationToken: string): string => {
    return process.env.VERIFICATION_LINK_PREFIX + verificationToken;
  };
}