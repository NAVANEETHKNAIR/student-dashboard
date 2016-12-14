FROM node:6.8

RUN mkdir -p /student-dashboard/src
WORKDIR /student-dashboard/src

COPY . /student-dashboard/src
RUN export RUN_BUILD=true
RUN npm install

EXPOSE 3000

CMD npm start
