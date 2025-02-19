## **Frontend README (React & TypeScript)**

### **Prerequisites**
Before running the frontend, ensure you have:
- **Node.js 16+** (Required)
- **npm** or **yarn** (Package Manager)
- **Vite** (for fast development builds)

---

### **Setting Up the Frontend**

#### **1️. Clone the Repository**
```bash
git clone https://github.com/supersonicwisd1/home-frontend.git
cd home-frontend
```

#### **2️. Install Dependencies**
Using **npm**:
```bash
npm install
```
Or using **yarn**:
```bash
yarn install
```

#### **3️. Configure Environment Variables**
Create a **`.env`** file in the root directory:
```bash
touch .env
```
Then, add the following variables:
```ini
VITE_API_URL=http://127.0.0.1:8000/api
VITE_WEBSOCKET_URL=ws://127.0.0.1:8000/ws/chat/
```

#### **4️. Run the Development Server**
```bash
npm run dev
```
Or with **yarn**:
```bash
yarn dev
```
This should output something like:
```
  VITE v4.0.0  ready in 300ms
  ➜  Local: http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```
Now open **http://localhost:5173/** in your browser.