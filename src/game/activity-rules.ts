export const REPLY_SECONDS = 45;
export const TWISTER_RATES = [0.85, 1, 1.15];
export const replyPoints = (tier: 1 | 2 | 3, pro: boolean) => tier * (pro ? 2 : 1);

/** Picks one of the two words in a listening pair; kept injectable so tests are deterministic. */
export const listeningWord = (pair: readonly string[], random: () => number = Math.random) => pair[random() < .5 ? 0 : 1] ?? '';