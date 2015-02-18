FROM phusion/baseimage:0.9.16

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

# Install stuff
RUN apt-get update --fix-missing
RUN apt-get dist-upgrade -y
RUN apt-get -y install python-software-properties
RUN apt-get -y install software-properties-common
RUN add-apt-repository -y ppa:ondrej/php5-5.6
RUN apt-get install -y vim curl wget git mysql-server postgresql redis-server
RUN apt-get install -y php5 php5-mysql php5-pgsql php5-curl php5-mcrypt php5-cli php5-fpm php-pear imagemagick php5-imagick php5-intl
RUN curl -sS https://getcomposer.org/installer | php ;mv composer.phar /usr/local/bin/composer

RUN echo qa > /etc/container_environment/APP_ENV

RUN sed -i "s/;date.timezone =.*/date.timezone = UTC/" /etc/php5/fpm/php.ini
RUN sed -i "s/;date.timezone =.*/date.timezone = UTC/" /etc/php5/cli/php.ini

RUN apt-get install -y nginx

RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN sed -i -e "s/;daemonize\s*=\s*yes/daemonize = no/g" /etc/php5/fpm/php-fpm.conf
RUN sed -i "s/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/" /etc/php5/fpm/php.ini
 
RUN mkdir -p          /srv/www
ADD docker/default    /etc/nginx/sites-available/default
RUN mkdir             /etc/service/nginx
ADD docker/nginx.sh   /etc/service/nginx/run
RUN chmod +x          /etc/service/nginx/run
RUN mkdir             /etc/service/php-fpm
ADD docker/php-fpm.sh /etc/service/php-fpm/run
RUN chmod +x          /etc/service/php-fpm/run
RUN mkdir             /etc/service/redis
ADD docker/redis.sh   /etc/service/redis/run
RUN chmod +x          /etc/service/redis/run

# Add projectfiles
ADD . /srv/www/

EXPOSE 22 80

# Clean up APT
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
