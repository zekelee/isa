// src/hooks/useScale.ts
const PIXEL_PER_MM = 0.1; // 1px per 10mm

/**
 * mm 단위를 px 단위로 변환하는 훅
 * @param mm - 변환할 mm 단위 값
 * @returns px 단위 값
 */
export const useScale = (mm: number): number => {
  return mm * PIXEL_PER_MM;
};