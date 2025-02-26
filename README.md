# Scrape City

## Overview  
Scrape City simplifies web scraping by providing users with an intuitive interface to request scraping services, manage orders, and obtain structured data outputs. The application prioritizes user-friendly data extraction, leveraging robust backend architecture and responsive frontend design.

## Core Features  

### User Authentication and Account Management  
- JWT-based tokenized authentication for secure user sessions.  
- Manage account information directly from the user dashboard.  

### Scraping Order Creation and Payment  
- Order web scraping services and complete payments via voucher system.  
- Track and manage all orders seamlessly.  

### Data Output Options  
- Access both raw and cleaned data outputs post-scraping.  
- Download data for external analysis or integration.  

### Third-Party Integration with ScrapeNinja  
- Efficient scraping handled via ScrapeNinja API.  
- Internal focus remains on user management and data processing.  

### Voucher-Based Payment Integration  
- Simple and secure payment solution with easy voucher redemption.  

## Technologies Used  

### Backend  
- **Python**: Core language for business logic and APIs.  
- **Django**: Robust web framework with built-in ORM, admin interface, and security.  
- **Django REST Framework (DRF)**: For creating RESTful APIs with authentication and serialization.  
- **BeautifulSoup4**: For HTML/XML data parsing and cleaning.  
- **ScrapeNinja API**: Scalable web scraping solution.  

### Frontend  
- **React.js with TypeScript**: Dynamic and type-safe UI development.  
- **Material-UI (MUI)**: Consistent, responsive design with customizable theming.  
- **Axios**: Handles HTTP requests between React frontend and Django backend.  

### Data Storage  
- **PostgreSQL**: Hosted on AWS RDS for relational data management.  

### Deployment  
- **Frontend**: Deployed on Vercel.  
- **Backend**: Deployed on AWS Elastic Beanstalk.  
- **Database**: Managed with AWS RDS (PostgreSQL).  

## Interaction Flow  

1. **User Interaction**: Users trigger frontend events via React UI.  
2. **API Requests**: Axios sends HTTP requests to Django REST API.  
3. **Data Processing**: Django handles requests, performs scraping via ScrapeNinja, and cleans data with BeautifulSoup4.  
4. **UI Update**: React updates the UI with processed data in real time.  

## Getting Started  

### Prerequisites  

#### Frontend  
- Node.js (v16+)  
- npm or yarn  

#### Backend  
- Python (v3.8+)  
- Django (v4.x)  
- PostgreSQL  
