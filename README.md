# Commandes à faire :

## C'est important que vous fassiez ca pour que ça marche

```bash
cd backend-xrpl
python3 -m venv xrpl-env
source xrpl-env/bin/activate
pip install requests && pip install xrpl-py && pip install uvicorn && pip install fastapi
```

Pour exécuter :

```bash
uvicorn main:app --reload
```

Pour quitter l'env :
```bash
deactivate
```

# Docker

```bash
cd ./tunedown
docker build -t tunedown .
```
Ensuite faut run l'image mais jle run depuis docker desktop donc la commande jsp exactement

# Pour le front

```bash
cd tunedown
npm install
npm run dev
```


ensuite faut aller sur le localhost de vite c'est un port chelou
