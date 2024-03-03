# Proyecto --- ISIS-4426 Desarrollo de soluciones cloud 

## Integrantes
- Brenda Catalina Barahona Pinilla - bc.barahona@uniandes.edu.co
- Juan Diego Gonzalez Gomez - jd.gonzalezg1@uniandes.edu.co
- Kevin Steven Gamez Abril - ks.gamez@uniandes.edu.co
- Sergio Julian Zona Moreno - sj.zona@uniandes.edu.co

## Wiki
> [!IMPORTANT]  
> 👉 Link a la [Wiki](https://github.com/JuanDiegoGonzalez/Proyecto_Cloud_Grupo2/wiki/Wiki) del proyecto


## Pasos para Ejecutar la Aplicación

1. Clonar el repositorio `https://github.com/JuanDiegoGonzalez/Proyecto_Cloud_Grupo2`
2. Desde una terminal, en la carpeta raíz del repositorio, ejecutar los comandos:
   - `docker-compose build`
   - `docker-compose up –d`
3. Ingresar a la ruta: `http://localhost:3000/`

> [!WARNING]  
> **NOTA:** Si la página no carga, o si aparece el error `This page isn’t working. localhost didn’t send any data. ERR_EMPTY_RESPONSE`, esperar unos segundos mientras se termina de ejecutar el Frontend.

## Archivos
### Diagrama de Despliegue

![_Figura 1. Diagrama de despliegue._](https://github.com/JuanDiegoGonzalez/Proyecto_Cloud_Grupo2/blob/main/docs/Despliegue.jpg)

La arquitectura de Software es bastante sencilla. En primera instancia, el usuario se conecta a internet y por medio de la IP pública de la instancia EC2 de AWS donde puede acceder al servicio de Frontend de la aplicación. Este servicio, a su vez se alimenta del servicio de Backend que se encuentra involucrado con otros tres servicios: la base de datos de PostgreSQL, Redis y Celery. Redis y Celery son quienes permiten el funcionamiento asincrónico del backend, siendo Redis el Message Broker al cuál se suscribe Celery, el cual posteriormente inicia los Workers necesarios para procesar los archivos y actualizar la base de datos de PostgreSQL. De manera paralela, el Backend tiene una conexión directa con la base de datos para poder extraer la información de manera rápida y enviarla al cliente en el Frontend. Los archivos originales y procesados en PDFs se almacenan en una carpeta en el Backend, por lo que dichos archivos se encuentran en el volumen donde se clona el repositorio de la instancia EC2.
