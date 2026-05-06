import Database from "better-sqlite3";
import fs from "fs";

const dbFile = "gluco.db";

export const db = new Database(dbFile);

export function setupDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target_fasting_min REAL DEFAULT 4.0,
      target_fasting_max REAL DEFAULT 6.0,
      target_pre_meal_min REAL DEFAULT 4.0,
      target_pre_meal_max REAL DEFAULT 7.0,
      target_post_meal_max REAL DEFAULT 8.5
    );

    CREATE TABLE IF NOT EXISTS glucose_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      value REAL NOT NULL,
      meal_description TEXT,
      medication_taken BOOLEAN,
      activity_logged BOOLEAN,
      emotional_state TEXT,
      notes TEXT,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT,
      user TEXT,
      timestamp TEXT NOT NULL
    );
  `);

  // Force update existing patient settings to new defaults
  db.prepare("UPDATE patients SET target_fasting_min = 4.0, target_fasting_max = 6.0").run();

  // Seed data if empty
  const count = db.prepare("SELECT COUNT(*) as count FROM patients").get() as { count: number };
  if (count.count === 0) {
    const insertPatient = db.prepare("INSERT INTO patients (name) VALUES (?)");
    const info = insertPatient.run("Test Patient");
    const patientId = info.lastInsertRowid;

    const seedData = [
      { date: "2026-01-30", pre_lunch: 6.8, post_lunch: 10.5 },
      { date: "2026-01-31", fasting: 6.2, pre_dinner: 7.1, post_dinner: 8.2 },
      { date: "2026-02-01", fasting: 6.2, pre_lunch: 9.2, post_lunch: 6.2 },
      { date: "2026-02-02", fasting: 8.8, post_breakfast: 7.4, pre_dinner: 6.7 },
      { date: "2026-02-03", fasting: 6.0 },
      { date: "2026-02-04", fasting: 5.2, post_dinner: 7.9 },
      { date: "2026-02-05", fasting: 7.1, pre_lunch: 9.1 },
      { date: "2026-02-06", fasting: 7.1, pre_lunch: 6.3 },
      { date: "2026-02-07", fasting: 7.5, post_breakfast: 7.9, post_dinner: 9.2 },
      { date: "2026-02-08", fasting: 7.2 },
      { date: "2026-02-09", fasting: 8.8, post_breakfast: 9.7 },
      { date: "2026-02-10", fasting: 7.6, pre_lunch: 8.8, pre_dinner: 6.5 },
      { date: "2026-02-12", fasting: 6.0, pre_lunch: 7.1 },
      { date: "2026-02-13", fasting: 7.1, pre_lunch: 9.8 },
      { date: "2026-02-14", fasting: 6.5, pre_lunch: 9.7 },
      { date: "2026-02-15", fasting: 6.0 },
      { date: "2026-02-16", fasting: 7.8, post_breakfast: 9.8 },
      { date: "2026-02-17", fasting: 6.3, pre_dinner: 6.4 },
      { date: "2026-02-18", fasting: 6.9, pre_lunch: 5.7 },
      { date: "2026-02-19", fasting: 5.9, pre_lunch: 6.8 },
      { date: "2026-02-21", pre_dinner: 6.5 },
    ];

    const insertReading = db.prepare(
      "INSERT INTO glucose_readings (patient_id, date, time_slot, value) VALUES (?, ?, ?, ?)"
    );

    const insertMany = db.transaction((readings: any[]) => {
      for (const r of readings) {
        if (r.fasting) insertReading.run(patientId, r.date, "Fasting", r.fasting);
        if (r.post_breakfast) insertReading.run(patientId, r.date, "2Hr Post-Breakfast", r.post_breakfast);
        if (r.pre_lunch) insertReading.run(patientId, r.date, "Pre-Lunch", r.pre_lunch);
        if (r.post_lunch) insertReading.run(patientId, r.date, "2Hr Post-Lunch", r.post_lunch);
        if (r.pre_dinner) insertReading.run(patientId, r.date, "Pre-Dinner", r.pre_dinner);
        if (r.post_dinner) insertReading.run(patientId, r.date, "2Hr Post-Dinner", r.post_dinner);
      }
    });

    insertMany(seedData);
  }
}
