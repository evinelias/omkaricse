taskkill /F /IM node.exe
cd backend
start cmd /k "npm run dev"
cd..
cd frontend
start cmd /k "npm run dev"