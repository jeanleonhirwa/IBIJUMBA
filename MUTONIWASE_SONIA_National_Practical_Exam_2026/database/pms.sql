-- ============================================================
-- PMS (Promotion & Marketing Subsystem) Database
-- SwiftWheels - MUTONIWASE SONIA
-- ============================================================

CREATE DATABASE IF NOT EXISTS PMS;
USE PMS;

-- ============================================================
-- Users Table
-- ============================================================
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Vehicle Table
-- ============================================================
CREATE TABLE Vehicle (
    Plate_Number VARCHAR(20) PRIMARY KEY,
    Brand VARCHAR(50) NOT NULL,
    Model VARCHAR(50) NOT NULL,
    Year INT NOT NULL,
    Vehicle_Type VARCHAR(50) NOT NULL,
    Purchase_Price DECIMAL(12, 2) NOT NULL,
    Status ENUM('Available', 'Sold', 'Pending') NOT NULL DEFAULT 'Available',
    RegisteredBy INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RegisteredBy) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- ============================================================
-- Customer Table
-- ============================================================
CREATE TABLE Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20) NOT NULL,
    Status ENUM('Active', 'Inactive', 'Blocked') NOT NULL DEFAULT 'Active',
    RegisteredBy INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RegisteredBy) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- ============================================================
-- Promotion Table
-- ============================================================
CREATE TABLE Promotion (
    PromotionID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Discount_Type ENUM('free', 'percentage', 'FLAT_RATE', 'CASHBACK', 'BUY_ONE_GET_ONE', 'Bundle', 'amount') NOT NULL,
    Discount_Value DECIMAL(10, 2) NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Status ENUM('Active', 'Inactive', 'Expired') NOT NULL DEFAULT 'Active',
    CreatedBy INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- ============================================================
-- Promotion_Vehicle (Junction Table)
-- ============================================================
CREATE TABLE Promotion_Vehicle (
    PromotionID INT NOT NULL,
    Plate_Number VARCHAR(20) NOT NULL,
    Performance ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
    PRIMARY KEY (PromotionID, Plate_Number),
    FOREIGN KEY (PromotionID) REFERENCES Promotion(PromotionID) ON DELETE CASCADE,
    FOREIGN KEY (Plate_Number) REFERENCES Vehicle(Plate_Number) ON DELETE CASCADE
);

-- ============================================================
-- Sample Data
-- ============================================================

-- Insert Users (password: admin123 / staff123 hashed with bcrypt)
INSERT INTO Users (UserName, Password, Role) VALUES
('admin', '$2b$10$hamXQwiMY..p60BqdQcteeIxEq8RUuISL/kAeZEPfMtF3QO3K3ijG', 'admin'),
('staff1', '$2b$10$GTjyzmcDz9HG3qqc.L3YqOwN7WQ3CXUaXQuA3wZSESAfgpukr0FZm', 'staff');

-- Insert Vehicles
INSERT INTO Vehicle (Plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status, RegisteredBy) VALUES
('RAB001A', 'Toyota', 'Camry', 2022, 'Sedan', 35000.00, 'Available', 1),
('RAB002B', 'Honda', 'Civic', 2023, 'Sedan', 28000.00, 'Available', 1),
('RAB003C', 'Ford', 'Ranger', 2021, 'Truck', 45000.00, 'Sold', 1),
('RAB004D', 'Suzuki', 'Vitara', 2022, 'SUV', 32000.00, 'Available', 2),
('RAB005E', 'Nissan', 'X-Trail', 2023, 'SUV', 38000.00, 'Pending', 2);

-- Insert Customers
INSERT INTO Customer (FirstName, LastName, Email, PhoneNumber, Status, RegisteredBy) VALUES
('John', 'Doe', 'john.doe@email.com', '+250788100001', 'Active', 1),
('Jane', 'Smith', 'jane.smith@email.com', '+250788100002', 'Active', 1),
('Peter', 'Kamau', 'peter.kamau@email.com', '+250788100003', 'Inactive', 2),
('Alice', 'Mutesi', 'alice.mutesi@email.com', '+250788100004', 'Active', 2),
('Bob', 'Habimana', 'bob.habimana@email.com', '+250788100005', 'Blocked', 1);

-- Insert Promotions
INSERT INTO Promotion (Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status, CreatedBy) VALUES
('New Year Sale', 'Celebrate New Year with amazing discounts on all vehicles', 'percentage', 15.00, '2026-01-01', '2026-01-31', 'Active', 1),
('Holiday Price Slash', 'Special holiday pricing on selected SUVs', 'FLAT_RATE', 5000.00, '2026-06-01', '2026-06-30', 'Active', 1),
('Weekend Flash Sale', 'Limited weekend offers on sedans', 'CASHBACK', 2000.00, '2026-03-15', '2026-03-17', 'Expired', 2),
('Clearance Discount Offer', 'Clearance sale on older models', 'percentage', 25.00, '2026-04-01', '2026-04-30', 'Active', 2),
('Seasonal Price Drop', 'End of season price reductions on trucks', 'amount', 3000.00, '2026-05-01', '2026-05-31', 'Active', 1);

-- Link Promotions to Vehicles
INSERT INTO Promotion_Vehicle (PromotionID, Plate_Number, Performance) VALUES
(1, 'RAB001A', 'High'),
(1, 'RAB002B', 'Medium'),
(2, 'RAB004D', 'High'),
(2, 'RAB005E', 'Medium'),
(3, 'RAB001A', 'Low'),
(3, 'RAB002B', 'High'),
(4, 'RAB003C', 'High'),
(4, 'RAB005E', 'Low'),
(5, 'RAB003C', 'Medium');
