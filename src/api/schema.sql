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

-- 이사 체크리스트
CREATE TABLE checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 가구 배치 시뮬레이터를 위한 정보 (1:1 관계)
CREATE TABLE placements (
item_id UUID REFERENCES items(id) ON DELETE CASCADE PRIMARY KEY,
x FLOAT DEFAULT 0,
y FLOAT DEFAULT 0,
rotation INT DEFAULT 0 -- 0, 90, 180, 270
);
