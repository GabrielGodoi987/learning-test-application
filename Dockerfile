ARG IMG=node:22-alpine

#COMMON

FROM ${IMG} AS builder

WORKDIR /app

COPY . .

RUN npm install

#DEVELOPMENT

FROM builder AS dev

RUN apk add --no-cache bash

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "sh", "entrypoint.sh" ]

CMD [""]


# PROD MIDDLE STEP

FROM builder AS prod-build

RUN npm run build

RUN npm prune --production # this will clean up our node_modules


#PROD LAYER
FROM ${IMG} AS prod

# we need to understand in depth the reason of this command and the subsequently commands
COPY --chown=node:node --from=prod-build /app/dist /app/dist 
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
COPY --chown=node:node --from=prod-build /app/.env /app/.env

ENV NODE_ENV=production

ENTRYPOINT ["node", "main.js"]

# Não entendi muito bem
WORKDIR /app/dist

CMD [""]

USER node
