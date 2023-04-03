export const getLink = ({ type, token }: { type: string; token: string }) =>
  `${process.env.ORIGIN}/${type}?token=${token}`;
