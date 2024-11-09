#!/bin/bash

# Function to display usage information
usage() {
    echo "Usage: $0 <environment> [<component> | down]"
    echo "<environment> = dev  | prod"
    echo "<component>   = full | front | back"
    exit 1
}

# Check if correct number of arguments is provided
if [ $# -ne 2 ]; then
    usage
fi

# Assign arguments to variables
ENV=$1
COMPONENT=$2

# Validate environment argument
if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
    echo "Invalid environment. Use 'dev' or 'prod'."
    usage
fi

# Validate component argument
if [ "$COMPONENT" != "full" ] && [ "$COMPONENT" != "front" ] && [ "$COMPONENT" != "front" ] && [ "$COMPONENT" != "down" ]; then
    echo "Invalid component. Use 'full', 'front', or 'back'. If you want to end the execution, use 'down'."
    usage
fi

# Set the docker-compose file based on environment
if [ "$ENV" == "dev" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
else
    COMPOSE_FILE="docker-compose.prod.yml"
fi

# Execute the appropriate docker-compose command
if [ "$COMPONENT" == "full" ]; then
    docker compose -f $COMPOSE_FILE up --build -d
elif [ "$COMPONENT" == "front" ]; then
    docker compose -f $COMPOSE_FILE up --build -d frontend
elif [ "$COMPONENT" == "back" ]; then
    docker compose -f $COMPOSE_FILE up --build -d backend
elif [ "$COMPONENT" == "down" ]; then
    docker compose -f $COMPOSE_FILE down
fi

echo "Executed: docker compose -f $COMPOSE_FILE up --build -d $COMPONENT"
