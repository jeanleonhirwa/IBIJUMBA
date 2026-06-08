vehicle sales, promotions, customer feedback handling, and employee
coordination rely heavily on manual tools, including logbooks, paper forms,
receipt books, notice boards, and verbal communication.

As the business grows, the manual system has shown significant limitations. It
is time-consuming, prone to errors, and struggles to provide real-time updates
on vehicle availability, bookings, or sales. Employees must manually track tasks
and customer requests, which leads to operational delays, inefficiencies, and
missed business opportunities.

SwiftWheels aims to digitalize operations through a real-time, scalable web based
application that streamlines workflows, reduces errors, and elevates customer
experience driving efficiency, satisfaction, and sustainable business growth.

Task: Promotion and Marketing Subsystem (PMS)

As a full stack developer, you are given 7 hours to develop the PMS web
application by using Node.JS and React.JS.

Perform the following activities to accomplish the above task:

1. Use attributes provided below to design an Entity Relationship Diagram
   (ERD) that represents the relationship between their entities. Before
   opening your computer, design this ERD on a plain paper (A4) using
   a pencil.

➢ Entities and attributes are:

   a. Vehicle(Plate_Number, Brand, Model, Year, Vehicle_Type,
      Purchase_Price, Status)

   b. Customer(FirstName, LastName, Email, PhoneNumber,
      CreatedAt, Status)

   c. Promotion(Title, Description, Discount_Type, Discount_Value,
      Start_Date, End_Date, Status)

   d. Promotion_Vehicle (Performance)

   e. Users:(UserName, Password,Role)

• Customer status are Active, Inactive and Blocked.
• Promotion discount type can be free, percentage, FLAT_RATE,
  CASHBACK, BUY_ONE_GET_ONE, Bundle and amount
• Promotion title can be New Year sale, Holiday Price Slash
  ,Weekend Flash Sale , Clearance Discount Offer and Seasonal
  Price Drop
➢ A user can register many vehicles.
➢ Each vehicle is registered by one user.
➢ A user can register many customers.
➢ Each customer is registered by one user.
➢ A user can create many promotions.
➢ Each promotion is created by one user.
➢ A promotion can apply to many vehicles.
➢ A vehicle can have many promotions.
➢ Promotion_Vehicle links promotions and vehicles.

2. Indicate appropriate primary keys with(PK) and foreign keys with(FK)
   based on the relationships among the entities.

3. Design Level 0 DFD(Context Diagram) showing the system and external
   entities.

4. Create database called PMS with Vehicle,
   Customer,Promotion,Promotion_Vehicle and Users tables as designed
   in ERD.

5. Save your work in your real names in a folder called
   (FirstName_LastName_National_Practical_Exam_2026).

6. Prepare front-end and back-end environments.

7. Your web application should allow user to perform CRUD operations,
   search records and should be responsive.

8. Create a session-based login user account.

9. Generate a report of all customers and all promotions that apply to the
   vehicles they might be interested in.

➢ The report should include Customer name, Vehicle brand, vehicle model,
   Promotion title ,Discount value and Performance.