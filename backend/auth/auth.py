from passlib.context import CryptContext

crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_contrasenia(contrasenia_plana, contrasenia_hasheada):
    return crypt_context.verify(contrasenia_plana, contrasenia_hasheada)

def hashear_contrasenia(contrasenia):
    return crypt_context.hash(contrasenia)