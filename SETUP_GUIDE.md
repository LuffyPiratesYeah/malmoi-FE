# Malmoi Supabase 설정 가이드

## 1. Supabase 데이터베이스 설정

### 스키마 생성
Supabase 대시보드(https://supabase.com)에 접속하여:

1. 프로젝트 선택
2. 좌측 메뉴에서 "SQL Editor" 클릭
3. `/supabase/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭하여 실행

이렇게 하면 다음 테이블들이 생성됩니다:
- `users` - 사용자 정보
- `classes` - 수업 정보
- `schedules` - 일정 정보

### 테스트 데이터 추가 (선택사항)

```sql
-- 테스트 사용자 추가 (비밀번호: 1234)
INSERT INTO users (email, password_hash, name, user_type, is_teacher, verification_status) VALUES
('student@test.com', '$2a$10$YourHashedPasswordHere', '학생', 'student', false, 'none'),
('teacher@test.com', '$2a$10$YourHashedPasswordHere', '선생님', 'teacher', true, 'verified');
```

## 2. 환경 변수 확인

`.env` 파일이 올바르게 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. 애플리케이션 실행

```bash
npm install  # 의존성 설치 (bcryptjs가 추가됨)
npm run dev  # 개발 서버 실행
```

## 4. API 엔드포인트 사용법

### 인증 API

#### 회원가입
```javascript
POST /api/auth/signup
Body: {
  email: string,
  password: string,
  name: string,
  userType: 'student' | 'teacher'
}
```

#### 로그인
```javascript
POST /api/auth/login
Body: {
  username: string,  // email로 사용
  password: string
}
```

### 수업 API

#### 수업 목록 조회
```javascript
GET /api/classes
Response: ClassItem[]
```

#### 수업 생성
```javascript
POST /api/classes
Body: {
  title: string,
  description: string,
  level: string,
  type: string,
  category: string,
  image: string,
  tutorId: string,
  tutorName: string,
  details?: string[]
}
```

#### 수업 상세 조회
```javascript
GET /api/classes/[id]
Response: ClassItem
```

### 일정 API

#### 일정 목록 조회
```javascript
GET /api/schedules?classId={id}&studentId={id}
Response: ScheduleItem[]
```

#### 일정 생성
```javascript
POST /api/schedules
Body: {
  classId: string,
  date: string,  // YYYY-MM-DD
  time: string,
  studentId: string
}
```

### 사용자 API

#### 사용자 조회
```javascript
GET /api/users/[id]
Response: User
```

#### 사용자 수정
```javascript
PUT /api/users/[id]
Body: {
  name?: string,
  profileImage?: string,
  verificationStatus?: string
}
```

## 5. 남은 작업

프론트엔드 페이지들을 API와 연결해야 합니다:

### 수정이 필요한 파일들:
1. `/app/class/page.tsx` - `db.class.getAll()` → API 호출로 변경
2. `/app/class/[id]/page.tsx` - `db.class.getById()` → API 호출로 변경
3. `/app/schedule/page.tsx` - `db.schedule.getAll()` → API 호출로 변경
4. `/app/main/page.tsx` - 데이터 로딩을 API 호출로 변경
5. `/app/profile/page.tsx` - 사용자 정보 API와 연동

### 예시: 페이지에서 API 호출하기

```typescript
// Before (Mock DB)
import { db } from "@/lib/db";
const classes = await db.class.getAll();

// After (API Route)
const response = await fetch('/api/classes');
const classes = await response.json();
```

## 6. 주의사항

1. **비밀번호 해싱**: 회원가입 시 bcryptjs로 자동 해싱됩니다.
2. **RLS (Row Level Security)**: Supabase RLS 정책이 활성화되어 있습니다.
3. **UUID 사용**: 모든 ID는 UUID 형식입니다.
4. **camelCase ↔ snake_case 변환**: API에서 자동으로 변환됩니다.

## 7. 테스트 계정 생성

비밀번호 해시를 생성하려면 Node.js 콘솔에서:

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('1234', 10);
console.log(hash);
```

생성된 해시를 SQL INSERT 문에 사용하세요.

## 8. 트러블슈팅

### "Missing Supabase environment variables" 에러
- `.env` 파일의 환경 변수를 확인하세요.
- 개발 서버를 재시작하세요.

### 로그인이 안 됨
- Supabase에서 사용자가 생성되었는지 확인하세요.
- 비밀번호 해시가 올바른지 확인하세요.

### API 호출 에러
- 브라우저 개발자 도구의 Network 탭에서 응답을 확인하세요.
- 서버 콘솔에서 에러 로그를 확인하세요.
