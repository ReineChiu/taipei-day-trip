# <font color=#66AABB>Taipei-day-trip</font>
## DEMO  

![Alt text](static/image/preload.gif)  
![Alt text](static/image/photo.gif)  

[Main Features](#main-features)  
[Backend Technique](#backend-technique)
- [Enviroment](#environment)  
- [Database](#database)
- [Cloud Services](#cloud-services)  
- [Version Control](#version-control)  

[Frontend Technique](#frontend-technique)  
[Third-party](#third-party)  
[Architecture](#architecture)  
[Database Schema](#database-schema)

## Main Features  

- Member system, login and signup(bcrypt).
- Use keyword to search for related attractions.
- Responsive Web Design.
- Infinite scroll.  
![Alt text](static/image/infinite.gif)
- Online payment system with Tappay.
- Review order history.
- MVC

## Backend Technique

### Environment
- Python
  - dotenv 
  - The member passwords are encrypted using **<font color=#66AABB>bcrypt</font>**. User identity is verified using **<font color=#66AABB>JWT</font>**.
- Use **<font color=#66AABB>Flask</font>** as the server framework with the MVC architecture.  
- Use **<font color=#66AABB>Blueprint</font>** to modulize code, making development more clear, organized, and easy to maintain.

### Database
- Implement connection pool with normalized **<font color=#66AABB>MySQL</font>** & set Member profile index.
### Cloud Services
- AWS EC2
### Version Control
- Git / GitHub

## Frontend Technique

- HTML
- CSS
- Use  **<font color=#66AABB>Javascript</font>** to build infinite Scroll, Lazing Loading and photo carousel.   
## Third-party

- Adapt Third-Party Payment System, the **<font color=#66AABB>TapPay</font>**.

## Architecture

- Server Architecture
![Alt text](static/image/arichite.png)

## Database Schema

![Alt text](static/image/databases.png)
