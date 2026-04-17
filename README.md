# Création d'un certificat

## Génération d'un certificat auto-signé

Avec la commande openssl :  
génération de la clé privé:

````bash
openssl genpkey -algorithm EC -out private.key -pkeyopt ec_paramgen_curve:P-256```
````

Que nous enregistrons dans la variable d'environnement PKEY.

Génération certificat:

```bash
openssl req -new -key private.key -out csr.pem

openssl req -x509 -days 365 -key private.key -in csr.pem -out certificate.crt
```

Certificat que nous enregistrons dans CERT.

## Pour un certificat signé par une autorité de certification locale

### Création de l'autorité locale

```bash
openssl genpkey -algorithm EC -out CA.key -pkeyopt ec_paramgen_curve:P-384

openssl req -x509 -new -nodes -key CA.key -sha256 -days 3650 -out CA.crt

openssl x509 -req -in csr.pem -CA CA.crt -CAkey CA.key -CAcreateserial -out certificate1.crt -days 365 -sha256
```

Enregistrer private.key dans PKEY  
Enregistrer le certificat1.crt dans CERT  
Ne pas oublier d'ajouter CA.crt au certificat local de la machine.
