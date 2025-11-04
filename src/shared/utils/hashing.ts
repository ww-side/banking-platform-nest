import * as bcrypt from 'bcrypt';

export const hash = async (payload: string, saltRounds: number = 10) => {
  return await bcrypt.hash(payload, saltRounds);
};

export const compare = async (payload: string, hash: string) => {
  return await bcrypt.compare(payload, hash);
};
