import { describe, it, expect } from 'vitest';
import { normalizePlateNumber } from '@/lib/utils';

describe('normalizePlateNumber', () => {
  it('should normalize Alef variations to plain Alef', () => {
    expect(normalizePlateNumber('س م أ 123')).toBe('سما123');
    expect(normalizePlateNumber('س م إ 123')).toBe('سما123');
    expect(normalizePlateNumber('س م آ 123')).toBe('سما123');
  });

  it('should normalize Teh Marbuta to Heh', () => {
    expect(normalizePlateNumber('هـ م ة 456')).toBe('همه456');
  });

  it('should normalize Yeh with dots to dotless Yeh (ى)', () => {
    expect(normalizePlateNumber('ل و ي 789')).toBe('لوى789');
  });

  it('should remove spaces, hyphens and tatweel', () => {
    expect(normalizePlateNumber(' س م ا - 1 2 3 ')).toBe('سما123');
    expect(normalizePlateNumber('هـ_م_ة')).toBe('همه');
  });

  it('should uppercase English letters', () => {
    expect(normalizePlateNumber('abc-123')).toBe('ABC123');
    expect(normalizePlateNumber('ABC-123')).toBe('ABC123');
  });

  it('should handle null, undefined and empty strings', () => {
    expect(normalizePlateNumber(null)).toBe('');
    expect(normalizePlateNumber(undefined)).toBe('');
    expect(normalizePlateNumber('')).toBe('');
  });
});
