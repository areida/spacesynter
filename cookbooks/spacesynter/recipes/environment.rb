environment = node[:environment]

node[:deploy].each do |application, deploy|
    environment = environment.merge(deploy[:environment_variables])
end

template '/etc/environment' do
    source 'environment.erb'
    mode 0664
    variables({
        :environment => environment
    })
end