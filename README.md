# Easyplotlib

![Easyplotlib banner image](docs/easyplotlib-banner.png)

Web-based editor for matplotlib. Easy to use.

## Instruction

The commands you run depend on the purpose. Execute the commands below for your desired usecase. Note that you only need to run one of the commands for each usecase; `./run.sh` is just a shortened form of the longer command.

```bash
# Development
## Full Stack
docker compose up -f docker-compose-dev.yml --build -d
./run.sh dev full

## Front only
docker compose up -f docker-compose-dev.yml --build -d frontend
./run.sh dev front

## Backend only
docker compose up -f docker-compose-dev.yml --build -d backend
./run.sh dev back

# Production
## Full Stack
docker compose up -f docker-compose-prod.yml --build -d
./run.sh prod full

## Front only
docker compose up -f docker-compose-prod.yml --build -d frontend
./run.sh prod front

## Backend only
docker compose up -f docker-compose-prod.yml --build -d backend
./run.sh prod back
```

## TODO

* Frontend
  * EditorDisplay
    * EditorFormDisplay
  * RenderDisplay
    * RenderCodeDisplay
    * RenderFigureDisplay
  * AboutView
* Backend
  * Features
    * Support every styles
      * Figure Style
      * Axes Style
      * Plot Style
    * Render a figure for the generated code
    * Mount backend to FastAPI
    * Mount backend to AWS
  * Security
    * Set limit to given objects (such as len(plot),...)
* Documentation
  * Complete README.mddocker compose build [<service_name>]
