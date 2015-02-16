packages = %w{redis-server docker.io}

packages.each do |pkg|
    package pkg do
        action  [:install, :upgrade]
        version node[:versions][pkg]
    end
end