import test from 'node:test';
import assert from 'node:assert/strict';
import { repairContent, repairPatch, repairs } from './repair-property-content.mjs';

function database(conflictSlug) {
  const rows = repairs.map((repair) => ({
    id: repair.slug, slug: repair.slug, updatedAt: 'original',
    gallery: repair.beforeGallery,
    availability: repair.beforeAvailability || 'Available now',
    price: 'manager price', description: 'manager description', published: false,
  }));
  let writes = 0;
  return {
    rows, get writes() { return writes; },
    async $transaction(callback) {
      const pending = structuredClone(rows);
      let pendingWrites = 0;
      await callback({ property: {
        async findUnique({ where }) { return pending.find((r) => r.slug === where.slug); },
        async updateMany({ where, data }) {
          const row = pending.find((r) => r.id === where.id && r.updatedAt === where.updatedAt);
          if (!row || row.slug === conflictSlug) return { count: 0 };
          Object.assign(row, data, { updatedAt: 'repaired' });
          pendingWrites++;
          return { count: 1 };
        },
      } });
      rows.splice(0, rows.length, ...pending);
      writes += pendingWrites;
    },
  };
}

test('preview never changes records', async () => {
  const db = database();
  const before = structuredClone(db.rows);
  await repairContent(db, false, () => {});
  assert.deepEqual(db.rows, before);
  assert.equal(db.writes, 0);
});

test('repairs all five galleries and only the old Royal Oaks status; repeat is a no-op', async () => {
  const db = database();
  await repairContent(db, true, () => {});
  for (const row of db.rows) {
    const repair = repairs.find((r) => r.slug === row.slug);
    assert.deepEqual(row.gallery, repair.afterGallery);
    assert.equal(new Set(row.gallery).size, row.gallery.length);
    assert.equal(row.availability, 'Available now');
    assert.equal(row.price, 'manager price');
    assert.equal(row.description, 'manager description');
    assert.equal(row.published, false);
  }
  assert.equal(db.writes, 5);
  await repairContent(db, true, () => {});
  assert.equal(db.writes, 5);
});

test('preserves custom galleries and non-legacy availability', () => {
  for (const repair of repairs) {
    assert.deepEqual(repairPatch({ gallery: ['/manager-photo.jpg'], availability: 'Waitlist' }, repair), {});
  }
});

test('concurrent edit rolls back earlier changes in the batch', async () => {
  const db = database('royal-oaks');
  const before = structuredClone(db.rows);
  await assert.rejects(repairContent(db, true, () => {}), /Concurrent edit/);
  assert.deepEqual(db.rows, before);
  assert.equal(db.writes, 0);
});

test('missing property rolls back the batch', async () => {
  const db = database();
  db.rows.pop();
  const before = structuredClone(db.rows);
  await assert.rejects(repairContent(db, true, () => {}), /Missing property/);
  assert.deepEqual(db.rows, before);
});
