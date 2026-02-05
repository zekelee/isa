export interface Room {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const floorPlan: Room[] = [
  // 참고: 이 값들은 예시입니다.
  // 실제 도면 이미지에 맞게 각 방의 좌표(x, y)와 크기(width, height)를 수정해주세요.
  { name: 'livingRoom', x: 100, y: 100, width: 400, height: 300 },
  { name: 'bedroom1', x: 100, y: 400, width: 250, height: 200 },
  { name: 'kitchen', x: 500, y: 100, width: 200, height: 200 },
  { name: 'bathroom', x: 500, y: 300, width: 200, height: 100 },
];
