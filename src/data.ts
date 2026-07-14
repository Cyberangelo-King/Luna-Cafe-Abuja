import { MenuItem, ModifierOption, CommunityEvent } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'w1',
    name: 'Classic Belgian',
    description: 'Crispy on the outside, fluffy on the inside. Served with whipped butter and pure maple syrup.',
    price: 4500,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqInGEr4putBsouug9KPqudZ4E4XRRntdkujtZyaiwjsElAdN46D9lmuJiiRCci1L0A7o0oQzqZsmPkVApNAnyNrz8-RGPP7C-AzbYvxOmqd5iOs-atvR4VFBqQ7V4l1YLRvq2kwOCIfSUMf9LQ8F5Qb0bx4h9oUcuzRoLF22upVgnXoDkavxorcjzXqxAdRjDaOdHQqZXu_k6gJJzKIKGESF2Vs2A1-r0aMzCCY0JvjaAgzcWvNqThg',
    category: 'waffles',
    modifierCategory: 'waffle'
  },
  {
    id: 'w2',
    name: 'Berry Nutella',
    description: 'Warm Nutella drizzle topped with fresh local strawberries and vanilla bean whipped cream.',
    price: 6000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCyRL15lLeRPeXUJoh4fzYXMOmz9jtBIxOkKgC6HZejU9eP_W9FjyrQihO1Mma7OUIX28Opg7tp0NSp5BJ7YyIQb83GtnXtdlbUyG3fJGkjWjemlkhEOO0juE1MXNgcuNILI1foX2Hnm9BDKuT1HsG_z-FgtcNq1zOhCfUl2M9FEHOh_pEAl2KrJcEC-cU8ff3JoY3wzM5UmdeeTaaJK7GCiyauSoRUfivFKJ4Tp_g8PuK1DuPy0QkJA',
    category: 'waffles',
    modifierCategory: 'waffle'
  },
  {
    id: 'p1',
    name: 'Luna Signature Brunch',
    description: 'A curated selection of poached eggs, smashed avocado, smoked salmon, roasted tomatoes, and sourdough toast.',
    price: 12500,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_PenHlK-TF2nIX3xB6if-aS8yZUnEaoXKyTP-2kbaZ_E88YBu94uYLjEBFAZwpwhR4A0FqXkdM8SiMWPcFmsq1IKKgWGjzjoIcTAztngb_zdQVgOPV647TUgsW7vJpkcq-ctbqSihoiqMKdHTGpDXOWr5tA3CCDNHAQ1cbGXnuxySqBvv3rnSl1xHL8-sBpGRzYBvUWvg4g-6deM3QZwvRoJ8NJRQqRlW-AEEq3wAQG1ElpnXRncMbQ',
    category: 'platters',
    modifierCategory: 'platter'
  },
  {
    id: 'c1',
    name: 'The Luna Cortado',
    description: 'Equal parts espresso and perfectly textured steamed milk. Crafted with our signature Abuja roast for a balanced, nutty finish.',
    price: 4500,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRF4SIEKcrGxZ9l42aYifsTQzNUPdh4jWBnogme0ywKvJTSQlwxX4uGv87Pwj3bBYmNBtox-JUnk3b0nwTXmRdxaak7BYjMjwX8z40eYec-6896b70ih-Q_pTO_94ly-boUM-83kZDQrcdR4NXCq_q2XMpVL7DMcZzbTEtcwScGNkQJJyVZofxJ4qypoEX298a_NugrGncfBFmlIWzPoeQUG_0f62Y_Vd7AYg--EWoXkrCLg0ETnUL6A',
    category: 'coffee',
    modifierCategory: 'coffee'
  },
  {
    id: 'c2',
    name: 'Ceremonial Iced Matcha',
    description: 'Premium shade-grown matcha whisked to order, served over ice with your choice of oat or whole milk, lightly sweetened with vanilla bean syrup.',
    price: 5200,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7KX4OGKUDLMyznHUoDsK7X8jjFEWKUZtmFGoW_k864dLGb46BAjdxLgsM-ZBZdEu415xoqgPTpwkPq2rQlM5lg5zuSLLGGtnqr7bFUvgMXG9zcd_Pt8szYHtESvUAqvH1LqbFCwg9ap44md6Qm15j_Hv9p57A0ldJ4AnZL1NKKtTicTlyffVbYi3gzijAR4tbtJNNSuv128B9a3-3f53ewP_ZvWkMvf95DXlUdl_fweO1qPoh6fc_4g',
    category: 'coffee',
    modifierCategory: 'coffee'
  },
  {
    id: 'c3',
    name: 'Single Origin Pour Over',
    description: 'A delicate, clean cup brewed manually using the V60 method. Ask our barista about today’s rotating single-origin bean selection.',
    price: 3800,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRnKySq-tWGxf50xlmay8hQd_6_YMYBeFO92M0Cyuhb3yl5GaFTkgDmxuHy7KPjxRya0TYK7hfpaoU6XBxi8lnElMe5MInY6XOHzGTCsUXj03beHnAa8V33syV_JaGREGkkUhbmWNd6iFJtoJpxgMdeCK6EXeyMuC-_NBaOFrz1yTaL-jM0zCDfnOAlwOc1AI-k43ISvFJgxKTEylXH5yPPoeIWf6ehyL0-NsK05N356KQs-AmzgEBhA',
    category: 'coffee',
    modifierCategory: 'coffee'
  },
  {
    id: 'c4',
    name: 'Abuja Sunrise Latte',
    description: 'Our signature espresso blend with steamed micro-foam milk and a hint of local honey and cinnamon.',
    price: 3500,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpXZPKHKKGR-0I7o4Db4fMUdRIKW2AE36kgP6uvYmDur2iQ-_H67SA3STSNV-ikMKdDcn91JtkuCzmgoChHut_APD4xlSTfNAXno66GMNJYgoAFMZq2ZX-ID1ZefaIn29T4mgJ2thlHBOsvhzl91IOc2hHvzL8vsSQvJB1Qdo83NX2YWcB87bu2R5vWRVBBB7sLb6Pjb3FeqlF8045d93cp7slhl3ECSkhC2BT26e4kNGtlW2es1_Eag',
    category: 'coffee',
    modifierCategory: 'coffee'
  }
];

