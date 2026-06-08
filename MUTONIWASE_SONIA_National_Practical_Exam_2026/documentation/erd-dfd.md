# PMS (Promotion and Marketing Subsystem) - ERD & DFD Documentation

## Entity Relationship Diagram (ERD)

### Entities and Attributes

```
+------------------+       +------------------+
|      Users       |       |     Vehicle      |
+------------------+       +------------------+
| PK UserID        |<------| FK RegisteredBy  |
|    UserName      |       | PK Plate_Number  |
|    Password      |       |    Brand         |
|    Role          |       |    Model         |
|    CreatedAt     |       |    Year          |
+------------------+       |    Vehicle_Type  |
        |                  |    Purchase_Price|
        |                  |    Status        |
        |                  |    CreatedAt     |
        |                  +------------------+
        |                          |
        |                          |
        v                          v
+------------------+       +------------------+
|    Customer      |       |   Promotion      |
+------------------+       +------------------+
| PK CustomerID    |       | PK PromotionID   |
|    FirstName     |       |    Title         |
|    LastName      |       |    Description   |
|    Email         |       |    Discount_Type |
|    PhoneNumber   |       |    Discount_Value|
|    Status        |       |    Start_Date    |
| FK RegisteredBy  |       |    End_Date      |
|    CreatedAt     |       |    Status        |
+------------------+       | FK CreatedBy     |
                           |    CreatedAt     |
                           +------------------+
                                   |
                                   |
                                   v
                        +------------------+
                        |Promotion_Vehicle |
                        +------------------+
                        | PK FK PromotionID|
                        | PK FK Plate_Number|
                        |    Performance   |
                        +------------------+
```

### Relationships

| Entity 1          | Relationship       | Entity 2            |
|--------------------|--------------------|----------------------|
| Users (1)         | registers many     | Vehicle (M)         |
| Users (1)         | registers many     | Customer (M)        |
| Users (1)         | creates many       | Promotion (M)       |
| Promotion (M)     | applies to many    | Vehicle (M)         |
| Vehicle (M)       | has many           | Promotion (M)       |
| Promotion_Vehicle | links Promotion   | and Vehicle         |

### Primary Keys (PK) and Foreign Keys (FK)

| Table              | Primary Key        | Foreign Key                          |
|--------------------|--------------------|--------------------------------------|
| Users              | UserID (PK)        | -                                    |
| Vehicle            | Plate_Number (PK)  | RegisteredBy (FK -> Users.UserID)    |
| Customer           | CustomerID (PK)    | RegisteredBy (FK -> Users.UserID)    |
| Promotion          | PromotionID (PK)   | CreatedBy (FK -> Users.UserID)       |
| Promotion_Vehicle  | PromotionID +      | PromotionID (FK -> Promotion.PromotionID) |
|                    | Plate_Number (PK)  | Plate_Number (FK -> Vehicle.Plate_Number) |

---

## Level 0 DFD (Context Diagram)

```
                         +---------------------+
                         |                     |
                         |    PMS System       |
                         |                     |
       +---------------->|  - Vehicle Mgmt     |<----------------+
       |                 |  - Customer Mgmt    |                 |
       |                 |  - Promotion Mgmt   |                 |
       |                 |  - Report Gen.      |                 |
       |                 |  - Session Auth     |                 |
       |                 |                     |                 |
       |                 +---------------------+                 |
       |                        |     |                          |
       |                        |     |                          |
       |                        |     |                          |
+------v------+          +------v-----v------+          +-------v------+
|             |          |                   |          |              |
|   Admin     |<-------->|    Database       |<-------->|   Customer   |
|  (User)     |          |    (MySQL)        |          |   (External) |
|             |          |                   |          |              |
+-------------+          +-------------------+          +--------------+
```

### External Entities

1. **Admin/Staff (User)** - Manages vehicle inventory, customer records, promotions, and views reports.
2. **Customer** - Interacts with the system indirectly through staff; their data is stored and linked to promotions.

### Data Flows

| From            | To              | Data Flow Description                      |
|-----------------|-----------------|--------------------------------------------|
| Admin           | PMS System      | Login credentials                          |
| Admin           | PMS System      | Vehicle CRUD operations                    |
| Admin           | PMS System      | Customer registration & updates            |
| Admin           | PMS System      | Promotion creation & management            |
| Admin           | PMS System      | Report generation requests                 |
| PMS System      | Admin           | Authentication status                      |
| PMS System      | Admin           | Vehicle/Customer/Promotion records         |
| PMS System      | Admin           | Customer-Promotion reports                 |
| PMS System      | Database        | Read/Write operations                      |
| Database        | PMS System      | Retrieved data                            |
| Customer        | PMS System      | Personal information                      |
| PMS System      | Customer        | Promotion offers & notifications          |
