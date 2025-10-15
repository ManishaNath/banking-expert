# 💰 Banker Expert – Personal Financial Intelligence

🎯 **Project Purpose**  
This project aims to provide a personalized financial assistant that analyzes user data and delivers comprehensive reports — as if written by a private banker and senior accountant.

⚙️ **Tech Stack**  
- **Backend:** Node.js (Express)  
- **Authentication Service:** MongoDB  
- **AI Engine:** Tinyllama  
- **Crypto Wallet Integration:** CoinGecko API 
- **Testing:** Jest  
- **Frontend:** React

🧩 **Architecture Overview**  
The system uses a modular monolith architecture — clear separation of services without microservices overhead:

![Diagram](readmeFiles/Diagram.png)

## 🔧 Architecture Improvement Proposal
Building on the current modular monolith, we can future-proof the platform by incrementally introducing a
service-sliced architecture that keeps shared concerns simple:

- **API Gateway Facade:** Introduce a thin gateway in front of the Express server to aggregate responses from the AI, auth,
  and wallet services. This allows us to expose a single endpoint to the React client while swapping implementations (e.g.,
  Moralis vs. on-chain RPC) without frontend changes.
- **Event-Driven Data Pipeline:** Capture wallet syncs and AI report generation requests as domain events stored in a queue
  (Redis Streams or RabbitMQ). The AI microservice can subscribe to `report.requested` events and emit `report.generated`,
  enabling retries, auditing, and better observability.
- **Shared Contract Library:** Extract DTO and validation logic (wallet address schemas, report request contracts) into a
  shared package consumed by both the Express backend and React frontend to keep the TypeScript types aligned once the codebase
  migrates.
- **Secrets Broker for Multi-Environment Deployments (High Priority):** Externalise sensitive configuration such as MongoDB
  URIs, Moralis keys, and JWT secrets into a dedicated secrets management service (HashiCorp Vault or AWS Secrets Manager).
  The gateway or backend would fetch secrets on boot, ensuring production parity and preventing local misconfiguration issues
  (like missing JWT secrets) from blocking logins. This also aligns with the roadmap to split services without duplicating
  secret-distribution logic.

✅ **Current Features**
- 🟢 Base Express server running
- 🟢 Modular services
- 🟢 Project is structured for clarity, testing, and growth
- 🟢 Crypto wallet connection and analysis
- 🟢 AI-generated financial reports

🔜 **Coming Soon**  
  
- Full frontend interface (React)
- Full authentication flow with JWT

## 🪙 Wallet Connection (MetaMask)
1. Ensure the MetaMask browser extension is installed and unlocked.
2. Once user is successfully loggedin after the registration, he will be prompted to **Connect Wallet**. MetaMask will prompt you to authorise access.
3. Once connected, the header displays the shortened wallet address and automatically updates if you switch accounts in
   MetaMask.

### 📦 Prerequisites 
- Node.js 
- Git for version control  

### 🔄 Clone the Repository
```bash
git clone 
```

### 🚀 Run the project

**Install dependencies:**
```bash
npm install
```

**Start the server:**
```bash
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint      | Description                           |
|--------|---------------|---------------------------------------|
| POST   | /auth/login   | Authenticate a user                   |
| POST   | /auth/register| Register a user                       |
| POST   | /full-report  | Get personalized report               |


## 📄 License
MIT License




