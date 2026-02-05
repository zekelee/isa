🏠 Project: 이사 Simulator

1. 개요
   타입 아파트 이사를 위한 가구/가전 배치 시뮬레이터 및 체크리스트 앱.

주요 기능: 도면 위 가구 배치, 이사 체크리스트 관리, 구입 목록(Inventory) 관리.

핵심 목표: 모바일/PC 동기화, 치수 기반의 정확한 배치, 유지보수 용이한 아키텍처.

2. 기술 스택 (Tech Stack)
   Build Tool: Vite (React + TypeScript)

UI Library: MUI (Material UI)

State Management: Zustand

Backend/DB: Supabase (PostgreSQL)

Interaction: react-draggable (Canvas-free 2D Layout)

3. 설계 원칙 (Design Patterns)
   3.1. Atomic Design 패턴
   모든 UI 컴포넌트는 재사용성을 위해 아래 단계로 엄격히 분리한다.

Atoms: MUI 컴포넌트를 styled 혹은 sx로 확장한 순수 스타일 단위. (예: StyledBox, CustomInput)

Molecules: Atoms + Headless Logic. (예: DraggableFurniture, ChecklistItem)

Organisms: 비즈니스 로직(Zustand Store)과 연결된 독립적 섹션. (예: FloorPlanCanvas, ShoppingList)

3.2. Headless UI 패턴
UI 라이브러리(MUI)와 비즈니스 로직(치수 계산, 좌표 업데이트)을 철저히 분리한다.

모든 핵심 계산 로직은 src/hooks/ 폴더 내 커스텀 훅으로 작성하여 UI 프레임워크에 의존하지 않도록 한다.

4. 데이터베이스 및 상태 설계
   4.1. Supabase Schema (PostgreSQL)
   SQL
   -- 가구/가전 정보 및 쇼핑 리스트
   CREATE TABLE items (
   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
   name TEXT NOT NULL,
   width INT NOT NULL, -- mm 단위
   depth INT NOT NULL, -- mm 단위
   price INT,
   status TEXT CHECK (status IN ('todo', 'bought', 'installed')),
   purchase_url TEXT
   );

-- 배치 정보 (1:1 관계)
CREATE TABLE placements (
item_id UUID REFERENCES items(id) ON DELETE CASCADE PRIMARY KEY,
x FLOAT DEFAULT 0,
y FLOAT DEFAULT 0,
rotation INT DEFAULT 0 -- 0, 90, 180, 270
);
4.2. Zustand Stores
useItemStore: 전체 가구 리스트 CRUD 및 구매 상태 관리.

usePlacementStore: 도면 위 가구들의 좌표 및 회전 상태 동기화.

5. 핵심 로직 지침
   Scaling: 실제 치수(mm)와 화면 치수(px)의 변환 비율을 상수로 관리한다. (기본값: 10mm = 1px)

Persistence: 모든 변경 사항은 Supabase에 실시간(또는 Debounce)으로 저장하여 모바일-PC 간 동기화를 유지한다.

Path Alias: @/를 src/ 경로의 별칭으로 사용하여 가독성을 높인다.

6. 디렉토리 구조
   Plaintext
   src/
   ├── api/ # Supabase Client 설정
   ├── components/ # Atomic Design Components
   │ ├── atoms/
   │ ├── molecules/
   │ └── organisms/
   ├── hooks/ # Headless Logic Hooks (useScale, usePlacement 등)
   ├── store/ # Zustand Stores
   ├── types/ # TypeScript Interfaces
   └── theme/ # MUI Custom Theme
