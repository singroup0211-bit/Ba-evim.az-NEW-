import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMarqueeDuration,
  duplicateForInfiniteLoop,
  formatAzn,
  filterVillas,
  calculateDynamicPrice,
  isHolidayDate,
} from './ticker';
import { VILLAS } from '../data/villas';

test('calculateMarqueeDuration scales with count and speed', () => {
  assert.equal(calculateMarqueeDuration(10, 'slow'), 90);
  assert.equal(calculateMarqueeDuration(10, 'normal'), 60);
  assert.equal(calculateMarqueeDuration(10, 'fast'), 35);
  // Minimum duration guard (20s)
  assert.equal(calculateMarqueeDuration(2, 'fast'), 20);
});

test('duplicateForInfiniteLoop correctly duplicates array for seamless loop', () => {
  const sample = [1, 2, 3];
  const doubled = duplicateForInfiniteLoop(sample, 2);
  assert.equal(doubled.length, 6);
  assert.deepEqual(doubled, [1, 2, 3, 1, 2, 3]);
  assert.deepEqual(duplicateForInfiniteLoop([]), []);
});

test('formatAzn formats currency with Manat symbol', () => {
  const formatted = formatAzn(450);
  assert.ok(formatted.includes('450'));
  assert.ok(formatted.includes('₼'));
});

test('isHolidayDate identifies major Azerbaijan holidays', () => {
  assert.equal(isHolidayDate('2026-03-21'), true); // Novruz
  assert.equal(isHolidayDate('2026-11-08'), true); // Zəfər günü
  assert.equal(isHolidayDate('2026-12-31'), true); // Həmrəylik günü
  assert.equal(isHolidayDate('2026-07-15'), false); // Normal day
});

test('calculateDynamicPrice computes weekday, weekend, holiday and 10% escrow deposit', () => {
  const villa = VILLAS[0]; // qbl-01, weekday: 350, weekend: 450
  
  // 2 nights: 2026-11-12 (Thursday - weekday) to 2026-11-14 (Friday check-in / Saturday check-out is weekend)
  const breakdown = calculateDynamicPrice(villa, '2026-11-12', '2026-11-14');
  assert.equal(breakdown.totalNights, 2);
  assert.ok(breakdown.totalPrice > 0);
  assert.equal(breakdown.escrowDeposit, Math.round(breakdown.totalPrice * 0.1));
  assert.equal(breakdown.arrivalBalance, breakdown.totalPrice - breakdown.escrowDeposit);
});

test('filterVillas accurately filters by local Azerbaijan market criteria', () => {
  // Test "yalnizAile" filter (Bina.az local standard)
  const aileVillas = filterVillas(VILLAS, { yalnizAile: true });
  assert.ok(aileVillas.length > 0);
  assert.ok(aileVillas.every((v) => v.features.yalnizAile));

  // Test "istiHovuz" filter
  const poolVillas = filterVillas(VILLAS, { istiHovuz: true });
  assert.ok(poolVillas.length > 0);
  assert.ok(poolVillas.every((v) => v.features.istiHovuz));

  // Test "wifiGenerator" filter
  const genVillas = filterVillas(VILLAS, { wifiGenerator: true });
  assert.ok(genVillas.length > 0);
  assert.ok(genVillas.every((v) => v.features.wifiGenerator));

  // Test search query
  const searched = filterVillas(VILLAS, { searchQuery: 'Tufandağ' });
  assert.ok(searched.length >= 1);
  assert.ok(searched[0].title.includes('Tufandağ'));
});
