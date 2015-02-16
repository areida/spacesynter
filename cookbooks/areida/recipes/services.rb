service 'apache2' do
    action :stop
end

%w{mysql postgresql php5-fpm nginx}.each do |service_name|
    service service_name do
        action [:start, :restart]
    end
end