#!/bin/bash
 
set -e -x
service apache2 stop
service mysql start
service postgresql start
service php5-fpm start
service nginx start
