import jakeImg from 'assets/img/product1.jpg';
import finnImg from 'assets/img/product2.jpg';
import bmoImg from 'assets/img/product3.jpg';
import princessImg from 'assets/img/apple-icon.png';

const jake = {
  id: '1',
  name: 'Đang thuc hien',
  url: 'http://adventuretime.wikia.com/wiki/Jake',
  avatarUrl: jakeImg,
  colors: {
    soft: '#007bff00',
    hard: '#007bff00',
  },
};

const BMO = {
  id: '2',
  name: 'Hoan thanh',
  url: 'http://adventuretime.wikia.com/wiki/BMO',
  avatarUrl: bmoImg,
  colors: {
    soft: 'red',
    hard: '#007bff00',
  },
};

const finn = {
  id: '3',
  name: 'Finn',
  url: 'http://adventuretime.wikia.com/wiki/Finn',
  avatarUrl: finnImg,
  colors: {
    soft: '#007bff00',
    hard: '#007bff00',
  },
};

const princess = {
  id: '4',
  name: 'Princess bubblegum',
  url: 'http://adventuretime.wikia.com/wiki/Princess_Bubblegum',
  avatarUrl: princessImg,
  colors: {
    soft: '#007bff00',
    hard: 'red',
  },
};

export const authors = [jake, BMO, finn, princess];

export const quotes = [
  {
    id: '1',
    content: 'Sometimes life is scary and dark',
    author: BMO,
  },
  {
    id: '2',
    content: 'Sucking at something is the first step towards being sorta good at something.',
    author: jake,
  },
  {
    id: '3',
    content: "You got to focus on what's real, man",
    author: jake,
  },
  {
    id: '4',
    content: 'Is that where creativity comes from? From sad biz?',
    author: finn,
  },
  {
    id: '5',
    content: 'Homies help homies. Always',
    author: finn,
  },
  {
    id: '6',
    content: 'Responsibility demands sacrifice',
    author: princess,
  },
  {
    id: '7',
    content: "That's it! The answer was so simple, I was too smart to see it!",
    author: princess,
  },
  {
    id: '8',
    content: 'People make mistakes. It’s a part of growing up',
    author: finn,
  },
];

// So we do not have any clashes with our hardcoded ones
let idCount = quotes.length + 1;

export const getQuotes = count =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];

    const custom = {
      ...random,
      id: `G${idCount++}`,
    };

    return custom;
  });

export const getAuthors = count =>
  Array.from({ length: count }, (v, k) => k).map(() => {
    const random = authors[Math.floor(Math.random() * authors.length)];

    const custom = {
      ...random,
      id: `author-${idCount++}`,
    };

    return custom;
  });

const getByAuthor = (author, items) => items.filter(quote => quote.author === author);

export const authorQuoteMap = authors.reduce(
  (previous, author) => ({
    ...previous,
    [author.name]: getByAuthor(author, quotes),
  }),
  {},
);

export const generateQuoteMap = quoteCount =>
  authors.reduce(
    (previous, author) => ({
      ...previous,
      [author.name]: getQuotes(quoteCount / authors.length),
    }),
    {},
  );
