npx sequelize model:generate --name Group --attributes organizerId:integer,name:string,about:text,type:string,private:boolean,city:string,state:string
npx sequelize seed:generate --name groups

// reset db:
npx dotenv sequelize db:seed:undo:all
npx dotenv sequelize db:migrate:undo:all
npx dotenv sequelize db:migrate
npx dotenv sequelize db:seed:all

// migrate and seeding all:
npx dotenv sequelize db:migrate
npx dotenv sequelize db:seed:all

// access Render Postgres db
# PGPASSWORD=w5GV4y0wwlQH3MDPPQreaKldCinnYJ61 psql -h dpg-chhapp64dad31tk9c3kg-a.oregon-postgres.render.com -U app_academy_projects_0syt_user app_academy_projects_0syt
# \dn        list all schemas in the db
# \dt meetup_schema.*   list all tables in meetup_schema
# SELECT * FROM "meetup_schema"."Users";
# SELECT * FROM "meetup_schema"."Groups";

//////////////////
Create a model file & a blank migration file:
npx sequelize model:generate --name <NameOfModel> --attributes <column1Name:type,column2Name:type>
npx sequelize model:generate --name Color --attributes name:string

Create a blank migration file only:
npx sequelize migration:generate --name <name-of-migration-file>
npx sequelize migration:generate --name add-isPrimary-to-Colors

Run the migration:
npx dotenv sequelize db:migrate

Undo all migrations:
npx dotenv sequelize db:migrate:undo:all
npx dotenv sequelize-cli db:migrate:undo:all --to <name of migration>

Create a blank seeder file:
npx sequelize seed:generate --name <name-of-seed-file>
npx sequelize seed:generate --name primary-colors

Run all seeder files:
npx dotenv sequelize db:seed:all

Undo all seeder files:
npx dotenv sequelize db:seed:undo:all
