name 'vagrant'

override_attributes(
    'user'   => 'vagrant',
    'deploy' => {
        'api' => {
            'deploy_to'              => '/vagrant',
            'domains'                => ['api.spacesynter.vm'],
            'environment_variables'  => {}
            'proxy_pass'             => 'http://localhost:9000'
        },
        'app' => {
            'deploy_to'              => '/vagrant',
            'document_root'          => 'build',
            'absolute_document_root' => '/vagrant/build/',
            'domains'                => ['spacesynter.vm'],
            'environment_variables'  => {}
            'proxies'                => {
                'api' => 'http://localhost:8000'
            },
            'proxy_pass' => 'http://localhost:9090'
        }
    },
    'environment' => {
        'APP_ENV'  => 'development',
        'APP_NAME' => 'spacesynter',
        'NODE_ENV' => 'development'
    },
    'packages' => {
        'apt' => ['docker.io', 'git', 'mongodb', 'nodejs', 'npm', 'redis-server', 'unzip'],
        'npm' => ['docker.io', 'mongodb', 'mongoose', 'pm2']
    }
)

run_list(
    'recipe[spacesynter]'
)