export const MODIFIER_DATA: Record<string, ModifierOption[]> = {
  waffle: [
    { id: 'm1', name: 'Extra Maple Syrup', price: 500, type: 'checkbox' },
    { id: 'm2', name: 'Add Vanilla Ice Cream', price: 1500, type: 'checkbox' },
    { id: 'm3', name: 'Extra Fresh Berries', price: 1200, type: 'checkbox' }
  ],
  coffee: [
    { id: 'm4', name: 'Oat Milk Alternative', price: 2000, type: 'radio', group: 'milk' },
    { id: 'm5', name: 'Almond Milk Alternative', price: 2000, type: 'radio', group: 'milk' },
    { id: 'm6', name: 'Extra Espresso Shot', price: 1000, type: 'checkbox' }
  ],
  platter: [
    { id: 'm7', name: 'Extra Sourdough Slice', price: 800, type: 'checkbox' },
    { id: 'm8', name: 'Add Grilled Halloumi', price: 2500, type: 'checkbox' }
  ]
};

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Terracotta Paint Night',
    category: 'Art & Wine',
    description: 'Guided canvas painting focusing on earthy palettes, paired with a curated selection of house wines and artisanal cheeses.',
    price: 15000,
    date: 24,
    month: 'Oct',
    day: 'Thursday',
    time: '6:30 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqTvoHvZmN-G_1uiYCGJI20S5jDj6f9D8TLjTHhBXsdLin1kLapyDz7HZ9OgR_F93nZonX_Z1Q4CmMPhrAOi1At1o2E9IBPIiDqkeNKdun4xKFn4zitQGCFV2IS9RZSi0fnct46DGOqPhHYJ8Ex6nyFOaE97C8LK3VMa8bWInoChjdIH5v6F17apP_FxL8IRnU1CBtcUDSX0LPs31Sqj2zTHDczjV3iHFMMAXJTlJuu8DGOa6TzkYodg',
    isFeatured: true
  },
  {
    id: 'e2',
    title: 'Courtyard Book Club',
    category: 'Community',
    description: 'This month we delve into contemporary African literature with "The Girl with the Louding Voice". Coffee and light pastries provided. RSVP required.',
    price: 'Free',
    date: 2,
    month: 'Nov',
    day: 'Saturday',
    time: '10:00 AM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaH2N5s7jUZKopQc3Ol7Im8C8xqBiyeg5At2cwFLDDgSKYu6tgEzfLEkk05b3xmfFEaQZTGP5f9mH3kdiGNnNumQXeMDn7tJqlBMnrbQc4eoAdJqBr7Lh3y-TKcEmT1PZqSmf1gA1mV95_k97EmJZvBgDkCh0HSjAyWTbA7jkOcqeTn7Dog_oU1cGvZBu0eQBCkUmEckAeldWi5bhya-EXeRvEy_leAB4Md8yJTAQK9dIBtBipc4D7VQ'
  },
  {
    id: 'e3',
    title: 'Acoustic & Karaoke Night',
    category: 'Music',
    description: 'Start the evening with live acoustic sets from local artists, followed by an open mic karaoke session. A lively, communal atmosphere to end the week.',
    price: 5000,
    date: 15,
    month: 'Nov',
    day: 'Friday',
    time: '8:00 PM',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfBiNI0bFNP5fe_p6P25FE6e2J9DP4pOMpgJ_27n3Gl1pSW7lTPCDzyVk4-BUg7CPIk98D-ZQitlsOeIa9ga_HamwvgEZ4NKPxq0TZp9OGWilOZEEMPC8Icw_cmxhbnIKZqiA7CQ2RXZqRam_cnXY_ldVpAHrkLx5AgyrOZK_ROXpsnsdrjTgZ6MjUeoIC9aHg6bsgTenOJUd72tIZPbJyK8JbbvgrajAbJgY4jfZlW9T0QFMJr7K8AQ'
  }
];

