FROM ubuntu:14.04

RUN DEBIAN_FRONTEND=noninteractive apt-get update --fix-missing
RUN DEBIAN_FRONTEND=noninteractive apt-get dist-upgrade -y
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install python-software-properties
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install software-properties-common
RUN DEBIAN_FRONTEND=noninteractive add-apt-repository -y ppa:ondrej/php5-5.6
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y git nginx mysql-server postgresql curl redis-server
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y php5 php5-mysql php5-pgsql php5-curl php5-mcrypt php5-cli php5-fpm php-pear imagemagick php5-imagick php5-intl
RUN curl -sS https://getcomposer.org/installer | php ;mv composer.phar /usr/local/bin/composer

ADD docker/php-fpm.conf /etc/nginx/conf.d/php-fpm.conf
RUN chmod 0644 /etc/nginx/conf.d/php-fpm.conf

RUN rm /etc/php5/fpm/pool.d/www.conf
ADD docker/www2.conf /etc/php5/fpm/pool.d/www2.conf
RUN chmod 0644 /etc/php5/fpm/pool.d/www2.conf

ADD docker/timezone.ini /etc/php5/cli/conf.d/timezone.ini
RUN chmod 0644 /etc/php5/cli/conf.d/timezone.ini

ADD . /srv/www/

ADD docker/start.sh /start.sh
RUN chmod a+x /start.sh

EXPOSE 22 80
ENTRYPOINT ['/start.sh']
