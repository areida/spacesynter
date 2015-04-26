template '/etc/environment' do
    source 'environment.erb'
    mode 0664
    variables({
        :environment => node[:deploy][:spacesynter][:environment]
    })
end