export const GALLERY_MOMENTS = [
  {
    id: 'gm1',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-neBpXhDc8i5Skgq1JLTdLNElnz91nym4XDHZflZrIWKWFR6ROKfhQWrm5uP8YIaRV0Q5g4EwIldiOhLyIfi6IIOKv-3M1nuyDuTFmTBGXeuGYxO607Myozj8ecPO1nZXobRLt6pMJQ6WImM13EYctq2V8rKhJQDY_w40ijFjChyEW1uqhkfVZvsHAKo6sVxzxEr_U94yOmDphiq66SO8EzSpSX70BanVHkw9Di8_QqkJskS0Re4Z-A',
    alt: 'Plated brunch and espresso latte'
  },
  {
    id: 'gm2',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA4O9Y81zAwH4QzUWAlACav3R2-esYD4uisvMH1MyQtQbRvKvHfBS0r1el2r0NjWFRGfS-SxS_dopE0sc52ORb8V2bryPoRifPCWmAYc-XvPLMqWotNBEbtAr_pi44CylxvHQBjGOgZ4wANPhtc0Bmnl14Oiwtr0y4luTJ4G6M5cdWta2l52y0YqeKa9m70CyZ7VTRy08ujXHlqfzb3VUi3WmYwX-8gQwcMVVjhW1cRN75otv7aGtk-A',
    alt: 'Co-working and typing at cafe desk'
  },
  {
    id: 'gm3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6WTusAxa1UoySyCxRmiHUJUuvk5oVJH8dRpqWI0cb3Oi01PNly3QqhAZqlLPSDmgeGBZnQSzer2-5CgPj0t9jaM1gap-mL6JMkihSvSMVjKkJ92iLy6ImZo-374-3BhldTLMPOPkF-2odkw24v73thjGODfWP0jZkRSoKbb1m8KsMs-t_aZNUypE1eQuVp-hlF5NZwkNi7ozfGb_nfMSJTdGAuFS_n1J5c6VioHulMtLtfmNJdpfBjg',
    alt: 'Artisanal coffee on concrete plate with green foliage background'
  },
  {
    id: 'gm4',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwJX0Nkb3KEgyXUpI5toHfuA0CQj_NJF9odsbexIFddrTnm8cJx9giv-WOt9IA_aphNg-BY8bSSUfwc8-KXJ36JAZmHMPRmZLkE6mPBlkXVjzeO0lKf-AVrYWpVxjebexdosI2_SACBqL7VHMseUlcBRym62Xk2qfhqLlKZVunaKLETKoYplS2hY_Qlj3GhkoRYB5RGJYFZ-TQQJRKPMyM3hggknKUrWsiqLuB-7wW00nrIo42D03wwQ',
    alt: 'Arched doorway courtyard community sunset event'
  },
  {
    id: 'gm5',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjfk20AaOejvn1CMA5M9PvTkgZb3zh5BTOodc8Bm68DTg-7be_v1hz2rsF_5lMIhr8H2nXXPGZvYBvjQon-i4YBKJkKNN9BzduNn_PAQkyxtIKI9HARaJNtDWeKUFlBdf0g-YcwhZCozAVMoMR1pHgagQBJcntbZD5s6PRhMG-R2HKBX3z23FxdU89mnEEHvnyJF_sORh67HKXfbCXDrULGSCfqpV0QTHgkgs2YtcVhKI-lpV3mVSlFw',
    alt: 'Plated organic pastry in morning glow'
  },
  {
    id: 'gm6',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAehxTqe7cRv4bQP0QLLszTPxeX1Ii5XIMKhq9WZ0f2XNdFPYJ7Q3LhSgNcSwza2wt2P_E8NKk5iQBf4QTMnpQ3QC-ZQQYQQemacj3C1EXg827EOO7avnxi4tLzaS0FcndYYIgBXJqll0JJALupiqWoCKHPtLI99K0oAMl7jSvN97hkXLxYGDkwF3B9vq7h73d7XSuuxiuOIBBzu6AN6CVwMsMJ6DLlx4KNbrBQ0xjb4akLTqdv_YKQ8g',
    alt: 'Steaming hands wrap around hot ceramic cup'
  }
];
