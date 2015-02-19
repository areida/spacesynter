FROM phusion/baseimage:0.9.16

# Use baseimage-docker"s init system.
CMD ["/sbin/my_init"]

# Install dependencies
RUN apt-get update --fix-missing && apt-get install -y \
        python-software-properties \
        software-properties-common && \
    add-apt-repository -y \
        ppa:ondrej/php5-5.6 && \
    apt-get install -y \
        curl \
        git \
        mysql-client \
        nginx \
        php-pear \
        php5 \
        php5-cli \
        php5-curl \
        php5-fpm \
        php5-intl \
        php5-mcrypt \
        php5-mysql \
        php5-pgsql \
        postgresql-client \
        redis-server \
        wget && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Configure php and nginx
RUN sed -i "s/;date.timezone =.*/date.timezone = UTC/" /etc/php5/fpm/php.ini && \
    sed -i "s/;date.timezone =.*/date.timezone = UTC/" /etc/php5/cli/php.ini && \
    sed -i -e "s/;daemonize\s*=\s*yes/daemonize = no/g" /etc/php5/fpm/php-fpm.conf && \
    sed -i "s/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/" /etc/php5/fpm/php.ini && \
    echo "daemon off;" >> /etc/nginx/nginx.conf

# Add services
RUN mkdir -p /srv/www && \
    mkdir /etc/service/nginx && \
    mkdir /etc/service/php-fpm && \
    mkdir /etc/service/redis

ADD docker/default    /etc/nginx/sites-available/default
ADD docker/nginx.sh   /etc/service/nginx/run
ADD docker/php-fpm.sh /etc/service/php-fpm/run
ADD docker/redis.sh   /etc/service/redis/run

RUN chmod +x /etc/service/nginx/run && \
    chmod +x /etc/service/php-fpm/run && \
    chmod +x /etc/service/redis/run

## Add environment variables
RUN echo qa > /etc/container_environment/APP_ENV

EXPOSE 22 80