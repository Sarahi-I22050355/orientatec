module.exports = {
  apps: [
    {
      name: 'orientatec-backend',
      script: '/home/orientatec/backend/src/app.js',
      interpreter: 'node',
    },
    {
      name: 'orientatec-ia',
      script: '/home/orientatec/ia/venv/bin/uvicorn',
      interpreter: '/home/orientatec/ia/venv/bin/python3',
      cwd: '/home/orientatec/ia',
      args: 'main:app --host 0.0.0.0 --port 8000',
    }
  ]
};
