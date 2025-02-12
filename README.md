# Commandes à faire :

## Backend

```bash
docker compose up --build
```

## Frontend

# Pour le front

```bash
cd tunedown
docker compose up --build
```

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

# Pour le front

```bash
cd tunedown
npm install
docker compose up --build
```
