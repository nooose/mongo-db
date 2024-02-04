# MongoDB with Atlas
## MongoDB를 선택하는 이유
- Schema가 자유롭다.
- HA와 Scale-Out Solution을 자체적으로 지원해서 확장이 쉽다.
- Secondary Index를 지원하는 NoSQL이다.
- 다양한 종류의 Index를 제공한다.
- 응답 속도가 빠르다.
- 배우기 쉽고 간편하게 개발이 가능하다.
- 데이터 중복이 발생할 수 있지만, 접근성과 가시성이 좋다.

즉, MongoDB는 유연하고 확장성 높은 Opensource Document 지향 DB이다.

## SQL vs NoSQL
### SQL 장단점
- 데이터 중복을 방지할 수 있다.
- Join 성능이 좋다.
- 복잡하고 다양한 쿼리가 가능하다.
- 잘못된 입력을 방지할 수 있다.
---
- 하나의 레코드를 확인하기 위해 여러 테이블을 Join하여 가시성이 떨어짐
- 스키마가 엄격해서 변경에 대한 공수가 큼

### NoSQL
- 관계형 데이터베이스에서 할 수 없었던 것을 대체할 수 있는 뜻으로 받아들이자
    - **절대 SQL의 대체재로 받아들이면 안 됨**
    - **서비스 특성에 맞게 사용하는 것이 맞음**
```json
{
    "_id": 1,
    "first_name": "Spring",
    "last_name": "Melon",
    "zipcode": 123456,
    "phone": "123-456-789",
    "sns": [
        { "type": "email", "id": "sirng123@lake.co" },
        { "type": "instagram", "id": "in_spring" },
        { "type": "twitter", "id": "tw_spring" }
    ]
}
```
### NoSQL 장단점
- 데이터 접근성과 가시성이 좋다.
- Join없이 조회하가 가능해서 응답 속도가 일반적으로 빠르다.
- 스키마 변경에 공수가 적다.
- 스키마가 유연해서 데이터 모델을 App의 요구사항에 맞게 데이터를 수용할 수 있다.
---
- 데이터의 중복이 발생한다.
- 스키마가 자유롭지만, 스키마 설계를 잘해야 성능 저하를 피할 수 있다.

## MongoDB 구조
### 용어정리
| RDBMS  | MongoDB |
|:-----:|:----:|
| Cluster  |  Cluster   |
| Database |  Database   |
| Table |  **Collection**   |
| Row | **Document** |
| Column | **Field** | 

Database &rarr; Collection &rarr; Document &rarr; Field 순으로 구조가 형성되어 있다.
### 기본 Database
- admin
    - 인증과 권한 부여 역할
    - 일부 관리 작업을 하려면 admin Database에 대한 접근이 필요
- local
    - 모든 mongodb instance는 local database를 소유
    - 복제에 필요한 oplog와 같은 replication 절차에 필요한 정보를 저장
    - startup_log와 같은 instance 진단 정보를 저장
    - local database 자체는 복제되지 않음
- config
    - sharded cluster에서 각 shard의 정보를 저장

### Collection 특징
- 동적 스키마를 갖고 있어서 스키마를 수정하려면 필드 값을 추가/수정/삭제하면 된다.
    - 아무리 자유로워도 적당한 스키마 구조를 잡아두는 것이 관리에 좋다.
- Colleciton 단위로 Index를 생성할 수 있다.
- Collection 단위로 Shard를 나눌 수 있다.
### Document 특징
- JSON 형태로 표현하고 `BSON(Binary JSON)` 형태로 저장한다.
- 모든 Document에는 `_id` 필드가 있고, 없이 생성하면 `ObjectId` 타입의 고유한 값을 저장한다.
- 생성 시, 상위 구조인 Database나 Collection이 없다면 먼저 생성하고 Document를 생성한다.
- Document의 최대 크기는 16MB으로 고정되어 있다.

## 배포 형태
### Standalone
- 테스트 / 개발 사용
### Replica Set
- HA 보장
- Write 요청은 Primary
  - Primary 는 오직 1개
  - Primary 는 Secondary 로 복제
- Read 요청은 Secondary
- Primary 의 Heartbeat 응답이 없다면 Secondary 중 하나가 Primary 로 승격된다.
  - 선출을 통해 과반수 투표를 얻어 Secondary 중 하나가 선정됨
- Oplog Collection 을 통해 데이터가 복제된다.
### Sharded Cluster Set
- HA 보장
- Shard 별 데이터 분산
  - 각 Shard 안에는 Replica Set 으로 구성되어 있다.
  - Collection 단위로 생성 가능
    - 특정 Collection 은 Shard 를 적용하지 않게도 가능
  - 꼭 Router 를 통해 접근
  - Shard Key 를 선정해야하고, 해당 필드에는 Index 가 만들어져 있어야 한다.
- Ranged Sharding, **Hashed Sharding**, Zone Sharding 지원 
## Storage Engine
- 3.2 부터 WiredTiger 가 적용되면서 성능이 많이 개선
  - Data Compression 지원
  - Database/Collection 레벨의 Lock &rarr; Document 레벨의 Lock
