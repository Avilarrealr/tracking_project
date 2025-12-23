rm -R -f ./migrations &&
pipenv run init &&
dropdb -h localhost example || true &&
createdb -h localhost example || true &&
psql -h localhost example -c 'CREATE EXTENSION unaccent;' || true &&
pipenv run migrate &&
pipenv run upgrade
