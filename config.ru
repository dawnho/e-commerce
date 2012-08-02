require 'rubygems'
require 'open-uri'
require 'sinatra'
require 'rack-livereload'

mime_type :coffee, "text/coffeescript"

set :public, File.dirname(__FILE__) + '/'

get '/' do
  open(File.dirname(__FILE__) + '/index.html').read
end

use Rack::LiveReload

run Sinatra::Application
