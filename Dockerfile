FROM ubuntu:14.04

RUN \
    add-apt-repository -y ppa:ondrej/php5-5.6 && \
    apt-get update --fix-missing && \
    apt-get install -y git nginx mysql-server postgresql curl redis-server && \
    apt-get install -y php5 php5-mysql php5-pgsql php5-curl php5-mcrypt php5-cli php5-fpm php-pear imagemagick php5-imagick php5-intl && \
    curl -sS https://getcomposer.org/installer | php ;mv composer.phar /usr/local/bin/composer
CMD ['bash']

ADD templates/php-fpm.conf /etc/nginx/conf.d/php-fpm.conf
RUN chmod 0644 /etc/nginx/conf.d/php-fpm.conf

RUN rm /etc/php5/fpm/pool.d/www.conf
ADD docker/www2.conf /etc/php5/fpm/pool.d/www2.conf
RUN chmod 0644 /etc/php5/fpm/pool.d/www2.conf

ADD docker/timezone.ini /etc/php5/cli/conf.d/timezone.ini
RUN chmod 0644 /etc/php5/cli/conf.d/timezone.ini

ADD docker/run.sh /run.sh
RUN chmod a+x /run.sh

EXPOSE 22 80
ENTRYPOINT ['/run.sh']
