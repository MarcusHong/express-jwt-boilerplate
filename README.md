# express + jwt + swagger boilerplate

> jwt
> swagger
> refresh token
> mysql

## rsa
- generate rsa certs in libs/jwt

```bash
    $ openssl genrsa -out private.pem 2048
    $ openssl rsa -in private.pem -pubout -outform PEM -out public.pem
```
