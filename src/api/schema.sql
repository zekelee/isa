-- 구매 리스트 (가전/가구)
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INT,
  memo TEXT,
  purchased BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- 할 일 리스트
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  sort_order INT DEFAULT 0
);
