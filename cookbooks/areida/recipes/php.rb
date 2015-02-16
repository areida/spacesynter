phpexecute 'sudo add-apt-repository -y ppa:ondrej/php5-5.6'

include_recipe 'apt-get-update'

packages = %w{php5 php5-mysql php5-pgsql php5-curl php5-mcrypt php5-cli php5-fpm php-pear imagemagick php5-imagick php5-intl php5-sqlite}

packages.each do |pkg|
    package pkg do
        action  [:install, :upgrade]
        version node[:versions][pkg]
    end
end

execute 'phpunit-install' do
    command 'pear config-set auto_discover 1; pear install pear.phpunit.de/PHPUnit'
    not_if  { ::File.exists?('/usr/bin/phpunit')}
end

execute 'composer-install' do
    command 'curl -sS https://getcomposer.org/installer | php ;mv composer.phar /usr/local/bin/composer'
    not_if  { ::File.exists?('/usr/local/bin/composer')}
end

template '/etc/nginx/conf.d/php-fpm.conf' do
    mode   0644
    source 'php-fpm.conf.erb'
end

file '/etc/php5/fpm/pool.d/www.conf' do
    action :delete
end

template '/etc/php5/fpm/pool.d/www2.conf' do
    mode   0644
    source 'www2.conf.erb'
end

template '/etc/php5/cli/conf.d/timezone.ini' do
    mode   0644
    source 'timezone.ini.erb'
end