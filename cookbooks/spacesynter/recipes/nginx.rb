execute 'apt-get install -y nginx' do
    not_if 'which nginx'
end

template '/usr/local/bin/nginx_ensite' do
    not_if {File.exists?('/usr/local/bin/nginx_ensite')}
    source 'nginx_ensite.erb'
end

execute 'nginx dissite link' do
    command 'ln -snf /usr/local/bin/nginx_ensite /usr/local/bin/nginx_dissite'
end

execute 'nginx_ensite_executable' do
    command 'chmod +x /usr/local/bin/nginx_*'
end