#!/usr/bin/env tsx
// scripts/seed-database.ts
// Manual database seeding script (alternative to Docker initialization)

import pool, { query } from '../lib/db';
import fs from 'fs';
import path from 'path';

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Read SQL files
    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
    const seedPath = path.join(process.cwd(), 'db', 'seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    const seedSql = fs.readFileSync(seedPath, 'utf-8');

    // Split into individual statements
    const schemaStatements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const seedStatements = seedSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    // Execute schema
    console.log('📋 Creating schema...');
    for (const statement of schemaStatements) {
      await pool.execute(statement);
    }
    console.log('✅ Schema created\n');

    // Execute seed data
    console.log('📊 Inserting seed data...');
    for (const statement of seedStatements) {
      await pool.execute(statement);
    }
    console.log('✅ Seed data inserted\n');

    // Verify
    const [standardsCount] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM standards'
    );
    const [categoriesCount] = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM categories'
    );

    console.log('📈 Database Statistics:');
    console.log(`   - Standards: ${standardsCount.count}`);
    console.log(`   - Categories: ${categoriesCount.count}`);
    console.log('\n✨ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedDatabase();
