FROM node:6.8

RUN npm install pm2 -g

RUN mkdir -p /student-dashboard/src

WORKDIR /student-dashboard/src

COPY ./package.json /student-dashboard/src

RUN npm install

COPY . /student-dashboard/src

RUN NODE_ENV=production npm run-script build

RUN useradd -g users user
RUN chown -R user:users /student-dashboard/src
USER user

EXPOSE 3000

CMD ["pm2-docker", "process.yml"]
