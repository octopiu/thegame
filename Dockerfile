FROM nginx
COPY game.conf /etc/nginx/sites-enabled/game.conf

docker run --name thegame -d nginx -v nginx:/etc/nginx
