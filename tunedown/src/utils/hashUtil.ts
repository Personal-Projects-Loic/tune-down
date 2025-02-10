import bcrypt from "bcryptjs";

export const hashPrivateKey = async (privateKey: string): Promise<string> => {
  const rounds = 10;
  const hashedPrivateKey = await bcrypt.hash(privateKey, rounds);
  return hashedPrivateKey;
};

export const verifyPrivateKey = async (
  privateKey: string,
  hashedPrivateKey: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(privateKey, hashedPrivateKey);
  return isMatch;
};
