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

# Pour le front

```bash
cd tunedown
npm install
```

# Docker

```bash
cd ./tunedown
docker build . -t "tunedown"
docker images # verifier que l'image a été créee
npm install serve -g # optionnel, seulement si serve n'est pas installé
npm run dev   # vérifier que ca tourne encore (ctrl-C apres avoir vérifié)
npm run build
serve -s dist
```

Rejoindre le local ou le network
