import { db } from './db.js';

const cuisines = [
  ['Indian', '🇮🇳'],
  ['Italian', '🇮🇹'],
  ['Japanese', '🇯🇵'],
  ['Korean', '🇰🇷'],
  ['Thai', '🇹🇭'],
  ['Chinese', '🇨🇳'],
  ['Mexican', '🇲🇽'],
  ['Lebanese', '🇱🇧'],
  ['American', '🍔'],
  ['Steak', '🥩'],
  ['Sushi', '🍣'],
  ['Vegetarian', '🌱'],
];

export function seedDatabase(): void {
  const insertCuisine = db.prepare(`
    INSERT OR IGNORE INTO cuisines (name, emoji)
    VALUES (?, ?)
  `);

  const insertMany = db.transaction(
    (items: string[][]) => {
      for (const [name, emoji] of items) {
        insertCuisine.run(name, emoji);
      }
    },
  );

  insertMany(cuisines);
}