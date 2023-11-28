Fabric Portal application

Backend setup

The first thing to do is to clone the repository:

$ git clone Project_URL

$ cd fabric_portal

Create a virtual environment to install dependencies in and activate it:

$ python3 -m venv env

$ source env/bin/activate

Install project dependencies:

(env)$ pip install -r requirements.txt

Once pip has finished downloading the dependencies

If you got any errors while install requirements means Linux system dont have dependencies 
we need do below steps install python dependencies

sudo apt-get update

sudo apt-get install -y build-essential

sudo apt-get install -y python3.11-dev

sudo apt-get install -y libpq-dev


(env)$ cd fabric_portal


Then simply apply the makemigrations:

$ python3 manage.py makemigrations


Then simply apply the migrations:

$ python3 manage.py migrate

You can now run the development server:

(env)$ python3 manage.py runserver

And navigate to http://127.0.0.1:8000/


