# API Specification

Minihome API Server - REST API 명세서

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.minihome.page/api
```

---

## API Structure

API는 세 가지 prefix로 구분됩니다:

| Prefix | Authentication | Description |
|--------|----------------|-------------|
| `/api/public/*` | None | 공개 API (인증 불필요) |
| `/api/admin/*` | JWT + Master | 관리자 API (마스터 권한 필요) |
| `/api/internal/*` | API Key | 내부 서비스 API |

---

## Response Format

모든 API는 통일된 응답 형식을 사용합니다.

### Success Response

```json
{
  "code": 1,
  "message": "Success",
  "data": { ... },
  "meta": { "count": 10, ... }  // Optional
}
```

### Error Response

```json
{
  "code": 400,
  "message": "Error message",
  "data": null
}
```

### Response Codes

| Code | Description |
|------|-------------|
| 1 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Rate Limiting

모든 API에는 Rate Limiting이 적용됩니다. 제한을 초과하면 `429 Too Many Requests` 응답이 반환됩니다.

### Rate Limits

| API Type | Limit | Window |
|----------|-------|--------|
| Public | 100 requests | 1 minute |
| Admin | 60 requests | 1 minute |
| Internal | 1000 requests | 1 minute |

### Response Headers

모든 응답에 Rate Limit 정보가 헤더로 포함됩니다:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

### 비활성화

개발 환경에서 Rate Limiting을 비활성화하려면:

```
DISABLE_RATE_LIMIT=true
```

---

## Pagination

목록 조회 API는 페이지네이션을 지원합니다.

### Query Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| page | integer | 1 | - | 페이지 번호 |
| limit | integer | 20 | 100 | 페이지당 항목 수 |

### Response Meta

```json
{
  "code": 1,
  "message": "Success",
  "data": { ... },
  "meta": {
    "count": 20,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Example Request

```
GET /api/admin/projects?page=2&limit=10
```

---

## Authentication

### Admin APIs (`/api/admin/*`)

JWT Bearer 토큰이 필요하며, 마스터 권한이 있어야 합니다.

```
Authorization: Bearer <JWT_TOKEN>
```

### Internal APIs (`/api/internal/*`)

API 키 헤더가 필요합니다.

```
X-API-Key: <INTERNAL_API_KEY>
```

> 개발 환경에서는 `INTERNAL_API_KEY` 환경변수가 설정되지 않으면 인증을 건너뜁니다.

---

## Public APIs (`/api/public/*`)

인증이 필요하지 않은 공개 API입니다.

### Health Check

#### GET /api/public/health

서버 및 데이터베이스 연결 상태를 확인합니다.

**Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "status": "ok",
    "db": "connected",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Auth (인증)

#### POST /api/public/auth/register

새 사용자를 등록합니다. 등록 후 마스터 승인이 필요합니다.

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | 이메일 주소 |
| username | string | Yes | 사용자명 |
| password | string | Yes | 비밀번호 (최소 8자) |
| displayName | string | No | 표시 이름 |

**Example Request**:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Success Response** (201):
```json
{
  "code": 1,
  "message": "Registration successful. Please wait for admin approval.",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "displayName": "John Doe",
      "isActive": true,
      "isMaster": false,
      "isApproved": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `400` - Missing required fields / Invalid email format / Password too short
- `409` - User with this email or username already exists

---

#### POST /api/public/auth/login

사용자 로그인 후 JWT 토큰을 발급받습니다.

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | 사용자명 또는 이메일 |
| password | string | Yes | 비밀번호 |

**Example Request**:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Success Response**:
```json
{
  "code": 1,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "displayName": "John Doe",
      "isActive": true,
      "isMaster": false,
      "isApproved": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `400` - Missing required fields
- `401` - Invalid username or password
- `403` - Account pending approval / Account deactivated

---

## Admin APIs (`/api/admin/*`)

마스터 권한이 필요한 관리자 API입니다.

**Required Header**: `Authorization: Bearer <JWT_TOKEN>`

> 미들웨어에서 자동으로 JWT 토큰 검증 및 마스터 권한 확인을 수행합니다.

---

### Users (사용자 관리)

#### POST /api/admin/users

새 사용자를 직접 생성합니다.

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | 이메일 주소 |
| username | string | Yes | 사용자명 |
| password | string | Yes | 비밀번호 |
| displayName | string | No | 표시 이름 |
| isApproved | boolean | No | 승인 상태 (기본: true) |
| isMaster | boolean | No | 마스터 권한 (기본: false) |
| isActive | boolean | No | 활성 상태 (기본: true) |

**Success Response** (201):
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "user": { ... }
  }
}
```

**Error Responses**:
- `400` - Missing required fields
- `401` - Authentication required
- `403` - Master privileges required
- `409` - User with this email or username already exists

---

#### GET /api/admin/users/{id}

특정 사용자 정보를 조회합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 사용자 ID |

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "displayName": "John Doe",
      "isActive": true,
      "isMaster": false,
      "isApproved": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses**:
- `400` - Invalid user ID
- `401` - Authentication required
- `403` - Master privileges required
- `404` - User not found

---

#### GET /api/admin/users/list

전체 사용자 목록을 조회합니다.

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | 이메일/사용자명/표시이름 검색 |
| isApproved | boolean | 승인 여부 필터 |
| isActive | boolean | 활성 여부 필터 |
| isMaster | boolean | 마스터 여부 필터 |

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "users": [ ... ]
  },
  "meta": {
    "count": 10,
    "stats": {
      "total": 10,
      "approved": 8,
      "pending": 2,
      "active": 9,
      "inactive": 1,
      "master": 1
    }
  }
}
```

---

#### GET /api/admin/users/pending

승인 대기 중인 사용자 목록을 조회합니다.

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "users": [ ... ]
  },
  "meta": {
    "count": 2
  }
}
```

---

#### PATCH /api/admin/users/{id}

사용자 정보를 수정합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 사용자 ID |

**Request Body** (모든 필드 선택):
| Field | Type | Description |
|-------|------|-------------|
| displayName | string | 표시 이름 |
| isActive | boolean | 활성 상태 |
| isMaster | boolean | 마스터 권한 |
| isApproved | boolean | 승인 상태 |

**Success Response**:
```json
{
  "code": 1,
  "message": "User updated successfully",
  "data": {
    "user": { ... }
  }
}
```

**Error Responses**:
- `400` - Invalid user ID / Invalid JSON / No valid fields to update
- `401` - Authentication required
- `403` - Master privileges required
- `404` - User not found

---

#### DELETE /api/admin/users/{id}

사용자를 삭제합니다. 자기 자신은 삭제할 수 없습니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 사용자 ID |

**Success Response**:
```json
{
  "code": 1,
  "message": "User deleted successfully",
  "data": {
    "user": { ... }
  }
}
```

**Error Responses**:
- `400` - Invalid user ID / Cannot delete your own account
- `401` - Authentication required
- `403` - Master privileges required
- `404` - User not found

---

#### PATCH /api/admin/users/{id}/approve

사용자를 승인합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 사용자 ID |

**Success Response**:
```json
{
  "code": 1,
  "message": "User approved successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "isApproved": true,
      ...
    }
  }
}
```

**Error Responses**:
- `400` - Invalid user ID / User is already approved
- `401` - Authentication required
- `403` - Master privileges required
- `404` - User not found

---

### Projects (프로젝트 관리)

#### GET /api/admin/projects

전체 프로젝트 목록을 조회합니다.

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "projects": [
      {
        "id": 1,
        "category": "web",
        "title": "My Project",
        "desc": "Project description",
        "imgUrl": "https://example.com/image.png",
        "projectUrl": "https://example.com",
        "badge": ["React", "TypeScript"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "meta": {
    "count": 1
  }
}
```

---

#### POST /api/admin/projects

새 프로젝트를 생성합니다.

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | string | Yes | 카테고리 |
| title | string | Yes | 제목 |
| desc | string | No | 설명 |
| imgUrl | string | No | 이미지 URL |
| projectUrl | string | No | 프로젝트 URL |
| badge | string[] | No | 배지 목록 |

**Example Request**:
```json
{
  "category": "web",
  "title": "My Project",
  "desc": "A cool project",
  "imgUrl": "https://example.com/image.png",
  "projectUrl": "https://example.com",
  "badge": ["React", "TypeScript"]
}
```

**Success Response** (201):
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "project": { ... }
  }
}
```

---

#### GET /api/admin/projects/{id}

특정 프로젝트를 조회합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 프로젝트 ID |

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "project": { ... }
  }
}
```

---

#### PATCH /api/admin/projects/{id}

프로젝트를 수정합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 프로젝트 ID |

**Request Body** (모든 필드 선택):
| Field | Type | Description |
|-------|------|-------------|
| category | string | 카테고리 |
| title | string | 제목 |
| desc | string | 설명 |
| imgUrl | string | 이미지 URL |
| projectUrl | string | 프로젝트 URL |
| badge | string[] | 배지 목록 |

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "project": { ... }
  }
}
```

---

#### DELETE /api/admin/projects/{id}

프로젝트를 삭제합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 프로젝트 ID |

**Success Response**:
```json
{
  "code": 1,
  "message": "Project deleted successfully",
  "data": {
    "project": { ... }
  }
}
```

---

### Templates (템플릿 관리)

#### GET /api/admin/templates

전체 템플릿 목록을 조회합니다.

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "templates": [
      {
        "id": 1,
        "category": "portfolio",
        "title": "My Template",
        "desc": "Template description",
        "imgUrl": "https://example.com/image.png",
        "projectUrl": "https://example.com",
        "badge": ["HTML", "CSS"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  },
  "meta": {
    "count": 1
  }
}
```

---

#### POST /api/admin/templates

새 템플릿을 생성합니다.

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| category | string | Yes | 카테고리 |
| title | string | Yes | 제목 |
| desc | string | No | 설명 |
| imgUrl | string | No | 이미지 URL |
| projectUrl | string | No | 프로젝트 URL |
| badge | string[] | No | 배지 목록 |

**Success Response** (201):
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "template": { ... }
  }
}
```

---

#### GET /api/admin/templates/{id}

특정 템플릿을 조회합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 템플릿 ID |

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "template": { ... }
  }
}
```

---

#### PATCH /api/admin/templates/{id}

템플릿을 수정합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 템플릿 ID |

**Request Body** (모든 필드 선택):
| Field | Type | Description |
|-------|------|-------------|
| category | string | 카테고리 |
| title | string | 제목 |
| desc | string | 설명 |
| imgUrl | string | 이미지 URL |
| projectUrl | string | 프로젝트 URL |
| badge | string[] | 배지 목록 |

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "template": { ... }
  }
}
```

---

#### DELETE /api/admin/templates/{id}

템플릿을 삭제합니다.

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | 템플릿 ID |

**Success Response**:
```json
{
  "code": 1,
  "message": "Template deleted successfully",
  "data": {
    "template": { ... }
  }
}
```

---

## Internal APIs (`/api/internal/*`)

내부 서비스 간 통신을 위한 API입니다.

**Required Header**: `X-API-Key: <INTERNAL_API_KEY>`

> 개발 환경에서 `INTERNAL_API_KEY`가 설정되지 않으면 인증 없이 접근 가능합니다.

---

### Projects

#### GET /api/internal/projects

프로젝트 목록을 조회합니다.

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | 카테고리 필터 |

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "projects": [ ... ]
  },
  "meta": {
    "count": 10
  }
}
```

---

#### POST /api/internal/projects

새 프로젝트를 생성합니다.

**Request Body**: Admin API와 동일

---

#### GET /api/internal/projects/{id}

특정 프로젝트를 조회합니다.

---

#### PATCH /api/internal/projects/{id}

프로젝트를 수정합니다.

**Request Body**: Admin API와 동일

---

#### DELETE /api/internal/projects/{id}

프로젝트를 삭제합니다.

---

### Templates

#### GET /api/internal/templates

템플릿 목록을 조회합니다.

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | 카테고리 필터 |

---

#### POST /api/internal/templates

새 템플릿을 생성합니다.

---

#### GET /api/internal/templates/{id}

특정 템플릿을 조회합니다.

---

#### PATCH /api/internal/templates/{id}

템플릿을 수정합니다.

---

#### DELETE /api/internal/templates/{id}

템플릿을 삭제합니다.

---

### Users

#### GET /api/internal/users

전체 사용자 목록을 조회합니다.

**Success Response**:
```json
{
  "code": 1,
  "message": "Success",
  "data": {
    "users": [ ... ]
  },
  "meta": {
    "count": 10
  }
}
```

---

#### POST /api/internal/users

새 사용자를 생성합니다.

**Request Body**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | 이메일 주소 |
| username | string | Yes | 사용자명 |
| password | string | Yes | 비밀번호 |
| displayName | string | No | 표시 이름 |
| isApproved | boolean | No | 승인 상태 (기본: false) |
| isMaster | boolean | No | 마스터 권한 (기본: false) |
| isActive | boolean | No | 활성 상태 (기본: true) |

---

#### GET /api/internal/users/{id}

특정 사용자를 조회합니다.

---

#### PATCH /api/internal/users/{id}

사용자 정보를 수정합니다.

**Request Body**:
| Field | Type | Description |
|-------|------|-------------|
| displayName | string | 표시 이름 |
| isActive | boolean | 활성 상태 |
| isMaster | boolean | 마스터 권한 |
| isApproved | boolean | 승인 상태 |

---

#### DELETE /api/internal/users/{id}

사용자를 삭제합니다.

---

## Database Schema

### Users Table

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | serial | No | auto | Primary key |
| email | varchar(255) | No | - | Unique email |
| username | varchar(100) | No | - | Unique username |
| password_hash | varchar(255) | No | - | Hashed password |
| display_name | varchar(100) | Yes | null | Display name |
| is_active | boolean | No | true | Account active status |
| is_master | boolean | No | false | Master account flag |
| is_approved | boolean | No | false | Approval status |
| created_at | timestamp | No | now() | Creation time |
| updated_at | timestamp | No | now() | Last update time |

### Projects Table

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | serial | No | auto | Primary key |
| category | varchar(100) | No | - | Project category |
| title | varchar(255) | No | - | Project title |
| desc | text | Yes | null | Description |
| img_url | varchar(500) | Yes | null | Image URL |
| project_url | varchar(500) | Yes | null | Project URL |
| badge | text[] | Yes | null | Badge list |
| created_at | timestamp | No | now() | Creation time |
| updated_at | timestamp | No | now() | Last update time |

### Templates Table

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | serial | No | auto | Primary key |
| category | varchar(100) | No | - | Template category |
| title | varchar(255) | No | - | Template title |
| desc | text | Yes | null | Description |
| img_url | varchar(500) | Yes | null | Image URL |
| project_url | varchar(500) | Yes | null | Project URL |
| badge | text[] | Yes | null | Badge list |
| created_at | timestamp | No | now() | Creation time |
| updated_at | timestamp | No | now() | Last update time |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes* | PostgreSQL connection string |
| DB_HOST | Yes* | Database host |
| DB_PORT | Yes* | Database port |
| DB_NAME | Yes* | Database name |
| DB_USER | Yes* | Database user |
| DB_PASSWORD | Yes* | Database password |
| JWT_SECRET | Yes | JWT signing secret |
| ALLOWED_ORIGINS | No | Comma-separated CORS origins |
| INTERNAL_API_KEY | No | API key for internal services |

> *Either `DATABASE_URL` or individual DB_* variables are required.

---

## Notes

### Changelog

- **v1.1.0**: API 구조 개선
  - API prefix 분리 (`public`, `admin`, `internal`)
  - Rate Limiting 적용
  - Pagination 지원 추가
  - Edge Runtime 호환 JWT 라이브러리 (`jose`) 전환
