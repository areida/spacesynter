name 'vagrant'

override_attributes(
    'user'    => 'vagrant',
    'servers' => {
        'app' => {
            'proxies' => {
                'api' => 'http://localhost:8000'
            },
            'proxy_pass'  => 'http://localhost:9000',
            'root'        => '/vagrant/build',
            'server_name' => 'spacesynter.vm'
        }
    },
    'deploy' => {
        'spacesynter' => {
            'environment' => {
                'APP_ENV'  => 'development',
                'APP_NAME' => 'spacesynter'
            }
        }
    },
    'packages' => {
        'apt' => ['docker.io', 'git', 'mongodb', 'nodejs', 'npm', 'redis-server', 'unzip'],
        'npm' => ['docker.io', 'pm2']
    }
)

run_list(
    'recipe[spacesynter]'
)