# DOCKER-VERSION 1.0.0

FROM ubuntu

RUN \
    add-apt-repository -y ppa:ondrej/php5-5.6
    apt-get update --fix-missing && \
    apt-get install -y git nginx mysql-server postgresql curl redis-server
    apt-get install -y php5 php5-mysql php5-pgsql php5-curl php5-mcrypt php5-cli php5-fpm php-pear imagemagick php5-imagick php5-intl
    curl -sS https://getcomposer.org/installer | php ;mv composer.phar /usr/local/bin/composer
    rm /etc/php5/fpm/pool.d/www.conf
CMD ["bash"]

ADD templates/php-fpm.conf /etc/nginx/conf.d/php-fpm.conf

add docker/www2.conf /etc/php5/fpm/pool.d/www2.conf

ADD docker/timezone.ini /etc/php5/cli/conf.d/timezone.ini

EXPOSE 22 80
 
