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

  # Findings Review & Additional Suggestions

## Login Failure Diagnosis
- **Observation:** Registration succeeds, but login always returns an error.
- **Root Cause (confirmed):** When `JWT_SECRET` is unset, the previous implementation rejected every login attempt with the error `"JWT secret not configured"`.
- **Resolution to be Applied:** Introduce a `resolveJwtSecret` helper that falls back to a scoped development secret in non-production environments while still enforcing a hard failure in production. This unblocks local testing and highlights the missing configuration through a console warning.

## High-Priority Architecture Improvement
- Externalise all sensitive configuration (MongoDB URI, JWT secret, Moralis API key, AI provider key) into a secrets manager or environment broker.
- Benefits:
  - Eliminates the class of login/configuration failures discovered above.
  - Simplifies future migration to the proposed API gateway + service-sliced architecture because each service can request secrets from a single authority.
  - Improves incident response by enabling secret rotation without redeploying every service.

## Additional Suggestions
- Document required environment variables explicitly in the root README (done) and provide an `.env.example`
- Add a health-check endpoint that validates database connectivity and secret availability; surface its status on the React dashboard to catch misconfiguration earlier.
- **Wallet address UX hardening (validated):** Replace manual address entry in the `/report` flow with read-only, checksummed
  values sourced from the connected wallet provider. Render both the canonical string and a QR code so users can scan the
  destination from another device without relying on copy/paste. This addresses the user's finding about clipboard-swap and
  DOM-injection attacks, and materially reduces the risk of typos leading to incorrect reports. For Ethereum this can ship
  immediately because we already capture the MetaMask account in the React state. Bitcoin support requires a multi-chain
  connector because MetaMask cannot expose native BTC accounts; adopting a wallet such as Trust Wallet via WalletConnect v2
  would unlock BTC + ETH retrieval through a unified interface and align with the roadmap to expand multi-chain analytics.(implemented, refer to diagrams attached- "banking-expert\banking-expert diagrams\walletautopopulates10.png"

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





