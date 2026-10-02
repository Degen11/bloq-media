// Newsroom articles shown in the Articles section. The first one is also
// featured in the utility bar and the hero's "Latest story" card.

export interface Article {
  title: string;
  /** Short headline for tight spots (utility bar, hero card). */
  shortTitle: string;
  description: string;
  url: string;
  tag: string;
  /** Cover graphic: big label text on a navy or light-blue panel. */
  cover: { label: string; tone: 'navy' | 'sky' };
}

export const articles: Article[] = [
  {
    title: "Money 20/20 Asia Lands in Bangkok: A Look at Fintech's Thriving Asian Landscape",
    shortTitle: 'Money 20/20 Asia lands in Bangkok',
    description:
      "A firsthand look at the key themes, innovations, and players emerging from Money 20/20's inaugural Bangkok edition.",
    url: 'https://medium.com/@bloqmedia/money-20-20-asia-lands-in-bangkok-a-look-at-fintechs-thriving-asian-landscape-ee9b9f94c71b',
    tag: 'Fintech',
    cover: { label: '20/20', tone: 'navy' },
  },
  {
    title: 'Southeast Asia Blockchain Week: A Catalyst for Web3 Innovation in the Region',
    shortTitle: 'Southeast Asia Blockchain Week',
    description:
      'How SEABW is connecting builders, investors, and policymakers to accelerate Web3 adoption across the region.',
    url: 'https://medium.com/@bloqmedia/southeast-asia-blockchain-week-a-catalyst-for-web3-innovation-in-the-region-15c78e118682',
    tag: 'Blockchain',
    cover: { label: 'SEABW', tone: 'sky' },
  },
];

export const latestArticle = articles[0];
