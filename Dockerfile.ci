FROM node:6.8

RUN mkdir -p /student-dashboard/src

WORKDIR /student-dashboard/src

COPY ./package.json /student-dashboard/src

RUN npm install

COPY . /student-dashboard/src

RUN NODE_ENV=production npm run-script build

EXPOSE 3000

CMD npm start
