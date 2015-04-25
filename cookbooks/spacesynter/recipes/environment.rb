template '/etc/environment' do
    source 'environment.erb'
    mode 0664
    variables({
        :environment => node[:environment]
    })
end