# Easyplotlib

![Easyplotlib banner image](docs/easyplotlib-banner.png)

Easyplotlib is a web-based editor that makes it easy to create [matplotlib](https://matplotlib.org/) [(github)](https://github.com/matplotlib/matplotlib) diagrams and code. Working with a Python backend and a Vue frontend.

## Dependencies

You need `docker`, `docker compose` to run this project.

## Instruction

The commands you run depend on the purpose. Execute the commands below for your desired usecase.

```bash
# === Production ===
## Full Stack
./run.sh prod full

## Front only
./run.sh prod front

## Backend only
./run.sh prod back

## Stop
./run.sh prod down
```

For development, execute the below.

```bash
# === Development ===
## Full Stack
./run.sh dev full

## Front only
./run.sh dev front

## Backend only
./run.sh dev back

## Stop
./run.sh dev stop
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
  * Complete README.md
