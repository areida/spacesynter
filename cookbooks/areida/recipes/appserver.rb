packages = %w{docker.io git nodejs npm redis-server unzip}

packages.each do |pkg|
    package pkg do
        action  [:install, :upgrade]
        version node[:versions][pkg]
    end
end

execute 'npm install -g docker.io';