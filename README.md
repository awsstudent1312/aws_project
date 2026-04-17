# Creation d'un certificat

## Génération d'un certificat auto signé

avec openssl

````bash
openssl genpkey -algorithm EC -out private.key -pkeyopt ec_paramgen_curve:P-256```
````

que nous enregistront dans la variable d'envronnement PKEY

```bash
openssl req -new -key private.key -out csr.pem

openssl req -x509 -days 365 -key private.key -in csr.pem -out certificate.crt
```

certificat que nous enregistront dans CERT

## Pour un certificat signer part une autorité de certification locale

### creation de l'autorité local

```bash
openssl genpkey -algorithm EC -out CA.key -pkeyopt ec_paramgen_curve:P-384

openssl req -x509 -new -nodes -key CA.key -sha256 -days 3650 -out CA.crt

openssl x509 -req -in csr.pem -CA CA.crt -CAkey CA.key -CAcreateserial -out certificate1.crt -days 365 -sha256
```

enregistrer private.key dans PKEY
enregistrer le certificat1.crt dans CERT
