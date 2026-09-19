import { db } from './db.js';

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS invitations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      public_token TEXT NOT NULL UNIQUE,
      creator_token TEXT NOT NULL UNIQUE,
      creator_name TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      personal_message TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT,
      responded_at TEXT
    );

    CREATE TABLE IF NOT EXISTS date_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invitation_id INTEGER NOT NULL UNIQUE,
      interested INTEGER NOT NULL,
      date_type TEXT,
      selected_date TEXT,
      selected_time TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (invitation_id)
        REFERENCES invitations(id)
        ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cuisines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      emoji TEXT
    );

    CREATE TABLE IF NOT EXISTS response_cuisines (
      response_id INTEGER NOT NULL,
      cuisine_id INTEGER NOT NULL,

      PRIMARY KEY (response_id, cuisine_id),

      FOREIGN KEY (response_id)
        REFERENCES date_responses(id)
        ON DELETE CASCADE,

      FOREIGN KEY (cuisine_id)
        REFERENCES cuisines(id)
        ON DELETE CASCADE
    );
  `);
}