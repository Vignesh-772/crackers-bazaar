# Crackers Bazaar

A modern e-commerce platform for fireworks and crackers, built with React TypeScript frontend and Spring Boot backend.

## Project Structure

```
crackers-bazaar/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/crackersbazaar/
│   │   ├── CrackersBazaarApplication.java
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   └── controller/
│   │       └── HealthController.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── frontend/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   └── Footer.tsx
│   │   ├── types/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.tsx
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will be available at `http://localhost:8080`

3. Access the H2 database console at `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: `password`

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Features

### Backend (Spring Boot)
- RESTful API endpoints
- CORS configuration for frontend integration
- H2 in-memory database for development
- Health check endpoint
- Spring Security (basic setup)
- JPA/Hibernate for data persistence

### Frontend (React)
- Modern React with hooks
- React Router for navigation
- Axios for API calls
- Responsive design
- Component-based architecture
- Real-time API status checking

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /h2-console` - H2 database console (development only)

## Development

### Running Both Applications

1. Start the backend:
   ```bash
   cd backend && mvn spring-boot:run
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend && npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/crackers-bazaar-backend-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
```

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Web
- Spring Data JPA
- Spring Security
- H2 Database
- Maven

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3
- JavaScript ES6+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
