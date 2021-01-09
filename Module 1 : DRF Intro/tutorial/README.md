# Django REST Framework Intro
[![Python Version](https://img.shields.io/badge/python-3.8.5-brightgreen.svg)](https://python.org)
[![Django Version](https://img.shields.io/badge/django-1.11.23-brightgreen.svg)](https://djangoproject.com)
[![Django REST Framework](https://img.shields.io/badge/Django_REST_Framework-3.11.2-green.svg)](https://djangoproject.com)

## Prerequisite
- Python3 and pip3 `apt-get install python3`
- Virtual Environment `pip3 install virtualenv`

## Steps to deploy to your local machine
- create a project Directory let say `Project`
- Download and Extract this repo and move `myproject` to `Project` Directory.
- Open `Project` Directory in Terminal and execute 
```Shell
virtualenv venv -p python3
```
- Activate Virtual Environment 
```Shell
source venv/bin/activate
```
- Install Django 
```Python
pip install django
```
- Install Django REST Framework
```Python
pip install djangorestframework
```

- To start Project exec. 
```Python
django-admin startproject myproject
```
- Open myproject `cd myproject` .
- For setting up Database 
```Python
Python manage.py makemigrations
Python manage.py migrate
```      
- Run server 
```Python
python manage.py runserver
```
- look to `https://localhost:8000`
